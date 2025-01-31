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
      v-bind:unique-id="submissionId"
      v-bind:modal-title="modalTitle"
      v-bind:confirmedAction="deleteSampleSubmission"
      v-bind:active="active"
      modal-class="germplasm-list-deletion-button"
      v-on:deactivate="cancelDelete"
  >
    <template #form>
      <p>Are you sure you want to delete the sample submission?</p>
    </template>
    <slot />
  </ConfirmationModal>
</template>

<script lang="ts">
import {Component, Vue, Prop} from "vue-property-decorator";
import {validationMixin} from "vuelidate";
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import {AlertTriangleIcon} from 'vue-feather-icons';
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue";
import {SampleSubmissionService} from "@/breeding-insight/service/SampleSubmissionService";

@Component({
  mixins: [validationMixin],
  components: {ConfirmationModal, AlertTriangleIcon},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class SampleSubmissionDeleteModal extends Vue {

  @Prop()
  active!: boolean;
  @Prop()
  submissionId!: string;
  @Prop()
  modalTitle?: string;

  private activeProgram?: Program;

  async deleteSampleSubmission(): Promise<void> {
    if (this.activeProgram) {
      try {
        await SampleSubmissionService.deleteSubmission(this.activeProgram.id, this.submissionId);
        this.$emit('submission-deleted');

      } catch (error) {
        this.$emit('show-error-notification', `Error while trying to delete the sample submission`);
      }
    }
  }

  cancelDelete(){
    this.$emit('deactivate');
  }
}
</script>