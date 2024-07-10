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
  <DownloadModal
    v-bind:unique-id="trialId"
    v-bind:modal-title="modalTitle"
    v-bind:download="downloadList"
    v-bind:active="active && loadingStudyOptionsComplete && loadingDatasetOptionsComplete"
    modal-class="experiment-observations-download-button"
    v-on:deactivate="resetExportOptions"
  >
    <template #form>
      <div class="columns mb-4">
        <!-- Dataset Select -->
        <div class="column control">
          <div class="field">
            <label
              class="label"
              v-bind:for="`dataset-select-${trialId}`"
            ><span>Dataset</span></label>
            <div class="control">
              <div class="select">
                <select
                  v-bind:id="`dataset-select-${trialId}`"
                  v-model="fileOptions.datasetId"
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
            <div class="control">
              <label
                class="checkbox environment-option-label"
              >
                <input
                  v-model="fileOptions.allEnvironments"
                  type="checkbox"
                  value="all"
                >
                All Environments
              </label>
            </div>
            <div
              v-for="option in environmentOptions"
              v-bind:key="option.id"
              class="control"
            >
              <label class="checkbox environment-option-label">
                <input
                  v-model="fileOptions.environments"
                  type="checkbox"
                  v-bind:value="option.id"
                  v-bind:disabled="fileOptions.allEnvironments"
                >
                {{ option.name }}
              </label>
            </div>
          </fieldset>
          <span
            class="form-error has-text-danger"
            :class="{ 'is-invisible': ( !showEnvironmentsValidationError ) }"
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
                v-bind:id="`timestamps-switch-${trialId}`"
                v-model="fileOptions.includeTimestamps"
                type="checkbox"
                true-value="Yes"
                false-value="No"
                name="timestamps-switch"
                class="switch is-info is-rounded"
              >
              <label
                v-bind:id="`timestamps-label-${trialId}`"
                v-bind:for="`timestamps-switch-${trialId}`"
              >{{ fileOptions.includeTimestamps }}</label>
            </div>
          </fieldset>
        </div>
        <!-- File Format Radio -->
        <div class="column control">
          <fieldset>
            <legend class="label">
              <span>File{{ '\xa0' }}Format</span>
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
    <slot />
  </DownloadModal>
</template>


<script lang="ts">
import {Component, Vue, Prop, Watch} from "vue-property-decorator";
import {validationMixin} from "vuelidate";
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import {ExperimentExportOptions} from "@/breeding-insight/model/ExperimentExportOptions";
import {FileTypeOption} from "@/breeding-insight/model/FileTypeOption";
import {AlertTriangleIcon} from 'vue-feather-icons';
import {Trial} from "@/breeding-insight/model/Trial";
import {Metadata} from "@/breeding-insight/model/BiResponse";
import {Study} from "@/breeding-insight/model/Study";
import {StudyService} from "@/breeding-insight/service/StudyService";
import {Result} from "@/breeding-insight/model/Result";
import {BrAPIUtils} from "@/breeding-insight/utils/BrAPIUtils";
import DownloadModal from "@/components/modals/DownloadModal.vue";
import {DatasetMetadata} from "@/breeding-insight/model/DatasetMetadata";
import {ExperimentService} from "@/breeding-insight/service/ExperimentService";

@Component({
  mixins: [validationMixin],
  components: {DownloadModal, AlertTriangleIcon},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ExperimentObservationsDownloadModal extends Vue {

  @Prop()
  active!: boolean;
  @Prop()
  trialId!: string;
  @Prop()
  experiment!: Trial;
  @Prop()
  modalTitle?: string;
  @Prop()
  defaultDatasetId?: string;

  private activeProgram?: Program;
  private fileOptions: ExperimentExportOptions = new ExperimentExportOptions();
  private showEnvironmentsValidationError: boolean = false;
  private fileExtensionOptions: object[] = Object.values(FileTypeOption);
  private datasetOptions: DatasetMetadata[] = [];
  private environmentOptions: object[] = [];
  private loadingStudyOptionsComplete: boolean = false;
  private loadingDatasetOptionsComplete: boolean = false;

  @Watch('experiment', {immediate: true})
  onExperimentChanged() {
    // Reset loading flags.
    this.loadingStudyOptionsComplete = false;
    this.loadingDatasetOptionsComplete = false;
    this.getStudyOptions();
    this.getDatasetOptions();
  }

  async getStudyOptions() {
    // Fetch all environments (studies) for this experiment.
    try {
      const response: Result<Error, [Study[], Metadata]> = await StudyService.getAll(this.activeProgram!.id!, this.experiment);
      if(response.isErr()) throw response.value;
      let [studies, metadata] = response.value;
      // Set environment options.
      this.environmentOptions = studies.map((s) => ({id: BrAPIUtils.getBreedingInsightId(s.externalReferences!, '/studies'), name: s.name}));
      this.loadingStudyOptionsComplete = true;
    } catch (error) {
      // Display error that studies cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load studies');
    }
  }

  async getDatasetOptions() {
    // Fetch all datasets available for this experiment.
    try {
      const response: Result<Error, DatasetMetadata[]> = await ExperimentService.getDatasetMetadataByTrial(this.activeProgram!.id!, this.experiment!);
      if (response.isErr()) {
        throw response.value;
      }
      this.datasetOptions = response.value;

      this.setDefaultDatasetOption();

      this.loadingDatasetOptionsComplete = true;
    } catch (err) {
      // Display error that datasets cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load datasets');
      throw err;
    }
  }

  setDefaultDatasetOption() {
    // Set default selected dataset to property if provided, fall back to first in list of options.
    if (this.defaultDatasetId !== undefined) {
      this.fileOptions.datasetId = this.defaultDatasetId;
    } else if (this.datasetOptions.length > 0){
      this.fileOptions.datasetId = this.datasetOptions[0].id;
    }
  }

  downloadList(): boolean {
    // Validate selected options.
    if (this.validateOptions()) {
      // Open download URL in a new tab.
      if (this.activeProgram) {
        window.open(process.env.VUE_APP_BI_API_ROOT
            + '/v1/programs/'
            + this.activeProgram.id
            + '/experiments/'
            + this.trialId
            + '/export?fileExtension='
            + this.fileOptions.fileExtension
            + '&datasetId='
            + this.fileOptions.datasetId
            + (this.fileOptions.allEnvironments ? '' : ('&environments=' + this.fileOptions.environments))
            + '&includeTimestamps='
            + this.fileOptions.timestampsTrueFalseString(),
            '_blank');
      }
      return true;
    }
    return false;
  }

  resetExportOptions(){
    // Notify parent when deactivated to close modal
    this.$emit('deactivate');
    // Reset file export options.
    this.fileOptions = new ExperimentExportOptions();
    // Make sure default dataset option is selected.
    this.setDefaultDatasetOption();
    // Reset validation state.
    this.showEnvironmentsValidationError = false;
  }

  validateOptions(): boolean {
    // Either "All environments" or one or more specific environments must be selected.
    if (this.fileOptions.environments.length === 0 && !this.fileOptions.allEnvironments){
      this.$emit('show-error-notification', 'One or more environments must be selected.');
      this.showEnvironmentsValidationError = true;
      return false;
    }
    return true;
  }
}
</script>