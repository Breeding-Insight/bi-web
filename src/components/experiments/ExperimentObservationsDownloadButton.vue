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
  <DownloadButton
    v-bind:unique-id="trialDbId"
    v-bind:modal-title="modalTitle"
    v-bind:download="downloadList"
    v-bind:anchor-class="anchorClass"
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
              v-bind:for="`dataset-select-${trialDbId}`"
            ><span>Dataset</span></label>
            <div class="control">
              <div class="select">
                <select
                  v-bind:id="`dataset-select-${trialDbId}`"
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
                v-bind:id="`timestamps-switch-${trialDbId}`"
                v-model="fileOptions.includeTimestamps"
                type="checkbox"
                true-value="Yes"
                false-value="No"
                name="timestamps-switch"
                class="switch is-info is-rounded"
              >
              <label
                v-bind:id="`timestamps-label-${trialDbId}`"
                v-bind:for="`timestamps-switch-${trialDbId}`"
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
  </DownloadButton>
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
import {AlertTriangleIcon} from 'vue-feather-icons';
import DownloadButton from "@/components/DownloadButton.vue";

@Component({
  mixins: [validationMixin],
  components: {DownloadButton, AlertTriangleIcon},
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
  @Prop()
  anchorClass?: string;

  private activeProgram?: Program;
  private fileOptions: ExperimentExportOptions = new ExperimentExportOptions();
  private showEnvironmentsValidationError: boolean = false;
  private fileExtensionOptions: object[] = Object.values(FileTypeOption);
  private datasetOptions: object[] = Object.values(ExperimentDatasetOption);
  private environmentOptions: object[] = Object.values(EnvironmentOption);

  downloadList(): boolean {
    // Validate selected options.
    if (this.validateOptions()) {
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
      return true;
    }
    return false;
  }

  resetExportOptions(){
    // Reset file export options.
    this.fileOptions = new ExperimentExportOptions();
    // Reset validation state.
    this.showEnvironmentsValidationError = false;
  }

  validateOptions(): boolean {
    if (this.fileOptions.environments.length === 0){
      this.$emit('show-error-notification', 'One or more environments must be selected.');
      this.showEnvironmentsValidationError = true;
      return false;
    }
    return true;
  }
}
</script>