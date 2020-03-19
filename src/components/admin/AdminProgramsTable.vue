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
      @submit="saveProgram"
      @cancel="cancelNewProgram"
    >
      <div class="columns">
        <div class="column is-one-third">
          <InputField
            v-model="newProgram.name"
            :field-error.sync="$v.newProgram.name.$error"
            :field-type="'text'"
            :placeholder="'Program Name'"
          >
            <template v-slot:label>Program Name</template>
            <template v-slot:errors>
              <InputError>Name is required</InputError>
            </template>
            <template v-slot:help>
              Name of program. All Unicode special characters accepted.
            </template>
          </InputField>
        </div>
        <div class="column is-one-third">
          <SelectField
            v-model="newProgram.speciesId"
            :field-error.sync="$v.newProgram.speciesId.$error"
            :options="species"
            :placeholder="'Select a species'"
          >
            <template v-slot:label>Species</template>
            <template v-slot:errors>
              <InputError>Species is required</InputError>
            </template>
            <template v-slot:help>
              Name of species.
            </template>
          </SelectField>
        </div>
        <div class="column is-one-third">
          <SelectField
            v-model="newProgram.managerId"
            :field-error.sync="$v.newProgram.managerId.$error"
            :options="managers"
            :placeholder="'Select a Program Manager'"
          >
            <template v-slot:label>Program Manager</template>
            <template v-slot:errors>
              <InputError>Program manager is required</InputError>
            </template>
            <template v-slot:help>
              Name of program manager.
            </template>
          </SelectField>
        </div>
      </div>
    </NewDataRowForm>
    <table role="grid" aria-labelledby="adminProgramTableLabel" class="table is-striped is-narrow is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>
            Name
          </th>
          <th>
            Species</th>
          <th>
            # Users
          </th>
          <th>
            <button class="button is-primary has-text-weight-bold is-pulled-right" v-on:click="createProgram()" v-if="!newProgramActive">
              <span class="icon is-small">
                <PlusCircleIcon size="1.5x" aria-hidden="true"></PlusCircleIcon>
              </span>
              <span>
                New Program
              </span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(program, index) in programs">
          <tr v-bind:key="program.data.id" 
              v-bind:class="{'is-new': (program.new == true)}" 
          >
            <!-- always display table row data -->
            <td>{{ program.data.name }}</td>
            <td>{{ getSpeciesName(program.data.speciesId) }}</td>
            <td>{{ program.data.numUsers }}</td>
            <td class="has-text-right">
              <a  v-on:click="program.toggleEdit()">Edit</a>
              <template v-if="program.edit">
                <span class="icon is-small margin-right-2 has-vertical-align-middle">
                  <ChevronDownIcon size="1x" aria-hidden="true"></ChevronDownIcon>
                </span>
              </template>
              <template v-else>
                <span class="icon is-small margin-right-2 has-vertical-align-middle">
                  <ChevronRightIcon size="1x" aria-hidden="true"></ChevronRightIcon>
                </span>
              </template>
              <a class="" v-on:click="displayWarning(index)">Deactivate</a>
            </td>
          </tr>
          <tr v-bind:key="'edit'+program.editData.id" v-if="program.edit"
              v-bind:class="{'is-selected': (program.edit == true)}" 
          >
            <td colspan="4">
              <EditDataRowForm
                @submit="updateProgram(index)"
                @cancel="cancelEdit(program, index)"
              >
                <div class="columns">
                  <div class="column is-one-third">
                    <InputField
                      v-model="program.editData.name"
                      :field-error.sync="$v.programs.$each[index].editData.name.$error"
                      :field-type="'text'"
                      :placeholder="'Program Name'"
                    >
                      <template v-slot:label>Program Name</template>
                      <template v-slot:errors>
                        <InputError>Name is required</InputError>
                      </template>
                      <template v-slot:help>
                        Name of program. All Unicode special characters accepted.
                      </template>
                    </InputField>
                  </div>
                  <div class="column is-one-third">
                    <SelectField
                      v-model="program.editData.speciesId"
                      :field-error.sync="$v.programs.$each[index].editData.speciesId.$error"
                      :options="species"
                      :placeholder="'Select a species'"
                      :selectedId="program.editData.speciesId"
                    >
                      <template v-slot:label>Species</template>
                      <template v-slot:errors>
                        <InputError>Species is required</InputError>
                      </template>
                      <template v-slot:help>
                        Name of species.
                      </template>
                    </SelectField>
                  </div>
                  <div class="column is-one-third">
                    <SelectField
                      v-model="program.editData.managerId"
                      :field-error.sync="$v.programs.$each[index].editData.managerId.$error"
                      :options="managers"
                      :placeholder="'Select a Program Manager'"
                      :selectedId="program.editData.managerId"
                    >
                      <template v-slot:label>Program Manager</template>
                      <template v-slot:errors>
                        <InputError>Program manager is required</InputError>
                      </template>
                      <template v-slot:help>
                        Name of program manager.
                      </template>
                    </SelectField>
                  </div>
                </div>
              </EditDataRowForm>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
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

@Component({
  mixins: [validationMixin],
  components: { NewDataRowForm, EditDataRowForm,
                InputError, InputField, SelectField,
                WarningModal, 
                PlusCircleIcon, CheckCircleIcon, XSquareIcon, ChevronRightIcon, ChevronDownIcon
              }
})
export default class AdminProgramsTable extends Vue {

  private programs: Array<TableRow<Program>> = [];

  private deactivateActive: boolean = false;
  private newProgramActive: boolean = false;
  private deactivateWarningTitle: string = "Remove program from system?";
  private newProgram: Program = new Program();
  private managers: Array<User> = [];
  private species: Array<Species> = [];

  private speciesMap: Map<string, Species> = new Map();
  private programUsersMap: Map<string, User> = new Map();

  private deleteIndex: number = -1;
  private currentNewRow: TableRow<Program> | null = null;

  private programName: string = "Program Name";

  @Validations()
  validations = {
    newProgram : {
      name: {required},
      speciesId: {required},
      managerId: {required}
    },
    programs : {
      $each: {
        editData: {
          name: {required},
          speciesId: {required},
          managerId: {required}
        }
      }
    }
  }

  mounted() {
    this.getPrograms();
    this.getSpecies();
    this.getProgramUsers();
  }

   getPrograms() {
    // TODO: api call
    // stubbed for now
    this.programs.push(new TableRow(true, new Program('1', 'Lance Grape Program', '1', '5', '1')));
    this.programs.push(new TableRow(true, new Program('2', 'Phil Sweet Potato Program', '2', '2', '2')));
    this.programs.push(new TableRow(true, new Program('3', 'Some Other Program', '3', '10', '3')));
  }

  getSpecies() {
    // TODO: api call to get data
    this.speciesMap.set('1', new Species('1', 'Grape'));
    this.speciesMap.set('2', new Species('2', 'Sweet Potato'));
    this.speciesMap.set('3', new Species('3', 'Blueberry'));
    this.species = Array.from(this.speciesMap.values());
  }

  getProgramUsers() {
    // TODO: api call to get data
    this.programUsersMap.set('1', new User('1', 'Bob Smith'));
    this.programUsersMap.set('2', new User('2', 'John Anderson'));
    this.programUsersMap.set('3', new User('3', 'Matt Thompson'));
    this.managers = Array.from(this.programUsersMap.values());
  }

  createProgram() {
    this.newProgramActive = true;
  }

  updateProgram(rowIndex: number) {
    // TODO: api call

    this.$v.programs.$each[rowIndex].editData.$touch();
    if (this.$v.programs.$each[rowIndex].editData.$anyError){
      this.$emit('show-error-notification', 'Fix Invalid Fields');
      return;
    }
    else {
      // Check all of our fields to see if they were required
      // this.newProgram = new Program();
      this.$v.programs.$each[rowIndex].editData.$reset();

      const editRow: TableRow<Program> = this.programs[rowIndex];
      editRow.confirmChanges();
      editRow.toggleEdit();

      console.log(editRow.data.speciesId);

      this.clearNewRow();
      this.$emit('show-success-notification', 'Success! ' + editRow.data.name + ' updated.');
    }
  }

  saveProgram() {
    this.$v.newProgram.$touch();
    if (this.$v.newProgram.$anyError){
      this.$emit('show-error-notification', 'Fix Invalid Fields');
      return;
    }
    else {
      // TODO: api call
      // some index management here for now just to allow the stub to work
      let id: Number = Number(1);

      if (this.programs.length > 0) {
        const editRow: TableRow<Program> = this.programs[this.programs.length-1];
        const user: Program = editRow.editData;
        id = Number(user.id)+1;
      }

      if (this.newProgram.name != undefined && this.newProgram.speciesId != undefined && this.newProgram.managerId != undefined) {
        const newProgram: Program = new Program(id.toString(), this.newProgram.name, this.newProgram.speciesId, '1', this.newProgram.managerId);
        const newRow: TableRow<Program> = new TableRow(true, newProgram);
        newRow.toggleNew();
        this.programs.push(newRow);

        this.clearNewRow();
        this.currentNewRow = newRow;

        this.$emit('show-success-notification', 'Success! ' + this.newProgram.name + ' added.');
        this.newProgramActive = false;
      }

      // Check all of our fields to see if they were required
      this.newProgram = new Program();
      this.$v.newProgram.$reset();

    }
  }

  cancelNewProgram() {
    this.newProgram = new Program();
    this.$v.newProgram.$reset();
    this.newProgramActive = false;
  }

  displayWarning(rowIndex: number) {
    const editRow: TableRow<Program> = this.programs[rowIndex];
    const program: Program = editRow.editData;
    this.deleteIndex = rowIndex;
    this.deactivateWarningTitle = "Remove " + program.name + " from the system ?";
    this.deactivateActive = true;
  }

  modalDeleteHandler() {
    this.deactivateActive = false;

    // TODO: api call
    this.clearNewRow();
    this.programs.splice(this.deleteIndex, 1);
  }

  modalCancelHandler() {
    this.deactivateActive = false;
  }

  clearNewRow() {
    if (this.currentNewRow != null) {
      this.currentNewRow.toggleNew();
      this.currentNewRow = null;
    }
  }

  cancelEdit(program: TableRow<Program>, rowIndex: number) {
    program.toggleEdit();
    program.revertChanges();
    // clear form
    this.$v.programs.$each[rowIndex].editData.$reset();
  }


  getSpeciesName(id: string): string {
    return this.speciesMap.get(id)!.name;
  }

}

</script>