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
            <p class="has-text-dark" :class="this.$modalTextClass">
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
            <p class="has-text-dark" :class="this.$modalTextClass">
              Access for this user will be removed system wide.
            </p>
          </template>
        </template>
        <p class="has-text-dark" :class="this.$modalTextClass">
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
      v-on:click="showNewUser"
      data-testid="newFormBtn"
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

    <div class="is-clearfix"></div>

    <NewDataForm
      v-if="newUserActive"
      v-bind:row-validations="userValidations"
      v-bind:record.sync="newUser"
      v-bind:data-form-state="newUserFormState"
      v-on:submit="addUser"
      v-on:cancel="cancelNewUser"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
      <template v-slot="validations">
        <div class="columns">
          <div class="column is-one-fourth">
            <BasicInputField
              v-model="newUser.name"
              v-bind:validations="validations.name"
              v-bind:field-name="'Name'"
              v-bind:field-help="'Name of user. All Unicode special characters accepted.'"
            />
          </div>
          <div class="column is-one-fourth">
            <BasicInputField
              v-model="newUser.email"
              v-bind:validations="validations.email"
              v-bind:field-name="'Email'"
            />
          </div>
          <div class="column is-one-fourth">
            <BasicSelectField
              v-model="newUser.roleId"
              v-bind:options="roles"
              v-bind:field-name="'Role'"
            />
          </div>
        </div>
      </template>
    </NewDataForm>

    <ExpandableTable
      v-bind:records.sync="users"
      v-bind:loading="this.rolesLoading || this.usersLoading"
      v-bind:row-validations="userValidations"
      v-bind:editable="true"
      v-bind:archivable="true"
      v-bind:pagination="paginationController"
      v-bind:data-form-state="editUserFormState"
      v-on:submit="updateUser($event)"
      v-on:remove="displayWarning($event)"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
      v-on:is-mobile="isMobile = $event"
      backend-sorting
      v-bind:default-sort="[systemUserSortFieldAsBuefy, systemUserSortOrderAsBuefy]"
      v-on:sort="setSort"
    >
        <b-table-column field="data.name" label="Name"  sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
          {{ props.row.data.name }}
        </b-table-column>
         <b-table-column field="data.email" label="Email" v-bind:visible="!isMobile" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})"><!--
        -->{{ props.row.data.email }}<!--
      --></b-table-column>
        <b-table-column field="data.roleName" label="Role" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
          <template v-if="rolesMap.size > 0">
            {{ getRoleName(props.row.data.roleId) }}
          </template>
        </b-table-column>
        <b-table-column field="data.programList" label="Programs" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
          <span>{{ props.row.data.programList }}</span>

        </b-table-column>
        <b-table-column v-slot="props" :th-attrs="(column) => ({scope:'col'})">
          <a
              v-if="!props.row.data.orcid"
              v-on:click="resendEmail(props.row.data.id)"
              v-on:keypress.enter.space="resendEmail(props.row.data.id)"
              tabindex="0"
          >
            Resend Email
          </a>
        </b-table-column>
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
              v-bind:is-disabled="isCurrentUser(editData.id)"
            />
          </div>
        </div>
      </template>
    </ExpandableTable>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import { User } from '@/breeding-insight/model/User'
  import { PlusCircleIcon } from 'vue-feather-icons'
  import WarningModal from '@/components/modals/WarningModal.vue'

  import {required, email} from 'vuelidate/lib/validators'
  import TableColumn from "@/components/tables/TableColumn.vue";
  import BasicInputField from "@/components/forms/BasicInputField.vue";
  import {UserService} from "@/breeding-insight/service/UserService";
  import NewDataForm from "@/components/forms/NewDataForm.vue";
  import {Role} from "@/breeding-insight/model/Role";
  import {SystemRoleService} from "@/breeding-insight/service/SystemRoleService";
  import BasicSelectField from "@/components/forms/BasicSelectField.vue";
  import {PromiseHandler} from "@/breeding-insight/service/PromiseHandler";
  import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
  import {helpers} from "vuelidate/lib/validators";
  import { DataFormEventBusHandler } from '@/components/forms/DataFormEventBusHandler';
  import {mapGetters, mapMutations} from "vuex";
  import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
  import {
    DEACTIVATE_ALL_NOTIFICATIONS
  } from "@/store/mutation-types";
  import {UPDATE_SYSTEM_USER_SORT} from "@/store/sorting/mutation-types";
  import {
    ProgramSortField,
    Sort,
    SortOrder, SystemUserSort,
    SystemUserSortField,
    UserSort,
    UserSortField
  } from "@/breeding-insight/model/Sort";
  import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";

  @Component({
  components: {
    ExpandableTable, NewDataForm, PlusCircleIcon, WarningModal, TableColumn, BasicInputField, BasicSelectField
  },
  computed: {
    ...mapGetters([
        'activeUser'
    ]),
    ...mapGetters('sorting', [
        'systemUserSort',
        'systemUserSortFieldAsBuefy',
        'systemUserSortOrderAsBuefy'
    ])
  },
    methods: {
      ...mapMutations('sorting', {
        updateSort: UPDATE_SYSTEM_USER_SORT
      })
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
  private isMobile = false;
  private activeUser?: User;

  private rolesLoading = true;
  private usersLoading = true;

  userValidations = {
    name: {required},
    email: {required, email}
  }

  private paginationController: PaginationController = new PaginationController();

  private newUserFormState: DataFormEventBusHandler = new DataFormEventBusHandler();
  private editUserFormState: DataFormEventBusHandler = new DataFormEventBusHandler();

  public users: User[] = [];

  private systemUserSort!: UserSort;
  private updateSort!: (sort: SystemUserSort) => void;

  mounted() {
    this.getRoles();
    this.updatePagination();
    this.getUsers();
  }

    setSort(field: string, order: string) {
      const fieldMap: any = {
        'data.email': SystemUserSortField.Email,
        'data.name': SystemUserSortField.Name,
        'data.roleName': SystemUserSortField.Roles,
        'data.programList': SystemUserSortField.Programs
      };
      if (field in fieldMap) {
        this.updateSort(new SystemUserSort(fieldMap[field], Sort.orderAsBI(order)));
        this.getUsers();
      }
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
  paginationChanged() {
    let currentCall = this.paginationController.currentCall
    let paginationQuery = this.paginationController.getPaginationSelections();
    if(currentCall && currentCall!.page == paginationQuery.page && currentCall!.pageSize == paginationQuery.pageSize && currentCall!.showAll == paginationQuery.showAll) {
      return;
    }
    this.updatePagination();
    this.getUsers();
  }

  updatePagination() {
    let paginationQuery: PaginationQuery = this.paginationController.getPaginationSelections();
    this.paginationController.setCurrentCall(paginationQuery);
  }

  getUsers() {
    UserService.getAll(this.paginationController.currentCall, this.systemUserSort).then(([users, metadata]) => {
      if (this.paginationController.matchesCurrentRequest(metadata.pagination)){
        this.users = users;
        this.paginationController.setPaginationInfo(metadata.pagination);
      }
    }).catch((error) => {
      // Display error that users cannot be loaded
      this.$emit('show-error-notification', error.errorMessage);
      throw error;
    }).finally(() => this.usersLoading = false);

  }

  getRoles() {

    SystemRoleService.getAll().then(([roles, metadata]) => {
      this.roles = roles;
      for (const role of this.roles){
        // reassign so vue picks up changes
        this.rolesMap = new Map(this.rolesMap.set(role.id!, role));
      }
    }).catch((error) => {
      // Display error that roles cannot be loaded
      this.$emit('show-error-notification', error.errorMessage);
      throw error;
    }).finally(() => this.rolesLoading = false);

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

  async addUser() {

    let user: User | undefined = undefined;
    try {
      user = await UserService.create(this.newUser);
      this.paginationController.updatePage(1);
      this.paginationController.updateOnAdd();
      this.newUserActive = false;
      this.$emit('show-success-notification', this.newUser.name + ' successful created');
    } catch (error) {
      this.$emit('show-error-notification', error.errorMessage);
      return;
    } finally {
      this.newUserFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
    }

    this.newUser = new User();
    this.getUsers();
  }

    updateUser(user: User) {

    const updateUserPromise = UserService.update(user);

    //if active user is same as modified user, don't update roles
    let promiseHandler;
    let noRoles = this.isCurrentUser(user.id!);
    if (noRoles) {
      promiseHandler = new PromiseHandler([updateUserPromise]);
    } else {
      const updateRolesPromise = UserService.updateSystemRoles(user);
      promiseHandler = new PromiseHandler([updateRolesPromise, updateUserPromise]);
    }
    promiseHandler.resolvePromises()
      .then((result:User[]) => {
        if (noRoles) {
          this.$emit('show-success-notification', 'User info (name/email/program) successfully updated');
        } else {
          this.$emit('show-success-notification', 'User successfully updated');
        }
      }).catch((errors: any[]) => {
        // If two promises, show success if one of them succeeded
        if ((!noRoles) && (errors[0].status === PromiseHandler.FULFILLED)){
          this.$emit('show-success-notification', 'User roles successfully updated');
        }
        if ((!noRoles) && (errors[1].status === PromiseHandler.FULFILLED)){
          this.$emit('show-success-notification', 'User info (name/email/program) successfully updated');
        }

        // Shows any that are errors
        for (const error of errors) {
          if (error.status !== PromiseHandler.FULFILLED){
            //TODO: This is where multiple error messages could be handy
            this.$emit('show-error-notification', error.reason.errorMessage);
          }
        }
      }).finally(() => {
        this.editUserFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
        this.getUsers();
      });
  }

  async resendEmail(id: string) {
    try {
      await UserService.resendWelcomeEmail(id);
      this.$emit('show-success-notification', 'Account email sent.');
    } catch (e) {
      // TODO: More detailed error messages
      this.$emit('show-error-notification', 'Unable to send welcome email to user');
    }
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

  isCurrentUser(userId: string) {
    if (this.activeUser!.id === userId){
      return true;
    } else {
      return false;
    }
  }
    
  showNewUser() {
    this.newUserActive = true;
    this.$store.commit(DEACTIVATE_ALL_NOTIFICATIONS);
  }

}
  
</script>
