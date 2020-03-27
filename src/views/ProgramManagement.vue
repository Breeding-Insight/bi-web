<template>
  <div class="program-management">
    <h1 class="title">
      Program Management
    </h1>
    <p class="is-size-5 has-text-weight-bold">
      {{programName}}
    </p>

    <section>
      <nav class="tabs is-boxed">
        <ul>
          <router-link to="/program-management/locations" tag="li" active-class="is-active">
            <a>Locations</a>
          </router-link>
          <router-link to="/program-management/program-users" tag="li" active-class="is-active">
            <a>Users</a>
          </router-link>
        </ul>
      </nav>
    </section>

    <div class="tab-content">
      <router-view
        @show-success-notification="$emit('show-success-notification', $event)"
        @show-info-notification="$emit('show-info-notification', $event)"
        @show-error-notification="$emit('show-error-notification', $event)"
      ></router-view>
    </div>

  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import ProgramUsersTable from '@/components/program/ProgramUsersTable.vue';
  import ProgramLocationsTable from '@/components/program/ProgramLocationsTable.vue';

  @Component({
    components: {
      ProgramUsersTable, ProgramLocationsTable
      }
  })
  export default class ProgramManagement extends Vue {

    // get this when endpoint is implmented
    private programName: string = "Program Name";

  }
</script>