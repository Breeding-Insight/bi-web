<!--
  - See the NOTICE file distributed with
  - this work for additional information regarding copyright ownership.
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
  <section id="adminProgramTableLabel">
    <WarningModal
      v-bind:active.sync="deactivateActive"
      v-bind:msg-title="deactivateWarningTitle"
      v-on:deactivate="deactivateActive = false"
    >
      <section>
        <p class="has-text-dark">
          Program-related data will not be affected by this change.
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button
            class="button is-danger"
            v-on:click="modalDeleteHandler()"
          >
            <strong>Yes, remove</strong>
          </button>
          <button
            class="button"
            v-on:click="deactivateActive = false"
          >
            Cancel
          </button>
        </div>
      </div>
    </WarningModal>

    <button
      v-show="!newProgramActive & programs.length > 0"
      class="button is-primary has-text-weight-bold is-pulled-right"
      v-on:click="newProgramActive = true"
    >
      <span class="icon is-small">
        <PlusCircleIcon
          size="1.5x"
          aria-hidden="true"
        />
      </span>
      <span>
        New Program
      </span>
    </button>

    <NewDataForm
      v-if="newProgramActive"
      v-bind:row-validations="programValidations"
      v-bind:new-record.sync="newProgram"
      v-on:submit="saveProgram"
      v-on:cancel="cancelNewProgram"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
      <template v-slot="validations">
        <div class="columns">
          <div class="column is-one-half">
            <BasicInputField
              v-model="newProgram.name"
              v-bind:validations="validations.name"
              v-bind:field-name="'Program Name'"
              v-bind:field-help="'Name of program. All Unicode special characters accepted.'"
            />
          </div>
          <div class="column is-one-half">
            <BasicSelectField
              v-model="newProgram.speciesId"
              v-bind:validations="validations.speciesId"
              v-bind:options="species"
              v-bind:field-name="'Species'"
            />
          </div>
        </div>
      </template>
    </NewDataForm>

    <BaseTable
      v-bind:headers="programTableHeaders"
      v-bind:records.sync="programs"
      v-bind:row-validations="programValidations"
      v-bind:editable="true"
      v-on:submit="updateProgram($event)"
      v-on:remove="displayWarning($event)"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
      <template v-slot:columns="data">
        <TableRowColumn name="name">
          <router-link
            v-bind:to="{name: 'program-home', params: {programId: data.id}}"
          >
            {{ data.name }}
          </router-link>
        </TableRowColumn>
        <TableRowColumn name="species">
          <template v-if="speciesMap.size > 0">
            {{ getSpeciesName(data.speciesId) }}
          </template>
        </TableRowColumn>
        <TableRowColumn name="numUsers">
          {{ data.numUsers }}
        </TableRowColumn>
      </template>
      <template v-slot:edit="{editData, validations}">
        <div class="columns">
          <div class="column is-one-half">
            <BasicInputField
              v-model="editData.name"
              v-bind:validations="validations.name"
              v-bind:field-name="'Program Name'"
              v-bind:field-help="'Name of program. All Unicode special characters accepted.'"
            />
          </div>
          <div class="column is-one-half">
            <BasicSelectField
              v-model="editData.speciesId"
              v-bind:validations="validations.speciesId"
              v-bind:options="species"
              v-bind:selected-id="editData.speciesId"
              v-bind:field-name="'Species'"
            />
          </div>
        </div>
      </template>
      <template v-slot:emptyMessage>
        <EmtpyTableMessage
          v-bind:button-view-toggle="!newProgramActive"
          v-bind:button-text="'New Program'"
          v-on:newClick="newProgramActive = true"
        >
          <p class="has-text-weight-bold">
            No programs are currently defined.
          </p>
          You can add, edit, and delete programs from this panel.
        </EmtpyTableMessage>
      </template>
    </BaseTable>
  </section>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {PlusCircleIcon} from 'vue-feather-icons'
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'

import WarningModal from '@/components/modals/WarningModal.vue'
import EditDataRowForm from '@/components/forms/EditDataRowForm.vue'
import {Program} from '@/breeding-insight/model/Program'
import {Species} from '@/breeding-insight/model/Species'
import BaseTable from "@/components/tables/BaseTable.vue";
import TableRowColumn from "@/components/tables/TableRowColumn.vue";
import BasicInputField from "@/components/forms/BasicInputField.vue";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";
import {ProgramService} from "@/breeding-insight/service/ProgramService";
import {SpeciesService} from "@/breeding-insight/service/SpeciesService";
import NewDataForm from "@/components/forms/NewDataForm.vue";
import EmtpyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
import {EventBus} from "@/util/event-bus";

@Component({
  mixins: [validationMixin],
  components: {
    EmtpyTableMessage,
    NewDataForm, EditDataRowForm, WarningModal, PlusCircleIcon,
    BaseTable, TableRowColumn, BasicInputField, BasicSelectField
  }
})
export default class AdminProgramsTable extends Vue {

  private programs: Array<Program> = [];
  programTableHeaders: string[] = ['Name', 'Species', '# Users'];

  private deactivateActive: boolean = false;
  private newProgramActive: boolean = false;
  private deactivateWarningTitle: string = "Remove program from system?";
  private newProgram = new Program();
  private species: Array<Species> = [];

  private speciesMap: Map<string, Species> = new Map();
  private deleteProgram: Program | undefined;

  private programName: string = "Program Name";

  programValidations = {
    name: {required},
    speciesId: {required}
  }

  mounted() {
    this.getPrograms();
    this.getSpecies();
  }

  getPrograms() {

    ProgramService.getAll().then((programs: Program[]) => {
      this.programs = programs;
    }).catch((error) => {
      // Display error that users cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load programs');
      throw error;
    });

  }

  getSpecies() {

    SpeciesService.getAll().then((species: Species[]) => {
      this.species = species;
      for (const individual of this.species){
        // reassign so vue picks up changes
        this.speciesMap = new Map(this.speciesMap.set(individual.id, individual));
      }
    }).catch((error) => {
      // Display error that users cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load species');
      throw error;
    });

  }

  updateProgram(updatedProgram: Program) {

    ProgramService.update(updatedProgram).then((program: Program) => {
      this.getPrograms();
      this.$emit('show-success-notification', 'Success! ' + updatedProgram.name + ' updated.');
    }).catch(() => {
      this.$emit('show-error-notification', 'Error updating program');
    }).finally(() => {
      this.emitProgramChange();
    });

  }

  saveProgram() {

    ProgramService.create(this.newProgram).then((program: Program) => {
      this.getPrograms();
      this.$emit('show-success-notification', 'Success! ' + this.newProgram.name + ' added.');
      this.newProgramActive = false;
      this.newProgram = new Program();
    }).catch(() => {
      this.$emit('show-error-notification', 'Error while creating program, ' + this.newProgram.name);
    }).finally(() => {
      this.emitProgramChange();
    });

  }

  cancelNewProgram() {
    this.newProgram = new Program();
    this.newProgramActive = false;
  }

  displayWarning(program: Program) {

    if (program){
      this.deleteProgram = program;
      this.deactivateWarningTitle = "Remove " + program.name + " from the system ?";
      this.deactivateActive = true;
    } else {
      Vue.$log.error('Could not find object to delete')
    }
  }

  modalDeleteHandler() {
    this.deactivateActive = false;

    if (this.deleteProgram){
      if (this.deleteProgram.id) {
        if (this.deleteProgram.name) {
          const deleteId: string = this.deleteProgram.id;
          const deleteName: string = this.deleteProgram.name;
          ProgramService.archive(deleteId).then(() => {
            this.getPrograms();
            this.$emit('show-success-notification', `${deleteName} archived in system`);
          }).catch(() => {
            this.$emit('show-error-notification', `Unable to archive program, ${deleteName}.`);
          }).finally(() => {
              this.emitProgramChange();
          });

          return;
        }
      }
    }

    this.$emit('show-error-notification', `Unable to archive program`);

  }

  getSpeciesName(id: string): string {
    return this.speciesMap.get(id)!.name;
  }

  emitProgramChange() {
    EventBus.bus.$emit(EventBus.programChange);
  }

}

</script>