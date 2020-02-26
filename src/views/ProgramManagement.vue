<template>
  <div class="program-management">
    <h1 class="title">
      Program Management
    </h1>
    <p class="is-size-5 has-text-weight-bold">
      {{programName}}
    </p>
    <section>
      <b-tabs type="is-boxed">
        <b-tab-item label="Locations">
          <ProgramLocationsTable v-on:show-success-notification="showSuccessNotification"
                                 v-on:show-error-notification="showErrorNotification"
          >
          </ProgramLocationsTable>
        </b-tab-item>
        <b-tab-item label="Users">
          <ProgramUsersTable v-on:show-success-notification="showSuccessNotification"
                             v-on:show-error-notification="showErrorNotification"
          >
          </ProgramUsersTable>
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import SideBarMaster from '@/components/layouts/SideBarLayout.vue'
  import ProgramUsersTable from '@/components/program/ProgramUsersTable.vue';
  import ProgramLocationsTable from '@/components/program/ProgramLocationsTable.vue';

  @Component({
    components: {
      ProgramUsersTable, ProgramLocationsTable,
      SideBarMaster,
      }
  })
  export default class ProgramManagement extends Vue {

    // get this when endpoint is implmented
    private programName: string = "Program Name";

    mounted() {

    }

    showSuccessNotification(msg: string) {
      console.log('showSuccess');
      this.$emit('show-success-notification', msg);
    }

    showErrorNotification(msg: string) {
      console.log('showError');
      this.$emit('show-error-notification', msg);
    }

  }
</script>