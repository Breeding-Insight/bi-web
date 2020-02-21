<template>
  <div class="program-management">
    <WarningModal
      v-on:submit="modalDeleteHandler()" 
      v-on:cancel="modalCancelHandler()" 
      v-bind:active="deactivateActive"
      v-bind:msg-title="deactivateWarningTitle"
    >
      <section>
        <p class="has-text-black">
        {{deactivateWarningBody}}
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button v-on:click="modalDeleteHandler()" class="button is-danger"><strong>Yes, remove</strong></button>
          <button v-on:click="modalCancelHandler()" class="button">Cancel</button>
        </div>
      </div>              
    </WarningModal>
    <h1 class="title">
      Program Management
    </h1>
    <p class="is-size-5 has-text-weight-bold">
      Program Name Here
    </p>
    <section>
      <b-tabs type="is-boxed">
        <b-tab-item label="Locations">
          <section v-if="locations.length > 0">
            <table
              role="grid"
              aria-labelledby="locationTableLabel"
              class="table is-striped is-narrow is-hoverable is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    Location Name
                  </th>
                  <th># Experiments</th>
                  <th>
                    <button
                      class="button is-primary has-text-weight-bold is-pulled-right"
                      @click="createLocation()"
                    >
                      <span class="icon is-small">
                        <PlusCircleIcon
                          size="1.5x"
                          aria-hidden="true"
                        />
                      </span>
                      <span>
                        New Location
                      </span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(location, index) in locations"
                  :key="location.data.id"
                >
                  <td>
                    {{ location.data.name }}
                  </td>
                  <td>
                    {{ location.data.experiments }}
                  </td>
                  <td>
                    <button
                      v-if="!location.edit"
                      class="button is-pulled-right"
                      title="Delete Location"
                      @:click="deleteUser(location.data.id)"
                    >
                      <span class="icon is-small">
                        <Trash2Icon
                          size="1.5x"
                          class="has-text-danger"
                          aria-hidden="true"
                        />
                        <span class="is-sr-only">
                          Delete User
                        </span>
                      </span>
                    </button>
                    <button
                      v-else
                      class="button is-pulled-right"
                      title="Cancel Edit"
                      @click="location.cancelEdit()"
                    >
                      <span class="icon is-small">
                        <XIcon
                          size="1.5x"
                          class="has-text-danger"
                          aria-hidden="true"
                        />
                        <span class="is-sr-only">
                          Cancel Edit
                        </span>
                      </span>
                    </button>
                    <button
                      v-if="!location.edit"
                      class="button is-pulled-right"
                      title="Edit Location"
                      @click="location.toggleEdit()"
                    >
                      <span class="icon is-small">
                        <EditIcon
                          size="1.5x"
                          class="has-text-link"
                          aria-hidden="true"
                        />
                        <span class="is-sr-only">
                          Edit Location
                        </span>
                      </span>
                    </button>
                    <button
                      v-else
                      class="button is-pulled-right"
                      title="Confirm Location"
                      @click="updateLocation(index)"
                    >
                      <span class="icon is-small">
                        <CheckSquareIcon
                          size="1.5x"
                          class="has-text-success"
                          aria-hidden="true"
                        />
                        <span class="is-sr-only">Confirm Edits</span>
                      </span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
          <section v-else>
            <div class="columns">
              <div class="column is-10">
                <p class="has-text-weight-bold">
                  No locations are currently defined for this program.
                </p>
                Locations are used in trials and experiments.<br>
                Any locations created when setting up trials and experiments will appear in this list automatically.<br>
                You can also add, edit, and delete locations from this panel.  
              </div>
              <div class="column">
                <button class="button is-primary has-text-weight-bold is-pulled-right">
                  <span class="icon is-small">
                    <PlusCircleIcon
                      size="1.5x"
                      aria-hidden="true"
                    />
                  </span>
                  <span>
                    New Location
                  </span>
                </button>
              </div>
            </div>
            <hr>
          </section>
        </b-tab-item>
        <b-tab-item label="Users">
          <NewDataRowForm
            v-if="new_user_active"
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

          <section>
            <table role="grid" aria-labelledby="userTableLabel" class="table is-striped is-narrow is-hoverable is-fullwidth">
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
                    <button class="button is-primary has-text-weight-bold is-pulled-right" v-on:click="createUser()" v-if="!new_user_active">
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

        </b-tab-item>
        <b-tab-item label="Roles">
          <a href="google.com">Test</a>
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import {Validations} from 'vuelidate-property-decorators';
  import {required, email} from 'vuelidate/lib/validators'
  import SideBarMaster from '@/components/layouts/SideBarLayout.vue'
  import { PlusCircleIcon, EditIcon, Trash2Icon, ArrowDownIcon, ArrowUpIcon, CheckCircleIcon, XSquareIcon } from 'vue-feather-icons'
  import { TableRow } from '@/model/view_models/TableRow.ts'
  import { User } from '@/model/User.ts'
  import { Location } from '@/model/Location.ts'
  import { Role } from '@/model/Role.ts'
  import WarningModal from "@/components/modals/WarningModal.vue"
  import {ProgramUser} from "@/model/ProgramUser"
  import {validationMixin} from "vuelidate";
  import InputError from "@/components/forms/InputError.vue";
  import InputField from "@/components/forms/InputField.vue";
  import NewDataRowForm from "@/components/forms/NewDataRowForm.vue";

  @Component({
    mixins: [validationMixin],
    components: {
      NewDataRowForm,
      InputError, InputField,
      SideBarMaster, PlusCircleIcon, EditIcon, Trash2Icon, ArrowDownIcon, ArrowUpIcon, CheckCircleIcon, XSquareIcon, WarningModal}
  })
  export default class ProgramManagement extends Vue {
    public locations: Array<Object> = [];
    public users: Array<Object> = [];
    public roles: Array<Object> = [];
    public newUser: ProgramUser = new ProgramUser();
    public saveEndpoint: string = `${process.env.VUE_APP_BI_API_V1_PATH}/programs`;

    @Validations()
    validations = {
      newUser : {
        name: {required},
        email: {required, email},
        role: {}
      }
    }

    public new_user_active: boolean = false;
    public deactivateActive: boolean = false;
    public deactivateWarningTitle: string = "Remove user's access to Program name?";
    public deactivateWarningBody: string = "Program-related data collected by this user will not be affected by this change.";
    public programName: string = "Program Name";

    mounted() {
      this.getLocations();
      this.getUsers();
      this.getRoles();
    }

    getLocations() {
      this.locations.push(new TableRow(true, new Location('1', 'Alternate greenhouse', '3')));
      this.locations.push(new TableRow(true, new Location('2', 'Better labeling for locations', '10')));
      this.locations.push(new TableRow(true, new Location('3', 'capitalization', '3')));
    }

    getUsers() {
      this.users.push(new TableRow(true, new User('1', 'Ann Other Budy', 'Ann.otherbudy@usda.gov', ['Field Manager'])));
      this.users.push(new TableRow(true, new User('2', 'Ima Fyne Breeder', 'ima.breeder@usda.gov', ['Breeder'])));
      this.users.push(new TableRow(true, new User('3', 'Somme Bodie', 'somme.bodie@usda.gov', ['Field Worker'])));
    }

    getRoles() {
      this.roles.push(new TableRow(true, new Role('1', 'Breeder')));
      this.roles.push(new TableRow(true, new Role('2', 'Field Manager')));
      this.roles.push(new TableRow(true, new Role('3', 'Field Worker')));
    }

    createLocation() {
    }

    createUser() {
      this.new_user_active = true;
    }

    saveUser() {
      console.log("save user");

      this.$v.$touch();
      if (this.$v.$anyError){
        return;
      }
      else {
        // Check all of our fields to see if they were required
        this.newUser = new ProgramUser();
        this.$v.$reset();
      }

    }

    cancelNewUser() {
      console.log('canceling edit');
      this.newUser = new ProgramUser();
      this.$v.$reset();
      this.new_user_active = false;
    }

    updateLocation() {
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