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
  <ConfirmationModal
    v-bind:unique-id="trialId"
    v-bind:modal-title="modalTitle"
    v-bind:confirmedAction ="deleteAction"
    v-bind:active="active"
    modal-class="experiment-observations-download-button"
    v-on:deactivate="resetExportOptions"
  >
    <template #form>
      <p>{{obsCount}} observations will be deleted. All records will be lost. Are you sure you want to delete the experimental data?</p>
    </template>
  </ConfirmationModal>
</template>


<script lang="ts">
import {Component, Vue, Prop, Watch} from "vue-property-decorator";
import {validationMixin} from "vuelidate";
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import {ExperimentExportOptions} from "@/breeding-insight/model/ExperimentExportOptions";
import {AlertTriangleIcon} from 'vue-feather-icons';
import {Trial} from "@/breeding-insight/model/Trial";
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue";
import {ExperimentService} from "@/breeding-insight/service/ExperimentService";

@Component({
  mixins: [validationMixin],
  components: {ConfirmationModal, AlertTriangleIcon},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ExperimentDeleteModal extends Vue {

  @Prop()
  active!: boolean;
  @Prop()
  trialId!: string;
  @Prop()
  obsCount!: number;
  @Prop()
  experiment!: Trial;
  @Prop()
  modalTitle?: string;


  private activeProgram?: Program;
  private fileOptions: ExperimentExportOptions = new ExperimentExportOptions();

  async deleteAction(): Promise<void> {
    if (this.activeProgram) {
      try {
        let hasObsUnits: boolean = this.obsCount > 0;
        // Call the service method and await its completion
        await ExperimentService.deleteExperiment(
            this.activeProgram.id,
            this.trialId,
            hasObsUnits,
        );
        // now switch screen to the list of remaining experiments
        this.$router.push({
          name: 'experiments-observations',
          params: {
            programId: this.activeProgram!.id!
          },
        });


      } catch (error) {
        // Handle any errors that might occur during the async operation
        console.error('Error while trying to delete experiment:', error);
        // Optionally emit an error event or handle the error in some way
        this.$emit('show-error-notification', `Error while trying to delete experiment`);
      }
    }
  }

  resetExportOptions(){
    // Notify parent when deactivated to close modal
    this.$emit('deactivate');
  }
}
</script>
