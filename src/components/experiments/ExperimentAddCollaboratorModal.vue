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
  <AddCollaboratorModal
    v-bind:unique-id="trialId"
    v-bind:modal-title="modalTitle"
    v-bind:addCollaborator="addCollaborator"
    v-bind:active="active && loadingCollaboratorOptionsComplete"
    modal-class="experiment-observation-add-collaborator-button"
    v-on:deactivate="resetCollaboratorOptions"
    v-on:add-collaborator="$emit('add-collaborator')"
  >
    <template #form>
      <p>An experimental collaborator will be granted read, download, and BrAPI pull access to this experiment {{experiment.trialName}}. If the collaborator is not available from the dropdown menu, they will need to be added. <router-link v-bind:to="{name: 'program-users', params:{programId: activeProgram.id}}">Program Administration > Users</router-link></p>
      <div class="columns mb-4">
        <!-- Collaborator Select -->
        <div class="column control">
          <div class="field">
            <label
              class="label"
              v-bind:for="`collaborator-select-${trialId}`"
            ><span>Collaborator</span></label>
            <div class="control">
              <div class="select">
                <select
                  v-bind:id="`collaborator-select-${trialId}`"
                  v-model="collaboratorId"
                >
                  <option
                    v-for="option in collaboratorOptions"
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
      </div>
    </template>
    <slot />
  </AddCollaboratorModal>
</template>

<script lang="ts">
import {Component, Vue, Prop, Watch} from "vue-property-decorator";
import {validationMixin} from "vuelidate";
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import {AlertTriangleIcon} from 'vue-feather-icons';
import {Trial} from "@/breeding-insight/model/Trial";
import {Metadata} from "@/breeding-insight/model/BiResponse";
import {Result} from "@/breeding-insight/model/Result";
import {BrAPIUtils} from "@/breeding-insight/utils/BrAPIUtils";
import AddCollaboratorModal from "@/components/modals/AddCollaboratorModal.vue";
import {ExperimentService} from "@/breeding-insight/service/ExperimentService";
import { Collaborator } from '@/breeding-insight/model/Collaborator';

@Component({
  mixins: [validationMixin],
  components: {AddCollaboratorModal, AlertTriangleIcon},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ExperimentAddCollaboratorModal extends Vue {

  @Prop()
  active!: boolean;
  @Prop()
  trialId!: string;
  @Prop()
  experiment!: Trial;
  @Prop()
  modalTitle?: string;
  @Prop()
  collaborators: Collaborator[];

  private activeProgram?: Program;
  private collaboratorId?: string = '';
  private showValidationError: boolean = false;
  private collaboratorOptions: object[] = [];
  private loadingCollaboratorOptionsComplete: boolean = false;

  @Watch('experiment',{immediate: true})
  onExperimentChanged() {
    this.loadingCollaboratorOptionsComplete = false;
    this.getCollaboratorOptions();
  }

  @Watch('collaborators')
  onCollaboratorsChanged() {
    this.getCollaboratorOptions();
  }

  async getCollaboratorOptions() {
    try {
      const response: Result<Error, Collaborator[]> = await ExperimentService.getUnassignedCollaboratorsByExperiment(this.activeProgram!.id!, this.trialId);
      if(response.isErr()) {
        throw response.value;
      }
      let collaborators: Collaborator[] = response.value.data;
      this.collaboratorOptions = collaborators.map((c) => ({id: c.userId, name: c.name}));
      this.setDefaultCollaboratorOption();
      this.loadingCollaboratorOptionsComplete = true;
    } catch (error) {
      this.$emit('show-error-notification', 'Error while trying to load collaborators');
    }
  }

  setDefaultCollaboratorOption() {
    if (this.collaboratorOptions.length > 0) {
      this.collaboratorId = this.collaboratorOptions[0].id;
    }
  }

  async addCollaborator(): boolean {
    if (this.collaboratorId !== undefined) {
      if (this.activeProgram) {
        const response: Result<Error, Collaborator[]> = await ExperimentService.addCollaboratorToExperiment(this.activeProgram.id, this.trialId, this.collaboratorId);
      }
      return true;
    }
    this.$emit('show-error-notification', 'A collaborator must be selected.');
    this.showValidationError = true;
    return false;
  }

  resetCollaboratorOptions(){
    this.$emit('deactivate');
    this.setDefaultCollaboratorOption();
    this.showValidationError = false;
  }
}
</script>