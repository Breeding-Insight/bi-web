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
          <div class="field">
            <label class="label">Species</label>
            <div class="control is-expanded">
              <div class="select is-fullwidth">
                <select v-model="newProgram.species">
                  <option disabled value="">Select a species</option>
                  <option
                      v-for="s in species"
                      v-bind:key="s.id"
                  >
                    {{ s.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-one-third">
          <div class="field">
            <label class="label">Program Manager</label>
            <div class="control is-expanded">
              <div class="select is-fullwidth">
                <select v-model="newProgram.manager">
                  <option disabled value="">Select a user</option>
                  <option
                      v-for="role in roles"
                      v-bind:key="role.id"
                  >
                    {{ role.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
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
          >
            <!-- always display table row data -->
            <td>{{ program.data.name }}</td>
            <td>{{ program.data.species }}</td>
            <td>{{ program.data.numUsers }}</td>
            <td class="has-text-right">
              <a  v-on:click="program.toggleEdit()">Edit</a>
              <template v-if="program.edit">
                <span class="icon is-small margin-right-2 span-verticial-middle">
                  <ChevronDownIcon size="1x" aria-hidden="true"></ChevronDownIcon>
                </span>
              </template>
              <template v-else>
                <span class="icon is-small margin-right-2 span-verticial-middle">
                  <ChevronRightIcon size="1x" aria-hidden="true"></ChevronRightIcon>
                </span>
              </template>
              <a class="" v-on:click="displayWarning(index)">Deactivate</a>
            </td>
          </tr>
          <tr v-bind:key="program.data.id" v-if="program.edit"
              v-bind:class="{'is-selected': (program.edit == true), 'is-new': (program.new == true)}" 
          >
            <td colspan="4">
              <EditDataRowForm
                @submit="saveEdit"
                @cancel="program.toggleEdit()"
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
                    <div class="field">
                      <label class="label">Species</label>
                      <div class="control is-expanded">
                        <div class="select is-fullwidth">
                          <select v-model="newProgram.species">
                            <option disabled value="">Select a species</option>
                            <option
                                v-for="s in species"
                                v-bind:key="s.id"
                            >
                              {{ s.name }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column is-one-third">
                    <div class="field">
                      <label class="label">Program Manager</label>
                      <div class="control is-expanded">
                        <div class="select is-fullwidth">
                          <select v-model="newProgram.manager">
                            <option disabled value="">Select a user</option>
                            <option
                                v-for="role in roles"
                                v-bind:key="role.id"
                            >
                              {{ role.name }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
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
import NewDataRowForm from '@/components/forms/NewDataRowForm.vue'
import EditDataRowForm from '@/components/forms/EditDataRowForm.vue'
import {Program} from '@/model/Program'
import {TableRow} from '@/model/view_models/TableRow'
import {Role} from '@/model/Role'
import {Species} from '@/model/Species'

@Component({
  mixins: [validationMixin],
  components: { NewDataRowForm, EditDataRowForm,
                InputError, InputField,
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
  private roles: Array<Role> = [new Role('1', 'Bob Reed'), new Role('2', 'Will Smith'), new Role('3', 'Kevin Jones')];
  private species: Array<Species> = [new Species('1', 'Grape'), new Species('2','Sweet Potato'), new Species('3','Blueberry')];

  private deleteIndex: number = -1;
  private currentNewRow: TableRow<Program> | null = null;

  private programName: string = "Program Name";

  @Validations()
  validations = {
    newProgram : {
      name: {required},
      species: {required},
      manager: {required}
    }
  }

   mounted() {
    this.getPrograms();
  }

   getPrograms() {
    // TODO: api call
    // stubbed for now
    this.programs.push(new TableRow(true, new Program('1', 'Lance Grape Program', 'lance@cornell.edu', '5')));
    this.programs.push(new TableRow(true, new Program('2', 'Phil Sweet Potato Program', 'phil@usda.gov', '2')));
    this.programs.push(new TableRow(true, new Program('3', 'Some Other Program', 'some.program@usda.gov', '10')));
  }

  createProgram() {
    this.newProgramActive = true;
  }

  updateProgram(rowIndex: number) {
    // TODO: api call
    const editRow: TableRow<Program> = this.programs[rowIndex];
    editRow.confirmChanges();
    editRow.toggleEdit();

    this.clearNewRow();
    this.$emit('show-success-notification', 'Program successfully updated');
  }

  saveProgram() {
    this.$v.$touch();
    if (this.$v.$anyError){
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

      if (this.newProgram.name != undefined && this.newProgram.species != undefined) {
        const newProgram: Program = new Program(id.toString(), this.newProgram.name, this.newProgram.species, '1');
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
      this.$v.$reset();

    }
  }

  cancelNewProgram() {
    this.newProgram = new Program();
    this.$v.$reset();
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

  saveEdit() {
    
  }

}

</script>