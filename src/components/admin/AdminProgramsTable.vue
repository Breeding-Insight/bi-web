<template>
  <section id="adminProgramTableLabel">
    <WarningModal
      v-bind:active="deactivateActive"
      v-bind:msg-title="deactivateWarningTitle"
      v-on:cancel="deactivateActive = !deactivateActive"
    >
      <section>
        <p class="has-text-dark">
          Program-related data will not be affected by this change.
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button v-on:click="modalDeleteHandler()" 
          class="button is-danger"><strong>Yes, remove</strong>
          </button>
          <button v-on:click="deactivateActive = !deactivateActive" class="button">Cancel</button>
        </div>
      </div>              
    </WarningModal>

    <NewDataRowForm
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
                v-bind:field-error="validations.name.$error"
                v-bind:field-name="'Program Name'"
                v-bind:field-help="'Name of program. All Unicode special characters accepted.'"
            />
          </div>
          <div class="column is-one-half">
            <BasicSelectField
                v-model="newProgram.speciesId"
                v-bind:field-error="validations.speciesId.$error"
                v-bind:options="species"
                v-bind:field-name="'Species'"
            />
          </div>
        </div>
      </template>
    </NewDataRowForm>

    <button class="button is-primary has-text-weight-bold is-pulled-right" v-on:click="newProgramActive = true" v-if="!newProgramActive">
      <span class="icon is-small">
        <PlusCircleIcon size="1.5x" aria-hidden="true"></PlusCircleIcon>
      </span>
      <span>
        New Program
      </span>
    </button>

    <BaseTable
        v-bind:headers="programTableHeaders"
        v-bind:records.sync="programs"
        v-bind:new-record.sync="currentNewProgram"
        v-bind:rowValidations="programValidations"
        v-bind:editable="true"
        v-on:submit="updateProgram($event)"
        v-on:remove="displayWarning($event)"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
      <template v-slot:columns="data">
        <TableRowColumn name="name">{{data.name}}</TableRowColumn>
        <TableRowColumn name="species">{{getSpeciesName(data.speciesId)}}</TableRowColumn>
        <TableRowColumn name="numUsers">{{data.numUsers}}</TableRowColumn>
      </template>
      <template v-slot:edit="{editData, validation}">
        <div class="columns">
          <div class="column is-one-half">
            <BasicInputField
                v-model="editData.name"
                v-bind:field-error="validation.editData.name.$error"
                v-bind:field-name="'Program Name'"
                v-bind:field-help="'Name of program. All Unicode special characters accepted.'"
            />
          </div>
          <div class="column is-one-half">
            <BasicSelectField
                v-model="editData.speciesId"
                v-bind:field-error="validation.editData.speciesId.$error"
                v-bind:options="species"
                v-bind:selectedId="editData.speciesId"
                v-bind:field-name="'Species'"
            />
          </div>
        </div>
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
import NewDataRowForm from '@/components/forms/NewDataRowForm.vue'
import EditDataRowForm from '@/components/forms/EditDataRowForm.vue'
import {Program} from '@/model/Program'
import {Species} from '@/model/Species'
import BaseTable from "@/components/tables/BaseTable.vue";
import TableRowColumn from "@/components/tables/TableRowColumn.vue";
import BasicInputField from "@/components/forms/BasicInputField.vue";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";
import {ProgramService} from "@/model/service/ProgramService";
import {SpeciesService} from "@/model/service/SpeciesService";

@Component({
  mixins: [validationMixin],
  components: {
    NewDataRowForm, EditDataRowForm, WarningModal, PlusCircleIcon,
    BaseTable, TableRowColumn, BasicInputField, BasicSelectField
  }
})
export default class AdminProgramsTable extends Vue {

  private programs: Array<Program> = [];
  programTableHeaders: string[] = ['Name', 'Species', '# Users'];

  private deactivateActive: boolean = false;
  private newProgramActive: boolean = false;
  private deactivateWarningTitle: string = "Remove program from system?";
  private newProgram: Program = new Program();
  private currentNewProgram: Program | undefined;
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

    ProgramService.getAll().then((programs) => {
      this.programs.splice(0, this.programs.length, ...programs);
    }).catch(() => {
      this.$emit('show-error-notification', 'Unable to load programs from server');
    });

  }

  getSpecies() {

    SpeciesService.getAll().then((species) => {
      this.species.splice(0, this.species.length, ...species);
      for (const individual of this.species){
        this.speciesMap.set(individual.id, individual);
      }
    }).catch(() => {
      this.$emit('show-error-notification', 'Unable to load programs from server');
    })

  }

  updateProgram(updatedProgram: Program) {

    ProgramService.update(updatedProgram).then(() => {
      this.getPrograms();
      this.$emit('show-success-notification', 'Success! ' + updatedProgram.name + ' updated.');
    }).catch(() => {
      this.$emit('show-error-notification', 'Error updating program');
    });

  }

  saveProgram() {

    if (this.newProgram.name != undefined && this.newProgram.speciesId != undefined) {
      const newProgram: Program = new Program(this.uuidv4(), this.newProgram.name, this.newProgram.speciesId, '1');

      ProgramService.create(newProgram).then(() => {
        this.getPrograms();
        this.currentNewProgram = newProgram;
        this.$emit('show-success-notification', 'Success! ' + this.newProgram.name + ' added.');
        this.newProgramActive = false;
        this.newProgram = new Program();
      }).catch(() => {
        this.$emit('show-error-notification', 'Error while creating program, ' + this.newProgram.name);
      })
    } else {
      this.$emit('show-error-notification', 'Error while creating program, ' + this.newProgram.name);
    }

  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  cancelNewProgram() {
    this.newProgram = new Program();
    this.newProgramActive = false;
  }

  displayWarning(programId: string) {

    const deleteProgram: Program | undefined = this.programs.find(program => program.id === programId);

    if (deleteProgram){
      this.deleteProgram = deleteProgram;
      this.deactivateWarningTitle = "Remove " + deleteProgram.name + " from the system ?";
      this.deactivateActive = true;
    } else {
      this.$log.error('Could not find object to delete')
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
          })
          return;
        }
      }
    }

    this.$emit('show-error-notification', `Unable to archive program`);

  }

  getSpeciesName(id: string): string {
    return this.speciesMap.get(id)!.name;
  }

}

</script>