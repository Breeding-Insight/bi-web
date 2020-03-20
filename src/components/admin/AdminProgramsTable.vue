<template>
  <section id="adminProgramTableLabel">
    <WarningModal
      v-bind:active="deactivateActive"
      v-bind:msg-title="deactivateWarningTitle"
      v-on:cancel="modalCancelHandler()" 
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
          <button v-on:click="modalCancelHandler()" class="button">Cancel</button>
        </div>
      </div>              
    </WarningModal>

    <NewDataRowForm
      v-if="newProgramActive"
      v-bind:row-validations="programValidations"
      v-bind:new-record.sync="newProgram"
      v-on:submit="saveProgram"
      v-on:cancel="cancelNewProgram"
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
        v-bind:records.sync="programs"
        v-bind:rowValidations="programValidations"
        v-bind:editable="true"
        v-on:submit="updateProgram($event)"
        v-on:remove="displayWarning($event)"
    >
      <template v-slot:columns="slotProps">
        <TableRowColumn name="name">{{slotProps.data.name}}</TableRowColumn>
        <TableRowColumn name="species">{{getSpeciesName(slotProps.data.speciesId)}}</TableRowColumn>
        <TableRowColumn name="numUsers">{{slotProps.data.numUsers}}</TableRowColumn>
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
import {PlusCircleIcon, CheckCircleIcon, XSquareIcon, ChevronRightIcon, ChevronDownIcon} from 'vue-feather-icons'
import {validationMixin} from 'vuelidate'
import {Validations} from 'vuelidate-property-decorators'
import {required, email} from 'vuelidate/lib/validators'

import WarningModal from '@/components/modals/WarningModal.vue'
import InputError from '@/components/forms/InputError.vue'
import InputField from '@/components/forms/InputField.vue'
import SelectField from '@/components/forms/SelectField.vue'
import NewDataRowForm from '@/components/forms/NewDataRowForm.vue'
import EditDataRowForm from '@/components/forms/EditDataRowForm.vue'
import {Program} from '@/model/Program'
import {TableRow} from '@/model/view_models/TableRow'
import {User} from '@/model/User'
import {Species} from '@/model/Species'
import BaseTable from "@/components/tables/BaseTable.vue";
import TableRowColumn from "@/components/tables/TableRowColumn.vue";
import BasicInputField from "@/components/forms/BasicInputField.vue";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";

@Component({
  mixins: [validationMixin],
  components: {
    NewDataRowForm, EditDataRowForm,
    InputError, InputField, SelectField,
    WarningModal,
    PlusCircleIcon, CheckCircleIcon, XSquareIcon, ChevronRightIcon, ChevronDownIcon,
    BaseTable, TableRowColumn, BasicInputField, BasicSelectField
  }
})
export default class AdminProgramsTable extends Vue {

  private programs: Array<Program> = [];

  private deactivateActive: boolean = false;
  private newProgramActive: boolean = false;
  private deactivateWarningTitle: string = "Remove program from system?";
  private newProgram: Program = new Program();
  private species: Array<Species> = [];

  private speciesMap: Map<string, Species> = new Map();

  private deleteIndex: number = -1;

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
    // TODO: api call
    // stubbed for now
    this.programs.push(new Program('1', 'Lance Grape Program', '1', '5', '1'));
    this.programs.push(new Program('2', 'Phil Sweet Potato Program', '2', '2', '2'));
    this.programs.push(new Program('3', 'Some Other Program', '3', '10', '3'));
  }

  getSpecies() {
    // TODO: api call to get data
    this.speciesMap.set('1', new Species('1', 'Grape'));
    this.speciesMap.set('2', new Species('2', 'Sweet Potato'));
    this.speciesMap.set('3', new Species('3', 'Blueberry'));
    this.species = Array.from(this.speciesMap.values());
  }

  updateProgram(updatedProgram: Program) {
    // TODO: api call

    //temporary until api call
    const progIndex = this.programs.findIndex(program => program.id === updatedProgram.id);
    Vue.set(this.programs, progIndex, updatedProgram);

    this.$emit('show-success-notification', 'Success! ' + updatedProgram.name + ' updated.');
  }

  saveProgram() {

    // TODO: api call

    if (this.newProgram.name != undefined && this.newProgram.speciesId != undefined) {
      const newProgram: Program = new Program(this.uuidv4(), this.newProgram.name, this.newProgram.speciesId, '1');
      this.programs.push(newProgram);

      this.$emit('show-success-notification', 'Success! ' + this.newProgram.name + ' added.');
      this.newProgramActive = false;
    }

    // Check all of our fields to see if they were required
    this.newProgram = new Program();

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

  displayWarning(rowIndex: number) {
    const program: Program = this.programs[rowIndex];
    this.deleteIndex = rowIndex;
    this.deactivateWarningTitle = "Remove " + program.name + " from the system ?";
    this.deactivateActive = true;
  }

  modalDeleteHandler() {
    this.deactivateActive = false;

    // TODO: api call
    this.programs.splice(this.deleteIndex, 1);
  }

  modalCancelHandler() {
    this.deactivateActive = false;
  }

  getSpeciesName(id: string): string {
    return this.speciesMap.get(id)!.name;
  }

}

</script>