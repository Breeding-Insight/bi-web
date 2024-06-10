<!--
- See the NOTICE file distributed with this work for additional information
- regarding copyright ownership.
-
- Licensed under the Apache License, Version 2.0 (the "License");
- you may not use this file except in compliance with the License.
- You may obtain a copy of the License at
-
-     http://www.apache.org/licenses/LICENSE-2.0
-
- Unless required by applicable law or agreed to in writing, software
- distributed under the License is distributed on an "AS IS" BASIS,
- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
- See the License for the specific language governing permissions and
- limitations under the License.
-->

<template>
  <section
    v-bind:id="'subEntityDatasetModal-' + uniqueId"
    class="sub-entity-dataset-modal"
  >
    <BaseModal
      v-bind:active.sync="active"
      v-bind:title="modalTitle"
      v-on:deactivate="deactivateModal"
    >
      <article class="media">
        <div class="media-content">
          <div class="content">
            <h2 class="is-5 title model-header">
              {{ modalTitle }}
            </h2>
          </div>
        </div>
      </article>
      <DataForm
        v-if="true"
        v-bind:row-validations="formValidations"
        v-bind:record.sync="newSubEntity"
        v-bind:data-form-state="newSubEntityFormState"
        v-on:submit="invokeCreate"
        v-on:cancel="deactivateModal"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
      >
        <template v-slot="validations">
          <div class="message is-success">
            <div class="message-body">
              Prepare a dataset for repeated observations within {{ defaultObservationLevel }}.
            </div>
          </div>
          <div class="columns is-multiline mb-4">
            <!-- Dataset Name Select -->
            <div class="column is-6">
              <AutoCompleteField
                id="dataset-name-autocomplete"
                v-model="newSubEntity.name"
                v-bind:options="datasetNameOptions"
                v-bind:validations="validations.name"
                v-bind:field-name="'Sub-Entity Name'"
                v-bind:field-help="'Create new or reuse a previously described sub-observation unit.'"
                v-bind:show-label="true"
              />
            </div>
            <!-- Dataset Repeated Measures -->
            <div class="column is-6">
              <BasicInputField
                id="dataset-repeated-measures"
                v-model="newSubEntity.repeatedMeasures"
                v-bind:validations="validations.repeatedMeasures"
                v-bind:field-name="'Repeated Measures'"
                v-bind:field-help="'Maximum expected'"
              />
            </div>
          </div>
        </template>
      </DataForm>
    </BaseModal>
  </section>
</template>


<script lang="ts">
import {Component, Vue, Prop} from "vue-property-decorator";
import {validationMixin} from "vuelidate";
import BaseModal from "@/components/modals/BaseModal.vue";
import AutoCompleteField from "@/components/forms/AutoCompleteField.vue";
import BasicInputField from "@/components/forms/BasicInputField.vue";
import {Trial} from "@/breeding-insight/model/Trial";
import {between, maxLength, minLength, required, integer} from 'vuelidate/lib/validators'
import BasicSelectField from "@/components/forms/BasicSelectField.vue";
import DataForm from "@/components/forms/DataForm.vue";
import {DatasetMetadata} from "@/breeding-insight/model/DatasetMetadata";
import {SubEntityDatasetNewRequest} from "@/breeding-insight/model/SubEntityDatasetNewRequest";
import {DataFormEventBusHandler} from "@/components/forms/DataFormEventBusHandler";

@Component({
  mixins: [validationMixin],
  components: {DataForm, BasicSelectField, BasicInputField, AutoCompleteField, BaseModal}
})
export default class SubEntityDatasetModal extends Vue {

  @Prop()
  uniqueId!: string;
  @Prop()
  modalTitle?: string;
  @Prop()
  modalClass?: string;
  @Prop()
  create!: (SubEntityDatasetNewRequest) => Promise<boolean>;
  @Prop()
  active!: boolean;
  @Prop()
  datasetNameOptions?: string[];
  @Prop()
  experiment!: Trial;
  @Prop()
  defaultObservationLevel?: string;

  // Reactive, private (would not be reactive if declared without initial values).
  private newSubEntity: SubEntityDatasetNewRequest = new SubEntityDatasetNewRequest();
  private newSubEntityFormState: DataFormEventBusHandler = new DataFormEventBusHandler();

  // Form validations.
  formValidations = {
    name: {
      required,
      minLength: minLength(1),
      maxLength: maxLength(200)},
    repeatedMeasures: {
      required,
      integer,
      between: between(1, 50),  // Note: capped at 50 for performance considerations.
    }
  }

  deactivateModal(){
    // Reset form state.
    this.newSubEntity = new SubEntityDatasetNewRequest();
    // Emit deactivate event.
    this.$emit('deactivate');
  }

  async invokeCreate(){
    try {
      // Invoke the create prop, which returns true if create succeeded.
      await this.create(this.newSubEntity)
      // Close and deactivate modal.
      this.deactivateModal();
    } catch (error) {
      this.$emit('show-error-notification', 'Error creating sub-entity dataset.');
    } finally {
      this.newSubEntityFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
    }
  }

}
</script>