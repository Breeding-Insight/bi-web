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
  <div id="shared-ontology-configuration">
    <section id="shared-ontology-section">
      <h2 class="title is-5">Shared Ontology</h2>

      <!-- Loading wheel container -->
      <template v-if="sharedProgramLoading">
        <div class="loading-indicator table-min-height"/>
      </template>
      <!-- Loading finished -->
      <template v-else>
        <!-- Subscribed to another ontology, cannot share -->
        <template v-if="isSubscribed()">
          Ontology sharing is disabled due to this program being subscribed to the ontology of program {{subscribedOntology.programName}}.
        </template>
        <!-- Can share ontology -->
        <template v-else>
          <!-- Display shared -->
          <template v-if="sharedPrograms.length > 0">
            <!-- If there are programs -->
            <p>Currently shared with:</p>
            <ul>
              <template v-for="sharedProgram of sharedPrograms">
                <li v-bind:key="sharedProgram.programId">{{sharedProgram.programName}} {{sharedProgram.accepted ? '(Accepted)' : '(Not Accepted)'}}</li>
              </template>
            </ul>
          </template>
          <template v-else>
            <!-- If no shares -->
            <p>
              {{ activeProgram.name }} is not currently sharing their ontology with other programs. Click "Share Ontology"
              to choose programs to share with.
            </p>
          </template>

          <button
              id="showShareModalBtn"
              class="button is-primary"
              v-on:click="shareShowModalEvent()"
          >
            Share Ontology
          </button>

          <!-- Share modal -->
          <GenericModal
              v-bind:active.sync="showShareModal"
              v-bind:msg-title="'Manage Shared Ontology'"
              v-on:deactivate="showShareModal = false"
          >
            <section>
              <p class="has-text-dark" :class="this.$modalTextClass">
                You may share your program's ontology with any program that has the same species.
                You may revoke access to a shared ontology as long as the program the ontology is shared
                with has not collected any observations on the traits within the shared ontology.
              </p>

              <!-- Available shared programs -->
              <div
                  v-if="editableMatchedPrograms.length > 0"
                  class="mb-6"
              >
                <h5 class="is-underlined title is-6">
                  Select/Unselect Programs to Share Ontology
                </h5>
                <template v-for="matchedProgram of editableMatchedPrograms">
                  <div v-bind:key="matchedProgram.programId">
                    <label
                        class="checkbox"
                        v-bind:for="'sharedProgram' + matchedProgram.programId"
                        v-bind:disabled="!isEditable(matchedPrograms[matchedProgram.programId])"
                    >
                      <input
                          type="checkbox"
                          v-bind:id="'sharedProgram' + matchedProgram.programId"
                          v-bind:disabled="!isEditable(matchedPrograms[matchedProgram.programId])"
                          v-bind:checked="matchedProgram.shared"
                          v-on:input="matchedProgram.shared = !matchedProgram.shared"
                      >
                      {{matchedProgram.programName}}
                    </label>
                  </div>
                </template>
              </div>
              <!-- No matching programs -->
              <template v-else-if="editableMatchedPrograms.length == 0 && !sharedProgramLoading">
                No programs are available to share your ontology with.
              </template>

            </section>

            <div class="columns">
              <div class="column is-whole has-text-centered buttons">
                <button
                    class="button"
                    v-on:click="showShareModal = false"
                    id="cancelSharedOntology"
                    v-bind:disabled="shareProgramProcessing"
                >
                  Cancel
                </button>
                <button
                    class="button is-danger"
                    v-bind:class="{'is-loading': shareProgramProcessing}"
                    v-on:click="processSelections()"
                    id="confirmSharedOntology"
                    v-bind:disabled="shareProgramProcessing"
                >
                  <strong>Save</strong>
                </button>
              </div>
            </div>
          </GenericModal>
        </template>
      </template>
    </section>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import {SharedOntology} from "@/breeding-insight/model/SharedOntology";
import {SharedOntologyService} from "@/breeding-insight/service/SharedOntologyService";
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import {SharedOntologyRequest} from "@/breeding-insight/model/SharedOntologyRequest";
import GenericModal from "@/components/modals/GenericModal.vue";
import {SubscribedOntology} from "@/breeding-insight/model/SubscribedOntology";

@Component({
  components: {
    GenericModal
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class SharedOntologyConfiguration extends ProgramsBase {

  @Prop()
  private subscriptionChange?: number;

  private activeProgram?: Program;

  private sharedProgramLoading: boolean = false;
  private shareProgramProcessing: boolean = false;
  private showShareModal: boolean = false;

  private matchedPrograms: {[key: string]: SharedOntology} = {};
  private sharedPrograms: SharedOntology[] = [];
  private editableMatchedPrograms: SharedOntology[] = [];
  private subscribedOntology?: SubscribedOntology;

  mounted() {
    // Get shared ontologies
    this.getSharedOntologyData();
  }

  @Watch('subscriptionChange', {immediate: false})
  async refreshOntology() {
    await this.getSharedOntologyData();
  }

  // Pull shared ontologies and subscribed ontologies
  async getSharedOntologyData() {
    try {
      this.sharedProgramLoading = true;

      await Promise.all([this.getSharedPrograms(), this.getSubscribedOntology()]);
    } catch (e) {
      // Check error statuses, show errors
      this.$emit('show-error-notification', e);
    } finally {
      // Loading wheel hide
      this.sharedProgramLoading = false;
    }
  }

  // Get shared ontologies
  async getSharedPrograms() {
      const [data, metadata] = await SharedOntologyService.get(this.activeProgram!.id!);
      data.forEach((datum: SharedOntology) => this.matchedPrograms[datum.programId] = datum);
      // Filter for shared programs
      this.sharedPrograms = Object.values(this.matchedPrograms).filter(matchedProgram => matchedProgram.shared);
  }

  async getSubscribedOntology() {
      const [data, metadata] = await SharedOntologyService.getSubscriptionOptions(this.activeProgram!.id!);
      // Check if we are subscribed to one of the programs
      this.subscribedOntology = undefined;
      data.forEach((datum: SubscribedOntology) => {
        if (datum.subscribed) {
          this.subscribedOntology = datum;
        }
      });
  }

  shareShowModalEvent() {
    this.editableMatchedPrograms = Object.values(this.matchedPrograms).map(matchedProgram => new SharedOntology(matchedProgram));
    this.showShareModal = true;
  }

  isEditable(program: SharedOntology) {
    return !program.shared || program.editable;
  }

  async processSelections() {

    // Process the selections
    const programIdsToRevoke: string[] = [];
    const newSharePrograms: SharedOntologyRequest[] = [];
    for (const program of this.editableMatchedPrograms) {
      const originalProgram: SharedOntology = this.matchedPrograms[program.programId];

      if (program.shared === originalProgram.shared) {
        // If no change skip
        continue;
      } else if (originalProgram.shared && !program.shared) {
        // If program used to be shared and is no longer, add to revoke list
        programIdsToRevoke.push(program.programId);
      } else if (!originalProgram.shared && program.shared) {
        // If program was not shared, and it now shared, add to share list
        newSharePrograms.push(
            new SharedOntologyRequest({programName: program.programName, programId: program.programId}));
      }
    }

    // Show progress wheel on save button
    if (programIdsToRevoke.length > 0 || newSharePrograms.length > 0) {
      this.shareProgramProcessing = true;
    }


    // Revoke ontologies
    if (programIdsToRevoke.length > 0) {
      try {
        await SharedOntologyService.revokeAll(this.activeProgram!.id!, programIdsToRevoke);
      } catch (e) {
        this.$emit('show-error-notification', e);
        this.shareProgramProcessing = false;
        return;
      }
    }

    // Shared ontologies
    if (newSharePrograms.length > 0) {
      try {
        await SharedOntologyService.share(this.activeProgram!.id!, newSharePrograms);
      } catch (e) {
        this.$emit('show-error-notification', e);
        this.shareProgramProcessing = false;
        return;
      }
    }

    // Show progress wheel on save button
    this.shareProgramProcessing = false;
    this.showShareModal = false;
    if (programIdsToRevoke.length > 0 || newSharePrograms.length > 0) {
      this.$emit('share-change');
      this.$emit('show-success-notification', 'Changes to shared ontology successfully saved');
    }

    this.getSharedOntologyData();
  }

  isSubscribed() {
    return this.subscribedOntology;
  }
}
</script>