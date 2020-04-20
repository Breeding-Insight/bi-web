<template>
  <div>
    <WarningModal
      v-bind:active.sync="deactivateActive"
      v-bind:msg-title="deactivateWarningTitle"
      v-on:deactivate="deactivateActive = false"
    >
      <section>
        <p class="has-text-dark">
          Program-related data collected by this user will not be affected by this change.
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button v-on:click="modalDeleteHandler()" class="button is-danger"><strong>Yes, remove</strong></button>
          <button v-on:click="deactivateActive = false" class="button">Cancel</button>
        </div>
      </div>              
    </WarningModal>

    <button
      class="button is-primary has-text-weight-bold is-pulled-right"
      v-on:click="newUserActive = true"
      v-show="!newUserActive"
    >
      <span class="icon is-small">
        <PlusCircleIcon size="1.5x" aria-hidden="true"></PlusCircleIcon>
      </span>
      <span>
        New User
      </span>
    </button>

    <NewDataForm
        v-if="newUserActive"
        v-bind:row-validations="userValidations"
        v-bind:new-record.sync="newUser"
        v-on:submit="addUser"
        v-on:cancel="cancelNewUser"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
      <template v-slot="validations">
        <div class="columns">
          <div class="column is-one-half">
            <BasicInputField
                v-model="newUser.name"
                v-bind:validations="validations.name"
                v-bind:field-name="'Name'"
                v-bind:field-help="'Name of user. All Unicode special characters accepted.'"
            />
          </div>
          <div class="column is-one-half">
            <BasicInputField
                v-model="newUser.email"
                v-bind:validations="validations.email"
                v-bind:field-name="'Email'"
            />
          </div>
        </div>
      </template>
    </NewDataForm>

    <BaseTable
        v-bind:headers="userTableHeaders"
        v-bind:records.sync="users"
        v-bind:new-record.sync="currentNewUser"
        v-bind:rowValidations="userValidations"
        v-bind:editable="true"
        v-on:submit="updateUser($event)"
        v-on:remove="displayWarning($event)"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
      <template v-slot:columns="data">
        <TableRowColumn name="name">{{data.name}}</TableRowColumn>
        <TableRowColumn name="species">{{data.email}}</TableRowColumn>
      </template>
      <template v-slot:edit="{editData, validations}">
        <div class="columns">
          <div class="column is-one-half">
            <BasicInputField
                v-model="editData.name"
                v-bind:validations="validations.name"
                v-bind:field-name="'Name'"
                v-bind:field-help="'Name of user. All Unicode special characters accepted.'"
            />
          </div>
          <div class="column is-one-half">
            <BasicInputField
                v-model="editData.email"
                v-bind:validations="validations.email"
                v-bind:field-name="'Email'"
            />
          </div>
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { User } from '@/breeding-insight/model/User'
import { PlusCircleIcon } from 'vue-feather-icons'
import WarningModal from '@/components/modals/WarningModal.vue'

import {required, email} from 'vuelidate/lib/validators'
import BaseTable from "@/components/tables/BaseTable.vue";
import TableRowColumn from "@/components/tables/TableRowColumn.vue";
import BasicInputField from "@/components/forms/BasicInputField.vue";
import {UserService} from "@/breeding-insight/service/UserService";
import NewDataForm from "@/components/forms/NewDataForm.vue";


@Component({
  components: {
    NewDataForm, PlusCircleIcon, WarningModal, BaseTable, TableRowColumn, BasicInputField
  }
})
export default class AdminUsersTable extends Vue {
  private deactivateActive: boolean = false;
  private newUserActive: boolean = false;
  private deactivateWarningTitle: string = "Remove user's access to Program name?";
  private newUser: User = new User();
  private currentNewUser: User = new User();
  private currentDeleteUser: User | undefined;

  userValidations = {
    name: {required},
    email: {required, email},
  }

  public users: User[] = [];
  private userTableHeaders = ['Name', 'Email'];

  mounted() {
    this.getUsers();
  }

  cancelNewUser() {
    this.newUser = new User();
    this.newUserActive = false;
  }

  getUsers() {

    UserService.getAll().then((users: User[]) => {
      this.users = users;
    }).catch((error) => {
      // Display error that users cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load users');
      throw error;
    });

  }

  deleteUser(selectedId: string) {

    const user = this.users.find((user) => user.id === selectedId);

    if (user){

      UserService.delete(user).then(() => {
        this.getUsers();
        this.$emit('show-success-notification', 'User successfully deleted');
      }).catch((error: any) => {
        this.$emit('show-error-notification', 'Unable to delete user');
      });

    } else {
      this.$emit('show-error-notification', 'Unable to find user to delete');
    }

  }

  addUser() {

    UserService.create(this.newUser).then((user: User) => {
      this.currentNewUser = user;
      this.getUsers();
      this.newUser = new User();
      this.newUserActive = false;
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
    });

  }

  updateUser(user: User) {

    UserService.update(user).then((user: User) => {
      this.getUsers();
      this.$emit('show-success-notification', 'User successfully updated');
    }).catch((error) => {
      this.$emit('show-error-notification', 'Unable to update user');
    });

  }

  displayWarning(user: User) {
    // Get the username
    this.currentDeleteUser = user;
    this.deactivateWarningTitle = "Remove " + user.name + " from system?";
    this.deactivateActive = true;
  }

  modalDeleteHandler() {
    this.deactivateActive = false;

    if (this.currentDeleteUser){
      if (this.currentDeleteUser.id){
        this.deleteUser(this.currentDeleteUser.id);
      }
    }

  }

}
  
</script>