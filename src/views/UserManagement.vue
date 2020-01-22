<template>
    <div class="usermanagement">
        <div class="container is-fluid">
            <section class="section">
                <h1 id="userTableLabel" class="title">User Management</h1>
                <table role="grid" aria-labelledby="userTableLabel" class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Roles</th>
                            <th>Manage User</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input title="New User Name" class="input" type="text" v-model="newUserInputs.name">
                            </td>
                            <td>
                                <input title="New User Email" class="input" type="email" v-model="newUserInputs.email">
                            </td>
                            <td></td>
                            <td class="is-centered">
                                <button class="button is-primary" v-on:click="addUser" id="addUserBtn">Create User</button>
                            </td>
                        </tr>
                        <tr v-bind:key="user.data.id" v-for="(user, index) in users">
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
                                {{ user.data.roles }}
                            </td>
                            <td>
                                <button class="button" title="Edit User" v-on:click="user.toggleEdit()" v-if="!user.edit">
                                    <span class="icon is-small">
                                        <EditIcon size="1.5x" class="has-text-primary" aria-hidden="true"></EditIcon>
                                        <span class="is-sr-only">Edit User</span>
                                    </span>
                                </button>
                                <button class="button"  title="Confirm User" v-on:click="updateUser(index)" v-else>
                                    <span class="icon is-small">
                                        <CheckSquareIcon size="1.5x" class="has-text-success" aria-hidden="true"></CheckSquareIcon>
                                        <span class="is-sr-only">Confirm Edits</span>
                                    </span>
                                </button>
                                
                                <button class="button" title="Delete User" v-on:click="deleteUser(user.data.id)" v-if="!user.edit">
                                    <span class="icon is-small">
                                        <DeleteIcon size="1.5x" class="has-text-danger" aria-hidden="true"></DeleteIcon>
                                        <span class="is-sr-only">Delete User</span>
                                    </span>
                                </button>
                                <button class="button" title="Cancel Edit" v-on:click="user.cancelEdit()" v-else>
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
        </div>
    </div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import * as api from '@/util/api'
import { BiResponse } from '@/model/BiResponse'
import SuccessNotification from "@/components/notifications/SuccessNotification.vue"
import { TableRow } from '@/model/view_models/TableRow.ts'
import { User } from '@/model/User.ts'
import { EditIcon, DeleteIcon, CheckSquareIcon, XIcon } from 'vue-feather-icons'


  @Component({
      components: {SuccessNotification, EditIcon, DeleteIcon, CheckSquareIcon, XIcon}
  })
  export default class UserManagement extends Vue {
    public users: Array<Object> = [];
    public newUserInputs = {
        name: null,
        email: null
    }

    mounted() {
        this.getUsers();
    }

    getUsers() {

        api.call({ url: `${process.env.VUE_APP_BI_API_ROOT}/bi/v1/users`, method: 'get' })
        .then((response: any) => {
            const biResponse = new BiResponse(response.data);

            // Parse our users into the vue users param
            this.users = biResponse.result.data.map((user: any) => {
                const data = new User(user.id, user.name, user.email, user.roles);
                const editable = true;
                return new TableRow(editable, data);
            });
        })
        .catch((error) => {
            // Display error that users cannot be loaded
            this.$emit('show-error-notification', 'Error while trying to load users');
            throw error;
        })

    }

    deleteUser(selectedId: Number) {

        api.call({ url: `${process.env.VUE_APP_BI_API_ROOT}/bi/v1/users/${selectedId}`, method: 'delete'})
        .then((response) => {
            // Reload users
            this.getUsers();
            // Show notification
            this.$emit('show-success-notification', 'User successfully deleted');

        }).catch((error) => {
            // Display error
            this.$emit('show-error-notification', 'Unable to delete user');
            throw error;
        })

    }

    addUser() {

        // Check that our inputs are good
        if (this.newUserInputs.name == null){
            // TODO: Outline input

            // Show error
            this.$emit('show-error-notification', 'Please enter user name');
            return
        } 
        else if (this.newUserInputs.email == null){
            // TODO: Outline input

            // Show error
            this.$emit('show-error-notification', 'Please enter user email');
            return
        }

        // Construct request body
        const body = {'name': this.newUserInputs.name, 'email': this.newUserInputs.email};

        // Make api request
        api.call({ url: `${process.env.VUE_APP_BI_API_ROOT}/bi/v1/users`, method: 'post', data: body})
            .then((response) => {
                // Reload users
                this.getUsers();
                // Show success notification
                this.$emit('show-success-notification', 'User successfully created');

            }).catch((error) => {
                // Look for email conflict and display error
                if (error.response.status == 409) {
                    this.$emit('show-error-notification', 'A user with that email already exists');
                }
                else {
                    // Something else went wrong
                    this.$emit('show-error-notification', 'Unable to create user');
                }
                throw error;
            });
        
    }

    updateUser(rowIndex: number, userId: string) {

        // Get our user 
        const editRow: TableRow<User> = this.users[rowIndex] as TableRow<User>;

        // Confirm our changes in our data model
        editRow.confirmChanges();

        // Construct body
        const user: User = editRow.data;
        const body = {'name': user.name, 'email': user.email};

        api.call({ url: `${process.env.VUE_APP_BI_API_ROOT}/bi/v1/users/${editRow.data.id}`, method: 'put', data: body})
            .then((response) => {
                // Reload users
                this.getUsers();
                // Show success notification
                this.$emit('show-success-notification', 'User successfully updated');
            }).catch((error) => {
                // Display error
                this.$emit('show-error-notification', 'Unable to update user');
                throw error;
            });
    }

  }

  
</script>