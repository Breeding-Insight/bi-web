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
        v-on:deactivate="closeSubEntityDatasetModal"
    >
      <template #form>
        <div class="message is-success">
          <div class="message-body">
            Prepare a dataset for repeated observations within {{ experimentObservationUnit }}.
          </div>
        </div>
        <div class="columns is-multiline is-vcentered mb-4">
          <!-- Dataset Name Select -->
          <div class="column is-7">
                  <AutoCompleteField
                      id="dataset-name-autocomplete"
                      v-bind:options="datasetNameOptions"
                      v-bind:value="datasetName"
                      v-bind:field-name="'Dataset Name'"
                      v-bind:field-help="'Create new or reuse a previously described sub-observation unit.'"
                      v-bind:show-label="true"
                  />
          </div>
          <!-- Environments Multi-select -->
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
                v-on:click="closeSubEntityDatasetModal"
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
  create!: () => boolean;
  @Prop()
  active!: boolean;
  @Prop()
  datasetNameOptions?: string[];
  @Prop()
  experimentObservationUnit!: string;

  private datasetName?: string;
  private datasetRepeatedMeasures?: number;

  closeSubEntityDatasetModal(){
    // Emit deactivate event, allows parent to reset form state, for example.
    this.$emit('deactivate');
  }

  invokeCreate(){
    // Invoke the create prop, which returns true if create succeeded.
    if (this.create())
    {
      // Close and deactivate modal.
      this.closeSubEntityDatasetModal();
    }
  }

}
</script>