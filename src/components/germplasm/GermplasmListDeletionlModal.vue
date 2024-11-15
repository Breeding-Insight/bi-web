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
    v-bind:unique-id="listDbId"
    v-bind:modal-title="modalTitle"
    v-bind:confirmedAction="deleteList"
    v-bind:active="active"
    modal-class="experiment-observation-remove-collaborator-button"
    v-on:deactivate="cancelDelete"
  >
    <template #form>
      <p>Are you sure you want to delete the germplasm list? Note that deleting a germplasm list will not delete the associated germplasm records.</p>
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
import {Trial} from "@/breeding-insight/model/Trial";
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue";
import {ExperimentService} from "@/breeding-insight/service/ExperimentService";
import { Collaborator } from '@/breeding-insight/model/Collaborator';
import { ListService } from '@/breeding-insight/service/ListService';

@Component({
  mixins: [validationMixin],
  components: {ConfirmationModal, AlertTriangleIcon},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ExperimentCollaboratorRemovalModal extends Vue {

  @Prop()
  active!: boolean;
  @Prop()
  listDbId!: string;
  @Prop()
  modalTitle?: string;

  private activeProgram?: Program;

  async deleteList(): Promise<void> {
    if (this.activeProgram) {
      try {
        // Call the service method and await its completion
        await ListService.deleteList(this.activeProgram.id, this.listDbId)

        // If the above call doesn't throw an error, we assume it was successful
        // Emit the event after the promise is resolved
        this.$emit('list-deleted');

      } catch (error) {
        // Handle any errors that might occur during the async operation
        console.error('Error deleting the list:', error);
        // Optionally emit an error event or handle the error in some way
        this.$emit('show-error-notification', `Error while trying to delete the list`);
      }
    }
  }

  cancelDelete(){
    this.$emit('deactivate');
  }
}
</script>