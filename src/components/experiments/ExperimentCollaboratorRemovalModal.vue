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
    v-bind:confirmedAction="removeCollaborator"
    v-bind:active="active"
    modal-class="experiment-observation-remove-collaborator-button"
    v-on:deactivate="resetCollaborator"
  >
    <template #form>
      <p>Are you sure you want to revoke ${collaborator.name}'s access as an experimental collaborator?</p>
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
  trialId!: string;
  @Prop()
  experiment!: Trial;
  @Prop()
  modalTitle?: string;
  @Prop()
  collaborator!: Collaborator;

  private activeProgram?: Program;

  removeCollaborator(): boolean {
    if (this.activeProgram) {
      ExperimentService.removeCollaboratorFromExperiment(this.activeProgram.id, this.trialId, this.collaborator.id);
    }
    return true;
  }

  resetCollaborator(){
    this.$emit('deactivate');
  }
}
</script>