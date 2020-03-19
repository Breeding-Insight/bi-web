<template>
  <section id="adminUserTableLabel">
    <WarningModal
      v-on:submit="modalDeleteHandler()" 
      v-on:cancel="modalCancelHandler()" 
      v-bind:active="deactivateActive"
      v-bind:msg-title="deactivateWarningTitle"
    >
      <section>
        <p class="has-text-dark">
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
        <div class="column is-one-half">
          <InputField
            v-model="newUser.name"
            :field-error.sync="$v.newUser.name.$error"
            :field-type="'text'"
            :placeholder="'New User Name'"
          >
            <template v-slot:label>Name</template>
            <template v-slot:errors>
              <InputError>Name is required</InputError>
            </template>
            <template v-slot:help>
              Full name as preferred. All Unicode special characters accepted.
            </template>
          </InputField>
        </div>
        <div class="column is-one-half">
          <InputField
            v-model="newUser.email"
            :field-error.sync="$v.newUser.email.$error"
            :field-type="'email'"
            :placeholder="'New User Email'"
          >
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
      </div>
    </NewDataRowForm>
      <table role="grid" aria-labelledby="adminUserTableLabel" class="table is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
        <tr>
          <th>User Name</th>
          <th>Email</th>
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
        <tr v-bind:key="user.data.id" v-for="(user, index) in users"
            v-bind:class="{'is-selected': (user.edit == true), 'is-new': (user.new == true)}"
        >
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
           <td class="has-text-right">
            
            <a class="margin-right-2" v-on:click="user.toggleEdit()" v-if="!user.edit">Edit</a>
            <a class="" v-on:click="displayWarning(index)" v-if="!user.edit">Delete</a>
            
            <button class="button is-pulled-right" title="Cancel Edit" v-on:click="user.cancelEdit()" v-if="user.edit">
              Cancel
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
import * as api from '@/util/api'
import { BiResponse } from '@/model/BiResponse'
import SuccessNotification from '@/components/notifications/SuccessNotification.vue'
import { TableRow } from '@/model/view_models/TableRow.ts'
import NewDataRowForm from '@/components/forms/NewDataRowForm.vue'
import { User } from '@/model/User.ts'
import { EditIcon, DeleteIcon, CheckSquareIcon, XIcon, XSquareIcon, CheckCircleIcon, PlusCircleIcon } from 'vue-feather-icons'
import WarningModal from '@/components/modals/WarningModal.vue'

import {validationMixin} from 'vuelidate'
import {Validations} from 'vuelidate-property-decorators'
import {required, email} from 'vuelidate/lib/validators'
import InputError from '@/components/forms/InputError.vue'
import InputField from '@/components/forms/InputField.vue'


@Component({
  components: {SuccessNotification, EditIcon, DeleteIcon, InputField, InputError, NewDataRowForm,
              CheckSquareIcon, XIcon, XSquareIcon, CheckCircleIcon, PlusCircleIcon, WarningModal}
})
export default class AdminUsersTable extends Vue {
  private deactivateActive: boolean = false;
  private newUserActive: boolean = false;
  private deactivateWarningTitle: string = "Remove user's access to Program name?";
  private newUser: User = new User();
  private deleteIndex: number = -1;
  private newEmail: string= "";

  @Validations()
  validations = {
    newUser : {
      name: {required},
      email: {required, email},
    }
  }

  public users: Array<TableRow<User>> = [];
  public newUserInputs = {
    name: null,
    email: null
  }

  mounted() {
    this.getUsers();
  }

  createUser() {
    this.newUserActive = true;
  }

  saveUser() {
    this.$v.$touch();
    if (this.$v.$anyError){
      this.$emit('show-error-notification', 'Fix Invalid Fields');
      return;
    }
    else {
      this.addUser();
      this.newUser = new User();
      this.$v.$reset();
      this.newUserActive = false;
    }
  }

  cancelNewUser() {
    this.newUser = new User();
    this.$v.$reset();
    this.newUserActive = false;
  }

  getUsers() {

    api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/users`, method: 'get' })
    .then((response: any) => {
      const biResponse = new BiResponse(response.data);

      // Parse our users into the vue users param
      this.users = biResponse.result.data.map((user: any) => {
        const data = new User(user.id, user.name, user.email);
        const editable = true;
        const newUser = new TableRow(editable, data);
        if (user.email === this.newEmail) {
          newUser.toggleNew();
        }
        return newUser;
      });

      Vue.$log.debug(this.users);
    })
    .catch((error) => {
      // Display error that users cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load users');
      throw error;
    })

  }

  deleteUser(selectedId: string) {

    console.log(selectedId);
    api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/users/${selectedId}`, method: 'delete'})
    .then((response) => {
      this.clearNewRow();
      // Reload users
      this.getUsers();
      // Show notification
      this.$emit('show-success-notification', 'User successfully deleted');

    }).catch((error) => {
      // Display error
      this.$emit('show-error-notification', 'Unable to delete user');
      throw error;
    });

  }

  addUser() {

    // Construct request body
    const body = {'name': this.newUser.name, 'email': this.newUser.email};
    
    this.setNewRow(this.newUser.email!);
    // Make api request
    api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/users`, method: 'post', data: body})
      .then((response) => {
        // Reload users
        this.getUsers();

        // Show success notification
        this.$emit('show-success-notification', 'User successfully created');

      }).catch((error) => {

        // Look for email conflict and display error
        if (error.response && error.response.status == 409) {
          Vue.$log.info('Email already exists');
          this.$emit('show-error-notification', 'A user with that email already exists');
        }
        else {
          // Something else went wrong
          Vue.$log.fatal(error);
          this.$emit('show-error-notification', 'Unable to create user');
        }
        throw error;
      }); 
  }

  updateUser(rowIndex: number, userId: string) {

    // Get our user 
    const editRow: TableRow<User> = this.users[rowIndex] as TableRow<User>;

    // Construct body
    const user: User = editRow.editData;
    const body = {'name': user.name, 'email': user.email};

    api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/users/${editRow.data.id}`, method: 'put', data: body})
      .then((response) => {
        this.clearNewRow();

        // Reload users
        this.getUsers();

        // Close the edit state
        editRow.confirmChanges();

        // Show success notification
        this.$emit('show-success-notification', 'User successfully updated');


      }).catch((error) => {
        // Display error
        this.$emit('show-error-notification', 'Unable to update user');

        // We let the inputs stay open so they can make changes

      });
  }

  displayWarning(rowIndex: number) {
    // Get the username
    const editRow: TableRow<User> = this.users[rowIndex];
    const user: User = editRow.editData;
    this.deleteIndex = rowIndex;
    this.deactivateWarningTitle = "Remove " + user.name + " from system?";
    this.deactivateActive = true;
  }

  modalDeleteHandler() {
    this.deactivateActive = false;
    const editRow: TableRow<User> = this.users[this.deleteIndex];
    const user: User = editRow.editData;
    console.log(user.id);
    this.deleteUser(user.id);
  }

  modalCancelHandler() {
    this.deactivateActive = false;
  }

  clearNewRow() {
    this.newEmail = "";
  }

  setNewRow(email: string) {
    this.newEmail = email;
  }

}
  
</script>