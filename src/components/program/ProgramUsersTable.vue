<template>
  <section id="programUserTableLabel">
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

    <button class="button is-primary has-text-weight-bold is-pulled-right" v-on:click="newUserActive = true" v-show="!newUserActive">
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
        v-on:submit="saveUser"
        v-on:cancel="cancelNewUser"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
      <template v-slot="validations">
        <div class="columns">
          <div class="column is-two-fifths">
            <BasicInputField
                v-model="newUser.name"
                v-bind:validations="validations.name"
                v-bind:field-name="'Name'"
                v-bind:field-help="'Full name as preferred. All Unicode special characters accepted.'"
            />
          </div>
          <div class="column is-two-fifths">
            <BasicInputField
                v-model="newUser.email"
                v-bind:validations="validations.email"
                v-bind:field-name="'Email'"
                v-bind:field-help="'New users will receive an email at this address to activate their account.'"
            />
          </div>
          <div class="column is-one-fifth">
            <BasicSelectField
                v-model="newUser.roleId"
                v-bind:validations="validations.roleId"
                v-bind:options="roles"
                v-bind:field-name="'Role'"
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
        <TableRowColumn name="email">{{data.email}}</TableRowColumn>
        <TableRowColumn name="roles">
          <template v-if="rolesMap.size > 0">
            {{getRoleName(data.roleId)}}
          </template>
        </TableRowColumn>
        
      </template>
      <template v-slot:edit="{editData, validations}">
        <div class="columns">
          <div class="column is-two-fifths">
            <BasicSelectField
                v-model="editData.roleId"
                v-bind:validations="validations.roleId"
                v-bind:options="roles"
                v-bind:selectedId="editData.roleId"
                v-bind:field-name="'Role'"
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
import {Validations} from 'vuelidate-property-decorators'
import {required, email} from 'vuelidate/lib/validators'

import WarningModal from '@/components/modals/WarningModal.vue'
import NewDataForm from '@/components/forms/NewDataForm.vue'
import BasicInputField from "@/components/forms/BasicInputField.vue";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";
import BaseTable from "@/components/tables/BaseTable.vue";
import {ProgramUser} from '@/breeding-insight/model/ProgramUser'
import TableRowColumn from "@/components/tables/TableRowColumn.vue";
import {Role} from '@/breeding-insight/model/Role'
import {ProgramUserService} from "@/breeding-insight/service/ProgramUserService";
import {RoleService} from "@/breeding-insight/service/RoleService";

@Component({
  mixins: [validationMixin],
  components: { NewDataForm, BasicInputField, BasicSelectField, BaseTable, TableRowColumn,
                WarningModal, 
                PlusCircleIcon
              }
})
export default class ProgramUsersTable extends Vue {

  public users: ProgramUser[] = [];
  userTableHeaders: string[] = ['Name', 'Email', 'Role'];

  private deactivateActive: boolean = false;
  private newUserActive: boolean = false;
  private deactivateWarningTitle: string = "Remove user's access to Program name?";
  private newUser: ProgramUser = new ProgramUser();
  private roles: Array<Role> = [];

  private deleteUser: ProgramUser | undefined;
  private currentNewUser: ProgramUser = new ProgramUser();
  private rolesMap: Map<string, Role> = new Map();
  private programName: string = "Program Name";

  userValidations = {
    name: {required},
    email: {required, email},
    roleId: {required}
  }

   mounted() {
    this.getRoles();
    this.getUsers();
  }

  get activeProgramId(): string {
    return this.$store.state.program.id;
  }

  getUsers() {

    ProgramUserService.getAll(this.activeProgramId).then((programUsers: ProgramUser[]) => {
      this.users = programUsers;
    }).catch((error) => {
      // Display error that users cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load program users');
      throw error;
    });
  }

  getRoles() {

    RoleService.getAll().then((roles: Role[]) => {
      this.roles = roles;
      for (const role of this.roles){
        // reassign so vue picks up changes
        this.rolesMap = new Map(this.rolesMap.set(role.id!, role));
      }
    }).catch((error) => {
      // Display error that users cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load roles');
      throw error;
    });

  }

  updateUser(updatedUser: ProgramUser) {

    ProgramUserService.update(updatedUser).then(() => {
      this.getUsers();
      this.$emit('show-success-notification', 'Success! ' + updatedUser.name + ' updated.');
    }).catch(() => {
      this.$emit('show-error-notification', 'Error updating program');
    });

  }

  saveUser() {

    this.newUser.programId = this.activeProgramId;

    ProgramUserService.create(this.newUser).then((user: ProgramUser) => {
      this.currentNewUser = user;
      this.getUsers();
      this.$emit('show-success-notification', 'Success! ' + this.newUser.name + ' added.');
      this.newUser = new ProgramUser();
      this.newUserActive = false;
    }).catch(() => {
      this.$emit('show-error-notification', 'Error while creating user, ' + this.newUser.name);
    })

  }

  cancelNewUser() {
    this.newUser = new ProgramUser();
    this.newUserActive = false;
  }

  displayWarning(user: ProgramUser) {

    if (user){
      this.deleteUser = user;
      this.deactivateWarningTitle = "Remove " + user.name + "'s access to " + this.programName + "?";
      this.deactivateActive = true;
    } else {
      this.$log.error('Could not find object to delete')
    }
  }

  modalDeleteHandler() {
    this.deactivateActive = false;

    if (this.deleteUser) {
      if (this.deleteUser.id) {
        if (this.deleteUser.name) {
          const deleteId: string = this.deleteUser.id;
          const deleteName: string = this.deleteUser.name;
          ProgramUserService.delete(this.activeProgramId, deleteId).then(() => {
            this.getUsers();
            this.$emit('show-success-notification', `${deleteName} removed from program`);
          }).catch(() => {
            this.$emit('show-error-notification', `Unable to remove user, ${deleteName}.`);
          })
          return;
        }
      }
    }

    this.$emit('show-error-notification', `Unable to remove user`);

  }

  getRoleName(id: string): string {
    return this.rolesMap.get(id)!.name;
  }

}

</script>