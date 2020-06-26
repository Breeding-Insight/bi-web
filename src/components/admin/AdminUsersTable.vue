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
  <div>
    <WarningModal
      v-bind:active.sync="deactivateActive"
      v-bind:msg-title="deactivateWarningTitle"
      v-on:deactivate="deactivateActive = false"
    >
      <section>
        <template v-if="deactivateActive">
          <template v-if="getActiveProgramRoles().length > 0">
            <p class="has-text-dark">
              Access for this user will be removed system wide, including:
            </p>
            <ul>
              <template
                  v-for="(programRole, index) of getActiveProgramRoles()"
              >
                <li
                    v-if="programRole.program"
                    v-bind:key="index"
                    class="has-text-black"
                >
                  {{ programRole.program.name }}
                </li>
              </template>
            </ul>
          </template>
          <template v-else>
            <p class="has-text-dark">
              Access for this user will be removed system wide.
            </p>
          </template>
        </template>
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
            <strong>Yes, deactivate</strong>
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

    <div class="level is-marginless">
      <div class="level-left"></div>
      <div class="level-right">
        <div class="level-item">
          <p>Inactive programs are  <span class="has-background-grey-light">[ highlighted ]</span></p>
        </div>
      </div>
    </div>



    <button
      v-show="!newUserActive"
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
      v-on:submit="addUser"
      v-on:cancel="cancelNewUser"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
      <template v-slot="validations">
        <div class="columns">
          <div class="column is-one-third">
            <BasicInputField
              v-model="newUser.name"
              v-bind:validations="validations.name"
              v-bind:field-name="'Name'"
              v-bind:field-help="'Name of user. All Unicode special characters accepted.'"
            />
          </div>
          <div class="column is-one-third">
            <BasicInputField
              v-model="newUser.email"
              v-bind:validations="validations.email"
              v-bind:field-name="'Email'"
            />
          </div>
          <div class="column is-one-third">
            <BasicSelectField
              v-model="newUser.roleId"
              v-bind:options="roles"
              v-bind:field-name="'Role'"
            />
          </div>
        </div>
      </template>
    </NewDataForm>

    <BaseTable
      v-bind:headers="userTableHeaders"
      v-bind:hide-mobile-headers="hideMobileHeaders"
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
        <TableRowColumn name="species" class="is-hidden-mobile">
          {{ data.email }}
        </TableRowColumn>
        <TableRowColumn name="roles">
          <template v-if="rolesMap.size > 0">
            {{ getRoleName(data.roleId) }}
          </template>
        </TableRowColumn>
        <TableRowColumn>
          <template
            v-if="getRoleName(data.roleId) === 'admin'"
          >
            <span
              class="is-text has-text-weight-bold"
            >
              Admin (all programs)
            </span>
          </template>
          <template
            v-for="(programRole, index) of data.programRoles"
            v-else
          >
            <span v-bind:key="'program' + index">
              <!-- One line span needed to remove after space. Don't change. -->
              <!-- eslint-disable-next-line -->
              <span v-if="programRole.active" class="is-text">{{ programRole.program.name }}</span>
              <!-- One line span needed to remove after space. Don't change. -->
              <!-- eslint-disable-next-line -->
              <span v-else class="has-background-grey-lighter">[ {{ programRole.program.name }} ]</span>
              <!-- One line span needed to remove after space. Don't change. -->
              <!-- eslint-disable-next-line -->
              <span v-if="index !== data.programRoles.length - 1">, </span>
            </span>
          </template>
        </TableRowColumn>
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
          <div class="column is-one-third">
            <BasicSelectField
              v-model="editData.roleId"
              v-bind:options="roles"
              v-bind:selected-id="editData.roleId"
              v-bind:field-name="'Role'"
              v-bind:empty-value-name="'No Role'"
            />
          </div>
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import { User } from '@/breeding-insight/model/User'
import { PlusCircleIcon } from 'vue-feather-icons'
import WarningModal from '@/components/modals/WarningModal.vue'

import {required, email} from 'vuelidate/lib/validators'
import BaseTable from "@/components/tables/BaseTable.vue";
import TableRowColumn from "@/components/tables/TableRowColumn.vue";
import BasicInputField from "@/components/forms/BasicInputField.vue";
import {UserService} from "@/breeding-insight/service/UserService";
import NewDataForm from "@/components/forms/NewDataForm.vue";
import {RoleService} from "@/breeding-insight/service/RoleService";
import {Role} from "@/breeding-insight/model/Role";
import {SystemRoleService} from "@/breeding-insight/service/SystemRoleService";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";
import {PromiseHandler} from "@/breeding-insight/service/PromiseHandler";
import {PromiseResult} from "promise.allsettled/types";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
  import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
  import {Pagination} from "@/breeding-insight/model/BiResponse";


@Component({
  components: {
    NewDataForm, PlusCircleIcon, WarningModal, BaseTable, TableRowColumn, BasicInputField, BasicSelectField
  }
})
export default class AdminUsersTable extends Vue {
  private deactivateActive: boolean = false;
  private newUserActive: boolean = false;
  private deactivateWarningTitle: string = "Remove user's access to Program name?";
  private newUser = new User();
  private currentDeleteUser: User | undefined;
  private roles: Role[] = [];
  private rolesMap: Map<string, Role> = new Map();

  userValidations = {
    name: {required},
    email: {required, email},
  }

  private paginationController: PaginationController = new PaginationController();

  public users: User[] = [];
  private usersPagination?: Pagination = new Pagination();
  private userTableHeaders = ['Name', 'Email', 'Role', 'Programs'];
  private hideMobileHeaders = ['Email'];

  mounted() {
    this.getRoles();
    this.getUsers();
  }

  getActiveProgramRoles() {
    if (this.currentDeleteUser) {
      if (this.currentDeleteUser.id && this.currentDeleteUser.programRoles) {
        return this.currentDeleteUser.programRoles.filter(programRole => programRole.active);
      }
    }
    return [];
  }

  cancelNewUser() {
    this.newUser = new User();
    this.newUserActive = false;
  }

  @Watch('paginationController', { deep: true})
  getUsers() {

    let paginationQuery: PaginationQuery = PaginationController.getPaginationSelections(
      this.paginationController.currentPage, this.paginationController.pageSize, this.paginationController.showAll);
    this.paginationController.setCurrentCall(paginationQuery);


    UserService.getAll(paginationQuery).then(([users, metadata]) => {
      if (this.paginationController.matchesCurrentRequest(metadata.pagination)){
        this.users = users;
        this.usersPagination = metadata.pagination;
      }
    }).catch((error) => {
      // Display error that users cannot be loaded
      this.$emit('show-error-notification', error.errorMessage);
      throw error;
    });

  }

  getRoles() {

    SystemRoleService.getAll().then(([roles, metadata]) => {
      this.roles = roles;
      for (const role of this.roles){
        // reassign so vue picks up changes
        this.rolesMap = new Map(this.rolesMap.set(role.id!, role));
      }
    }).catch((error) => {
      // Display error that users cannot be loaded
      this.$emit('show-error-notification', error.errorMessage);
      throw error;
    });

  }

  archiveUser(selectedId: string) {

    const user = this.users.find((user) => user.id === selectedId);

    if (user){

      UserService.archive(user).then(() => {
        this.getUsers();
        this.$emit('show-success-notification', 'User successfully archived');
      }).catch((error: any) => {
        this.$emit('show-error-notification', error.errorMessage);
      });

    } else {
      this.$emit('show-error-notification', 'Unable to find user to archive');
    }

  }

  addUser() {

    UserService.create(this.newUser).then((user: User) => {
      this.paginationController.updatePage(1);
      this.getUsers();
      this.newUser = new User();
      this.newUserActive = false;
      this.$emit('show-success-notification', 'User successfully created');
    }).catch((error) => {
      this.$emit('show-error-notification', error.errorMessage);
    });

  }

  updateUser(user: User) {

    const updateUserPromise = UserService.update(user);
    const updateRolesPromise = UserService.updateSystemRoles(user);

    const promiseHandler = new PromiseHandler([updateUserPromise, updateRolesPromise]);
    promiseHandler.resolvePromises()
      .then((result:User[]) => {
        this.$emit('show-success-notification', 'User successfully updated');
      }).catch((errors: any[]) => {
        for (const error of errors) {
          //TODO: This is where multiple error messages could be handy
          this.$emit('show-error-notification', error.errorMessage);
        }
      }).finally(() => {
        this.getUsers();
      });
  }

  displayWarning(user: User) {
    // Get the username
    this.currentDeleteUser = user;
    this.deactivateWarningTitle = "Deactivate " + user.name + " from the system?";
    this.deactivateActive = true;
  }

  modalDeleteHandler() {
    this.deactivateActive = false;

    if (this.currentDeleteUser){
      if (this.currentDeleteUser.id){
        this.archiveUser(this.currentDeleteUser.id);
      }
    }

  }

  getRoleName(id: string): string | undefined {
    if (this.rolesMap.get(id)){
      return this.rolesMap.get(id)!.name;
    }
  }

}
  
</script>