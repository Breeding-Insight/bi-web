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
  <section id="programUserTableLabel">
    <WarningModal
      v-bind:active.sync="deactivateActive"
      v-bind:msg-title="deactivateWarningTitle"
      v-on:deactivate="deactivateActive = false"
    >
      <section>
        <p class="has-text-dark">
          This will only remove the user's access to your program and will not affect their account.
        </p>
        <p class="has-text-dark">
          Program-related data collected by this user will not be affected by this change.
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button
            class="button is-danger"
            v-on:click="modalDeleteHandler()"
          >
            <strong>Yes, archive</strong>
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
      v-show="!newUserActive & users.length > 0"
      class="button is-primary has-text-weight-bold is-pulled-right"
      v-on:click="newUserActive = true"
    >
      <span class="icon is-small">
        <PlusCircleIcon
          size="1.5x"
          aria-hidden="true"
        />
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
      v-bind:row-validations="userValidations"
      v-bind:editable="true"
      v-bind:pagination="usersPagination"
      v-on:submit="updateUser($event)"
      v-on:remove="displayWarning($event)"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
      v-on:paginate="paginationController.updatePage($event)"
      v-on:paginate-toggle-all="paginationController.toggleShowAll()"
      v-on:paginate-page-size="paginationController.updatePageSize($event)"
    >
      <template v-slot:columns="data">
        <TableRowColumn name="name">
          {{ data.name }}
        </TableRowColumn>
        <TableRowColumn name="email">
          {{ data.email }}
        </TableRowColumn>
        <TableRowColumn name="roles">
          <template v-if="rolesMap.size > 0">
            {{ getRoleName(data.roleId) }}
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
              v-bind:selected-id="editData.roleId"
              v-bind:field-name="'Role'"
            />
          </div>
        </div>
      </template>
      <template v-slot:emptyMessage>
        <EmptyTableMessage
          v-bind:button-view-toggle="!newUserActive"
          v-bind:button-text="'New User'"
          v-on:newClick="newUserActive = true"
        >
          <p class="has-text-weight-bold">
            No program users are currently defined.
          </p>
          <p>
            You can add a user to your program from this panel. When you remove a user from your
            program, their account and membership in other programs is not affected.
          </p>
          <p>You can add, edit, and delete users from your program from this panel.</p>
        </EmptyTableMessage>
      </template>
    </BaseTable>
  </section>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {PlusCircleIcon} from 'vue-feather-icons'
import {validationMixin} from 'vuelidate'
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
import { mapGetters } from 'vuex'
import {Program} from "@/breeding-insight/model/Program";
import EmptyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
  import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
  import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
  import {Pagination} from "@/breeding-insight/model/BiResponse";

@Component({
  mixins: [validationMixin],
  components: { NewDataForm, BasicInputField, BasicSelectField, BaseTable, TableRowColumn,
                WarningModal, PlusCircleIcon, EmptyTableMessage
              },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ProgramUsersTable extends Vue {

  private activeProgram?: Program;
  public users: ProgramUser[] = [];
  private usersPagination?: Pagination = new Pagination();
  userTableHeaders: string[] = ['Name', 'Email', 'Role'];

  private deactivateActive: boolean = false;
  private newUserActive: boolean = false;
  private deactivateWarningTitle: string = "Remove user's access to Program name?";
  private newUser = new ProgramUser();
  private roles: Array<Role> = [];

  private deleteUser?: ProgramUser;
  private rolesMap: Map<string, Role> = new Map();
  private programName: string = "Program Name";

  private paginationController: PaginationController = new PaginationController();

  userValidations = {
    name: {required},
    email: {required, email},
    roleId: {required}
  }

  mounted() {
    this.getRoles();
    this.getUsers();
  }

  @Watch('paginationController', { deep: true})
  getUsers() {

    let paginationQuery: PaginationQuery = PaginationController.getPaginationSelections(
      this.paginationController.currentPage, this.paginationController.pageSize, this.paginationController.showAll);
    this.paginationController.setCurrentCall(paginationQuery);

    ProgramUserService.getAll(this.activeProgram!.id!, paginationQuery).then(([programUsers, metadata]) => {
      if (this.paginationController.matchesCurrentRequest(metadata.pagination)){
        this.users = programUsers;
        this.usersPagination = metadata.pagination;
      }

    }).catch((error) => {
      // Display error that users cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load program users');
      throw error;
    });
  }

  getRoles() {

    RoleService.getAll().then(([roles, metadata]) => {
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

    this.newUser.program = this.activeProgram;

    ProgramUserService.create(this.newUser).then((user: ProgramUser) => {
      this.paginationController.updatePage(1);
      this.getUsers();
      this.$emit('show-success-notification', 'Success! ' + this.newUser.name + ' added.');
      this.newUser = new ProgramUser();
      this.newUserActive = false;
    }).catch((error) => {
      this.$emit('show-error-notification', error.errorMessage);
    })

  }

  cancelNewUser() {
    this.newUser = new ProgramUser();
    this.newUserActive = false;
  }

  displayWarning(user: ProgramUser) {

    if (user){
      this.deleteUser = user;
      this.deactivateWarningTitle = "Deactivate " + user.name + " from program " + this.activeProgram!.name + "?";
      this.deactivateActive = true;
    } else {
      Vue.$log.error('Could not find object to delete')
    }
  }

  modalDeleteHandler() {
    this.deactivateActive = false;

    if (this.deleteUser) {
      if (this.deleteUser.id) {
        if (this.deleteUser.name) {
          const deleteId: string = this.deleteUser.id;
          const deleteName: string = this.deleteUser.name;
          ProgramUserService.delete(this.activeProgram!.id!, deleteId).then(() => {
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

  getRoleName(id: string): string | undefined {
    return this.rolesMap.get(id)!.name;
  }

}

</script>