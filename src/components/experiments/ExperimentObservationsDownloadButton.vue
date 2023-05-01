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
    <ExperimentObservationsExportModal
      v-bind:active.sync="modalActive"
      v-bind:title="modalTitle"
      v-bind:export-options="fileOptions"
      v-on:deactivate="cancelDownload"
    >
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
    </ExperimentObservationsExportModal>
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
import ExperimentObservationsExportModal from "@/components/modals/ExperimentObservationsExportModal.vue";
import {ExperimentExportOptions} from "@/breeding-insight/model/ExperimentExportOptions";

@Component({
  mixins: [validationMixin],
  components: {ExperimentObservationsExportModal},
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