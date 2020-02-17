<template>
  <div class="program-management">
    <h1 class="title">Program Management</h1>
    <p class="is-size-5 has-text-weight-bold"> Program Name Here </p>
    <section>
      <b-tabs type="is-boxed">
        <b-tab-item label="Locations">
          <section v-if="locations.length > 0">
            <table role="grid" aria-labelledby="userTableLabel" class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th>Location Name</th>
                  <th># Experiments</th>
                  <th>
                    <button class="button is-primary has-text-weight-bold is-pulled-right">
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
                    <button class="button is-pulled-right" title="Edit Location" v-on:click="location.toggleEdit()" v-if="!location.edit">
                      <span class="icon is-small">
                        <EditIcon size="1.5x" class="has-text-link" aria-hidden="true"></EditIcon>
                        <span class="is-sr-only">Edit Location</span>
                      </span>
                    </button>
                    <button class="button is-pulled-right"  title="Confirm Location" v-on:click="updateUser(index)" v-else>
                      <span class="icon is-small">
                        <CheckSquareIcon size="1.5x" class="has-text-success" aria-hidden="true"></CheckSquareIcon>
                        <span class="is-sr-only">Confirm Edits</span>
                      </span>
                    </button>
                    
                    <button class="button is-pulled-right" title="Delete Location" v-on:click="deleteUser(location.data.id)" v-if="!location.edit">
                      <span class="icon is-small">
                        <DeleteIcon size="1.5x" class="has-text-danger" aria-hidden="true"></DeleteIcon>
                        <span class="is-sr-only">Delete User</span>
                      </span>
                    </button>
                    <button class="button is-pulled-right" title="Cancel Edit" v-on:click="location.cancelEdit()" v-else>
                      <span class="icon is-small">
                        <XIcon size="1.5x" class="has-text-danger" aria-hidden="true"></XIcon>
                        <span class="is-sr-only">Cancel Edit</span>
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
          <p>Users</p>
        </b-tab-item>
        <b-tab-item label="Roles">
          <p>Roles</p>
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import SideBarMaster from '@/components/layouts/SideBarLayout.vue'
  import { PlusCircleIcon, EditIcon, DeleteIcon } from 'vue-feather-icons'
  import { TableRow } from '@/model/view_models/TableRow.ts'
  import { User } from '@/model/User.ts'
  import { Location } from '@/model/Location.ts'

  @Component({
    components: {SideBarMaster, PlusCircleIcon, EditIcon, DeleteIcon}
  })
  export default class ProgramManagement extends Vue {
    public locations: Array<Object> = [];

    mounted() {
      this.getLocations();
    }

    getLocations() {
      const data = new Location('1', 'Alternate greenhouse', '3');
      const editable = true;
      //this.locations.push(new TableRow(editable, data));
    }
  }
</script>