<template>
  <div class="program-management">
    <h1 class="title">Program Management</h1>
    <p class="is-size-5 has-text-weight-bold"> Program Name Here </p>
    <section>
      <b-tabs type="is-boxed">
        <b-tab-item label="Locations">
          <section v-if="locations.length > 0">
            <table role="grid" aria-labelledby="locationTableLabel" class="table is-striped is-narrow is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th>
                    Location Name
                  </th>
                  <th># Experiments</th>
                  <th>
                    <button class="button is-primary has-text-weight-bold is-pulled-right" v-on:click="createLocation()">
                      <span class="icon is-small">
                        <PlusCircleIcon size="1.5x" aria-hidden="true"></PlusCircleIcon>
                      </span>
                      <span>
                        New Location
                      </span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-bind:key="location.data.id" v-for="(location, index) in locations">
                  <td>
                    {{ location.data.name }}
                  </td>
                  <td>
                    {{ location.data.experiments }}
                  </td>
                  <td>
                    <button class="button is-pulled-right" title="Delete Location" v-on:click="deleteUser(location.data.id)" v-if="!location.edit">
                      <span class="icon is-small">
                        <Trash2Icon size="1.5x" class="has-text-danger" aria-hidden="true"></Trash2Icon>
                        <span class="is-sr-only">Delete User</span>
                      </span>
                    </button>
                    <button class="button is-pulled-right" title="Cancel Edit" v-on:click="location.cancelEdit()" v-else>
                      <span class="icon is-small">
                        <XIcon size="1.5x" class="has-text-danger" aria-hidden="true"></XIcon>
                        <span class="is-sr-only">Cancel Edit</span>
                      </span>
                    </button>
                    <button class="button is-pulled-right" title="Edit Location" v-on:click="location.toggleEdit()" v-if="!location.edit">
                      <span class="icon is-small">
                        <EditIcon size="1.5x" class="has-text-link" aria-hidden="true"></EditIcon>
                        <span class="is-sr-only">Edit Location</span>
                      </span>
                    </button>
                    <button class="button is-pulled-right"  title="Confirm Location" v-on:click="updateLocation(index)" v-else>
                      <span class="icon is-small">
                        <CheckSquareIcon size="1.5x" class="has-text-success" aria-hidden="true"></CheckSquareIcon>
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
                <p class="has-text-weight-bold">No locations are currently defined for this program.</p>
                Locations are used in trials and experiments.<br>
                Any locations created when setting up trials and experiments will appear in this list automatically.<br>
                You can also add, edit, and delete locations from this panel.  
              </div>
              <div class="column">
                <button class="button is-primary has-text-weight-bold is-pulled-right">
                  <span class="icon is-small">
                    <PlusCircleIcon size="1.5x" aria-hidden="true"></PlusCircleIcon>
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
          <section class="new-form" v-if="new_user_active">
            <div class="columns">
              <div class="column is-two-fifths">
                <div class="field">
                  <label class="label">Name</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="New Name Here">
                  </div>
                  <p class="help">Full name as preferred. All Unicode special characters accepted.</p>
                </div>
              </div>
              <div class="column is-two-fifths">
                <div class="field">
                  <label class="label">Email</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="email@email.com">
                  </div>
                  <p class="help">New users will receive an email at this address to activate their account.</p>
                </div>
              </div>
              <div class="column is-one-fifth">
                <div class="field">
                  <label class="label">Role</label>
                  <div class="control is-expanded">
                    <div class="select is-fullwidth">
                      <select v-model="selected">
                        <option disabled value="">Select a role</option>
                        <option v-for="role in roles" v-bind:key="role.data.id">
                          {{ role.data.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-whole has-text-centered buttons">
                  <button class="button is-primary" v-on:click="saveUser()">
                    <span class="icon is-small">
                      <CheckCircleIcon size="1.5x" aria-hidden="true"></CheckCircleIcon>
                      <span class="is-sr-only">Confirm Edits</span>
                    </span>
                    <span>
                      Save
                    </span>
                  </button>
                  <button class="button" v-on:click="cancelNewUser()">Cancel</button>
              </div>
            </div>
          </section>
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
                <tr v-bind:key="user.data.id" v-for="(user, index) in users">
                  <td class="edit-table-row" v-if="user.edit">
                    <input type="text" class="input" v-model="user.editData.name" placeholder="User Name">
                  </td>
                  <td v-else>{{ user.data.name }}</td>
                  <td class="edit-table-row" v-if="user.edit">
                      <input type="text" class="input" v-model="user.editData.email" placeholder="User Email">
                  </td>
                  <td v-else>
                      {{ user.data.email }}
                  </td>
                  <td class="edit-table-row" v-if="user.edit">
                      <input type="text" class="input" v-model="user.editData.roles" placeholder="Roles">
                  </td>
                  <td v-else>
                      {{ user.data.roles[0] }}
                  </td>
                  <td>
                    <button class="button is-pulled-right" title="Delete Location" v-on:click="deleteUser(user.data.id)" v-if="!user.edit">
                      <span class="icon is-small">
                        <Trash2Icon size="1.5x" class="has-text-danger" aria-hidden="true"></Trash2Icon>
                        <span class="is-sr-only">Delete User</span>
                      </span>
                    </button>
                    <button class="button is-pulled-right" title="Cancel Edit" v-on:click="user.cancelEdit()" v-else>
                      <span class="icon is-small is-light">
                        <XSquareIcon size="1.5x" aria-hidden="true"></XSquareIcon>
                        <span class="is-sr-only">Cancel Edit</span>
                      </span>
                      <span>
                        Cancel
                      </span>
                    </button>
                    <button class="button is-pulled-right" title="Edit Location" v-on:click="user.toggleEdit()" v-if="!user.edit">
                      <span class="icon is-small">
                        <EditIcon size="1.5x" class="has-text-link" aria-hidden="true"></EditIcon>
                        <span class="is-sr-only">Edit Location</span>
                      </span>
                    </button>
                    <button class="button is-pulled-right is-primary"  title="Confirm Location" v-on:click="updateUser(index)" v-else>
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
  import SideBarMaster from '@/components/layouts/SideBarLayout.vue'
  import { PlusCircleIcon, EditIcon, Trash2Icon, ArrowDownIcon, ArrowUpIcon, CheckCircleIcon, XSquareIcon } from 'vue-feather-icons'
  import { TableRow } from '@/model/view_models/TableRow.ts'
  import { User } from '@/model/User.ts'
  import { Location } from '@/model/Location.ts'
  import { Role } from '@/model/Role.ts'

  @Component({
    components: {SideBarMaster, PlusCircleIcon, EditIcon, Trash2Icon, ArrowDownIcon, ArrowUpIcon, CheckCircleIcon, XSquareIcon }
  })
  export default class ProgramManagement extends Vue {
    public locations: Array<Object> = [];
    public users: Array<Object> = [];
    public roles: Array<Object> = [];

    public new_user_active: boolean = false;

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
      
    }

    cancelNewUser() {
      this.new_user_active = false;
    }


    updateLocation() {
    }

  }
</script>