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
    <FormModal
        v-bind:active.sync="active"
        v-bind:title="modalTitle"
        v-on:deactivate="deactivateModal"
    >
      <template #form>
        <div class="message is-success">
          <div class="message-body">
            Prepare a dataset for repeated observations within {{ defaultObservationLevel }}.
          </div>
        </div>
        <div class="columns is-multiline is-vcentered mb-4">
          <!-- Dataset Name Select -->
          <div class="column is-7">
                  <AutoCompleteField
                      id="dataset-name-autocomplete"
                      v-model="datasetName"
                      v-bind:options="datasetNameOptions"
                      v-bind:field-name="'Sub-Entity Name'"
                      v-bind:field-help="'Create new or reuse a previously described sub-observation unit.'"
                      v-bind:show-label="true"
                  />
          </div>
          <!-- Dataset Repeated Measures -->
          <div class="column is-5">
              <BasicInputField
                  id="dataset-repeated-measures"
                  v-model="datasetRepeatedMeasures"
                  v-bind:field-name="'Number of Repeated Measures'"
                  v-bind:field-help="'Maximum expected'"
              />
          </div>
        </div>
      </template>
      <template #buttons>
        <div class="columns">
          <div class="column is-whole has-text-centered buttons">
            <button
                class="button is-primary has-text-weight-bold"
                v-on:click="invokeCreate"
            >
              <strong>Create</strong>
            </button>
            <button
                class="button"
                v-on:click="deactivateModal"
            >
              Cancel
            </button>
          </div>
        </div>
      </template>
    </FormModal>
  </section>
</template>


<script lang="ts">
import {Component, Vue, Prop} from "vue-property-decorator";
import {validationMixin} from "vuelidate";
import FormModal from "@/components/modals/FormModal.vue";
import AutoCompleteField from "@/components/forms/AutoCompleteField.vue";
import BasicInputField from "@/components/forms/BasicInputField.vue";
import {Trial} from "@/breeding-insight/model/Trial";
import {between, maxLength, minLength, required, integer} from 'vuelidate/lib/validators'

@Component({
  mixins: [validationMixin],
  components: {BasicInputField, AutoCompleteField, FormModal}
})
export default class SubEntityDatasetModal extends Vue {

  @Prop()
  uniqueId!: string;
  @Prop()
  modalTitle?: string;
  @Prop()
  modalClass?: string;
  @Prop()
  create!: (string, number) => boolean;
  @Prop()
  active!: boolean;
  @Prop()
  datasetNameOptions?: string[];
  @Prop()
  experiment!: Trial;
  @Prop()
  defaultObservationLevel?: string;

  // Reactive, private (would not be reactive if declared without initial values).
  private datasetName: string = null;
  private datasetRepeatedMeasures: number = null;

  // Form validations. TODO: wire up validations!
  formValidations = {
    name: {required, minLength: minLength(1)},
    repeatedMeasures: {
      required,
      between: between(1, 100),  // Note: number of repeated measures is capped at 100 for performance considerations.
      integer
    }
  }

  deactivateModal(){
    // Reset form state.
    this.datasetName = null;
    this.datasetRepeatedMeasures = null;
    // Emit deactivate event.
    this.$emit('deactivate');
  }

  invokeCreate(){
    // Invoke the create prop, which returns true if create succeeded.
    if (this.create(this.datasetName, this.datasetRepeatedMeasures))
    {
      // Close and deactivate modal.
      this.deactivateModal();
    }
  }

}
</script>