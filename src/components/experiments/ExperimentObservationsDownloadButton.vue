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
    :id="'experimentObservationsDownloadButton-' + trialDbId"
    class="experiment-observations-download-button"
  >
    <FormModal
      v-bind:active.sync="modalActive"
      v-bind:title="modalTitle"
      v-on:deactivate="cancelDownload"
    >
      <template #form>
        <div class="columns mb-4">
          <!-- Dataset Select -->
          <div class="column control">
            <div class="field">
              <label
                class="label required"
                for="dataset-select"
              ><span class="required">Dataset</span></label>
              <div class="control">
                <div class="select">
                  <select
                    id="dataset-select"
                    v-model="fileOptions.dataset"
                  >
                    <option
                      v-for="option in datasetOptions"
                      v-bind:key="option.id"
                      v-bind:value="option.id"
                    >
                      {{ option.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <!-- Environments Multi-select -->
          <div class="column control">
            <fieldset>
              <legend class="label required">
                <span class="required">Environment(s)</span>
              </legend>
              <div
                v-for="option in environmentOptions"
                v-bind:key="option.id"
                class="control"
              >
                <label class="checkbox">
                  <input
                    v-model="fileOptions.environments"
                    type="checkbox"
                    v-bind:value="option.id"
                  >
                  {{ option.name }}
                </label>
              </div>
            </fieldset>
            <span
              class="form-error has-text-danger"
              :class="{ 'is-invisible': ( fileOptions.environments.length > 0 ) }"
            >
              <AlertTriangleIcon
                size="1x"
                aria-hidden="true"
                class="has-vertical-align-middle mr-1"
              />
              Missing Environment(s)
            </span>
          </div>
          <!-- Timestamps Switch -->
          <div class="column control">
            <fieldset>
              <legend class="label">
                <span>With{{ '\xa0' }}Timestamps?</span>
              </legend>
              <div class="field">
                <input
                  id="timestamps-switch"
                  v-model="fileOptions.includeTimestamps"
                  style="appearance: none; outline: auto;"
                  type="checkbox"
                  true-value="Yes"
                  false-value="No"
                  name="timestamps-switch"
                  class="switch is-info is-rounded"
                >
                <label
                  id="timestamps-label"
                  for="timestamps-switch"
                >{{ fileOptions.includeTimestamps }}</label>
              </div>
            </fieldset>
          </div>
          <!-- File Format Radio -->
          <div class="column control">
            <fieldset>
              <legend class="label">
                <span class="required">File{{ '\xa0' }}Format</span>
              </legend>
              <div
                v-for="option in fileExtensionOptions"
                v-bind:key="option.id"
              >
                <label
                  class="radio"
                >
                  <input
                    v-model="fileOptions.fileExtension"
                    type="radio"
                    v-bind:value="option.id"
                  >
                  {{ option.name }}
                </label>
              </div>
            </fieldset>
          </div>
        </div>
      </template>
      <template #buttons>
        <div class="columns">
          <div class="column is-whole has-text-centered buttons">
            <button
              class="button is-primary has-text-weight-bold"
              v-on:click="downloadList"
            >
              <strong>Download</strong>
            </button>
            <button
              class="button"
              v-on:click="cancelDownload"
            >
              Cancel
            </button>
          </div>
        </div>
      </template>
    </FormModal>
    <a
      href="javascript:void(0)"
      v-on:click="openExportModal"
    >
      <slot />
    </a>
  </section>
</template>


<script lang="ts">
import {Component, Vue, Prop} from "vue-property-decorator";
import {validationMixin} from "vuelidate";
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import {ExperimentExportOptions} from "@/breeding-insight/model/ExperimentExportOptions";
import {FileTypeOption} from "@/breeding-insight/model/FileTypeOption";
import {ExperimentDatasetOption} from "@/breeding-insight/model/ExperimentDatasetOption";
import {EnvironmentOption} from "@/breeding-insight/model/EnvironmentOption";
import FormModal from "@/components/modals/FormModal.vue";
import {AlertTriangleIcon} from 'vue-feather-icons';

@Component({
  mixins: [validationMixin],
  components: {FormModal, AlertTriangleIcon},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ExperimentObservationsDownloadButton extends Vue {

  @Prop()
  active!: boolean;
  @Prop()
  trialDbId!: string;
  @Prop()
  modalTitle?: string;

  private activeProgram?: Program;
  private modalActive: boolean = false;
  private fileOptions: ExperimentExportOptions = new ExperimentExportOptions();

  private fileExtensionOptions: object[] = Object.values(FileTypeOption);
  private datasetOptions: object[] = Object.values(ExperimentDatasetOption);
  private environmentOptions: object[] = Object.values(EnvironmentOption);

  openExportModal(){
    this.modalActive = true;
  }

  downloadList() {
    // Validate selected options.
    if (this.validateOptions()) {
      // Close modal.
      this.modalActive = false;
      // Open download URL in a new tab.
      if (this.activeProgram) {
        window.open(process.env.VUE_APP_BI_API_ROOT
            + '/v1/programs/'
            + this.activeProgram.id
            + '/experiments/'
            + this.trialDbId
            + '/export?fileExtension='
            + this.fileOptions.fileExtension
            + '&dataset='
            + this.fileOptions.dataset
            + '&environments='
            + this.fileOptions.environments
            + '&includeTimestamps='
            + this.fileOptions.timestampsTrueFalseString(),
            '_blank');
      }
    }
  }

  cancelDownload(){
    // Close modal.
    this.modalActive = false;
    // Reset file export options.
    this.fileOptions = new ExperimentExportOptions();
  }

  validateOptions(): boolean {
    if (this.fileOptions.environments.length === 0){
      this.$emit('show-error-notification', 'One or more environments must be selected.');
      return false;
    }
    return true;
  }
}
</script>