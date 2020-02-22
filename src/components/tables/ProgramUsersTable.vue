<template>
  <section>
    <WarningModal
      v-on:submit="modalDeleteHandler()" 
      v-on:cancel="modalCancelHandler()" 
      v-bind:active="deactivateActive"
      v-bind:msg-title="deactivateWarningTitle"
    >
      <section>
        <p class="has-text-black">
          Program-related data collected by this user will not be affected by this change.
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button v-on:click="modalDeleteHandler()" class="button is-danger"><strong>Yes, remove</strong></button>
          <button v-on:click="modalCancelHandler()" class="button">Cancel</button>
        </div>
      </div>              
    </WarningModal>
    <NewDataRowForm
      v-if="newUserActive"
      @submit="saveUser"
      @cancel="cancelNewUser"
    >
      <div class="columns">
        <div class="column is-two-fifths">
          <InputField v-model="newUser.name" :field-error.sync="$v.newUser.name.$error">
            <template v-slot:label>Name</template>
            <template v-slot:errors>
              <InputError>Name is required</InputError>
            </template>
            <template v-slot:help>
              Full name as preferred. All Unicode special characters accepted.
            </template>
          </InputField>
        </div>
        <div class="column is-two-fifths">
          <InputField v-model="newUser.email" :field-error.sync="$v.newUser.email.$error">
            <template v-slot:label>Email</template>
            <template v-slot:errors>
              <InputError v-bind:hidden-indication.sync="$v.newUser.email.required">
                Email is required
              </InputError>
              <InputError v-bind:hidden-indication.sync="$v.newUser.email.email">
                Must be in email format
              </InputError>
            </template>
            <template v-slot:help>
              New users will receive an email at this address to activate their account.
            </template>
          </InputField>
        </div>
        <div class="column is-one-fifth">
          <div class="field">
            <label class="label">Role</label>
            <div class="control is-expanded">
              <div class="select is-fullwidth">
                <select v-model="$v.newUser.role.$model">
                  <option disabled value="">Select a role</option>
                  <option
                      v-for="role in roles"
                      v-bind:key="role.data.id"
                  >
                    {{ role.data.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NewDataRowForm>
    <table role="grid" aria-labelledby="programUserTableLabel" class="table is-striped is-narrow is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>
            Name
          </th>
          <th>Email</th>
          <th>
            Role
          </th>
          <th>
            <button class="button is-primary has-text-weight-bold is-pulled-right" v-on:click="createUser()" v-if="!newUserActive">
              <span class="icon is-small">
                <PlusCircleIcon size="1.5x" aria-hidden="true"></PlusCircleIcon>
              </span>
              <span>
                New User
              </span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-bind:key="user.data.id" v-for="(user, index) in users" v-bind:class="{'is-selected': (user.edit == true)}">
          <td v-if="user.edit">
            <input type="text" class="input" v-model="user.editData.name" placeholder="User Name">
          </td>
          <td v-else>{{ user.data.name }}</td>
          <td v-if="user.edit">
              <input type="text" class="input" v-model="user.editData.email" placeholder="User Email">
          </td>
          <td v-else>
              {{ user.data.email }}
          </td>
          <td v-if="user.edit">
              <input type="text" class="input" v-model="user.editData.roles" placeholder="Roles">
          </td>
          <td v-else>
              {{ user.data.roles[0] }}
          </td>
          <td class="has-text-right">
            
            <a class="margin-right-2" v-on:click="user.toggleEdit()" v-if="!user.edit">Edit</a>
            <a class="" v-on:click="displayWarning(index)" v-if="!user.edit">Deactivate</a>
            
            <button class="button is-pulled-right" title="Cancel Edit" v-on:click="user.cancelEdit()" v-if="user.edit">
              <span class="icon is-small is-light">
                <XSquareIcon size="1.5x" aria-hidden="true"></XSquareIcon>
                <span class="is-sr-only">Cancel Edit</span>
              </span>
              <span>
                Cancel
              </span>
            </button>
            
            <button class="button is-pulled-right is-primary"  title="Confirm Location" v-on:click="updateUser(index)" v-if="user.edit">
              <span class="icon is-small">
                <CheckCircleIcon size="1.5x" aria-hidden="true"></CheckCircleIcon>
                <span class="is-sr-only">Confirm Edits</span>
              </span>
              <span>
                Save
              </span>
            </button>
          </td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import WarningModal from '@/components/modals/WarningModal.vue'
import { PlusCircleIcon, CheckCircleIcon, XSquareIcon } from 'vue-feather-icons'
import {validationMixin} from "vuelidate";
import InputError from "@/components/forms/InputError.vue"
import InputField from "@/components/forms/InputField.vue"
import NewDataRowForm from "@/components/forms/NewDataRowForm.vue"
import {Validations} from 'vuelidate-property-decorators'
import {required, email} from 'vuelidate/lib/validators'
import {ProgramUser} from "@/model/ProgramUser.ts"
import { TableRow } from '@/model/view_models/TableRow.ts'
import { User } from '@/model/User.ts'


@Component({
  mixins: [validationMixin],
  components: { NewDataRowForm,
                InputError, InputField,
                WarningModal, 
                PlusCircleIcon, CheckCircleIcon, XSquareIcon,
                 }
})
export default class ProgramUsersTable extends Vue {

  private users: Array<Object> = [];

  private deactivateActive: boolean = false;
  private newUserActive: boolean = false;
  private deactivateWarningTitle: string = "Remove user's access to Program name?";
  private newUser: ProgramUser = new ProgramUser();

  private programName: string = "Program Name";

  @Validations()
  validations = {
    newUser : {
      name: {required},
      email: {required, email},
      role: {}
    }
  }

   mounted() {
    this.getUsers();
  }

   getUsers() {
    // stubbed for now
    this.users.push(new TableRow(true, new User('1', 'Ann Other Budy', 'Ann.otherbudy@usda.gov', ['Field Manager'])));
    this.users.push(new TableRow(true, new User('2', 'Ima Fyne Breeder', 'ima.breeder@usda.gov', ['Breeder'])));
    this.users.push(new TableRow(true, new User('3', 'Somme Bodie', 'somme.bodie@usda.gov', ['Field Worker'])));
  }

  createUser() {
    this.newUserActive = true;
  }

  updateUser(rowIndex: number, userId: string) {
    console.log('update');

    // Get our user 
    const editRow: TableRow<User> = this.users[rowIndex] as TableRow<User>;

    // Construct body
    const user: User = editRow.editData;
    const body = {'name': user.name, 'email': user.email};

    // replace with api call
    editRow.confirmChanges();
    editRow.toggleEdit();
    this.$emit('show-success-notification', 'User successfully updated');
  }

  saveUser() {
    console.log("save user");

    this.$v.$touch();
    if (this.$v.$anyError){
      this.$emit('show-error-notification', 'Fix Invalid Fields');
      return;
    }
    else {
      // replace with api call
      this.users.push(new TableRow(true, new User('3', this.newUser.name, this.newUser.email, [this.newUser.role])));
      this.$emit('show-success-notification', 'Success! ' + this.newUser.name + ' added.');
      this.newUserActive = false;

      // Check all of our fields to see if they were required
      this.newUser = new ProgramUser();
      this.$v.$reset();

    }
  }

  cancelNewUser() {
    console.log('canceling edit');
    this.newUser = new ProgramUser();
    this.$v.$reset();
    this.newUserActive = false;
  }

  displayWarning(rowIndex: number, userId: string) {
    // Get the username
    const editRow: TableRow<User> = this.users[rowIndex] as TableRow<User>;
    const user: User = editRow.editData;
    this.deactivateWarningTitle = "Remove " + user.name + "'s access to " + this.programName + "?";
    this.deactivateActive = true;
  }

  modalDeleteHandler() {
    console.log('delete');
    this.deactivateActive = false;
    // TODO: deleteUser
  }

  modalCancelHandler() {
    console.log('cancel');
    this.deactivateActive = false;
  }

}

</script>