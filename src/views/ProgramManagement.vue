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
          <ProgramLocationsTable/>
        </b-tab-item>
        <b-tab-item label="Users">
          <ProgramUsersTable/>
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import SideBarMaster from '@/components/layouts/SideBarLayout.vue'
  import ProgramUsersTable from "@/components/tables/ProgramUsersTable.vue";
  import ProgramLocationsTable from "@/components/tables/ProgramLocationsTable.vue";

  @Component({
    components: {
      ProgramUsersTable, ProgramLocationsTable,
      SideBarMaster}
  })
  export default class ProgramManagement extends Vue {
    
    private saveEndpoint: string = `${process.env.VUE_APP_BI_API_V1_PATH}/programs`;
    // get this when endpoint is implmented
    private programName: string = "Program Name";

    mounted() {

    }



  }
</script>