<template>
    <div class="usermanagement">
        <div class="container is-fluid">
            <section class="section">
                <div class="level is-large content">
                    <h1 class="content is-large">User Management</h1>
                </div>
                <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Roles</th>
                        </tr>
                    </thead>
                    <tbody>
                        

                    </tbody>
                </table>
            </section>
        </div>
    </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class UserManagement extends Vue {
  }
</script>