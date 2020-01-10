<template>
    <div class="usermanagement">
        <div class="container is-fluid">
            <section class="section">
                <h1 class="title">User Management</h1>

                <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Roles</th>
                            <th>Manage User</th>
                        </tr>
                    </thead>
                    <tbody v-bind:key="user.email" v-for="user of users">
                        <tr class="is-vcentered">
                            <td>{{ user.name }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ user.roles }}</td>
                            <td>
                                <b-button class="is-primary">Edit</b-button>
                                <b-button class="is-danger">Delete</b-button>
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

  @Component
  export default class UserManagement extends Vue {

      public users: Array<Object> = [{'name': 'Chris', 'email': 'ct447@cornell.edu', roles: 'Admin'}];


  }
</script>