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
  <section id="experimentObservationsDownloadButton">
    <ExperimentObservationsExportModal
        v-bind:active.sync="modalActive"
        v-bind:title="modalTitle"
        v-bind:options="fileOptions"
        v-on:deactivate="modalActive = false"
        v-on:select-change="setFileExtension"
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
    <a href="#" v-on:click="activateExtensionSelect">
      <slot></slot>
    </a>
  </section>
</template>


<script lang="ts">
import {Component, Vue, Prop} from "vue-property-decorator";
import {validationMixin} from "vuelidate";
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import SelectModal from "@/components/modals/SelectModal.vue";
import {FileType} from "@/breeding-insight/model/FileType";
import BaseModal from "@/components/modals/BaseModal.vue";
import ExperimentObservationsExportModal from "@/components/modals/ExperimentObservationsExportModal.vue";
import {ExperimentObservationsDataset} from "@/breeding-insight/model/ExperimentObservationsDataset";

@Component({
  mixins: [validationMixin],
  components: {ExperimentObservationsExportModal, BaseModal, SelectModal },
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
  trailDbId!: string;
  @Prop()
  modalTitle?: string;

  // @Prop()
  // options:object[];  // Typed as string, but at runtime looks like: [{"name":".xls","id":"XLS"},{"name":".xlsx","id":"XLSX"},{"name":".csv","id":"CSV"}]
  //
  // private modalHeaderClass: string = "modal-header";
  private activeProgram?: Program;
  private modalActive: boolean = false;
  private fileExtension: string = "";
  private environments: string = "";
  private dataset: string = "";
  private includeTimestamps: boolean = false;
  private fileOptions = {fileExtensionOptions: Object.values(FileType), dataset: Object.values(ExperimentObservationsDataset), environments: "all", includeTimestamps: false};

  setFileExtension(value: string){
    this.fileExtension = value;
  }

  activateExtensionSelect(){
    this.modalActive = true;
  }

  downloadList() {
    this.modalActive = false;
    if (this.activeProgram) {
      window.open(process.env.VUE_APP_BI_API_ROOT + '/v1/programs/' + this.activeProgram.id + '/experiments/' + this.trailDbId + '/export?fileExtension=' + this.fileExtension + '&dataset' + this.dataset + '&environments=' + this.environments + '&includeTimestamps=' + this.includeTimestamps, '_blank');
    }
  }

  cancelDownload(){
    this.modalActive = false;
    this.fileExtension = "";
    this.dataset = "";
    this.environments = "";
    this.includeTimestamps = false;
  }
}
</script>