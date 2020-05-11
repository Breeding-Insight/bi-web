<template>
  <div id="program-location-management">
    <ProgramLocationsTable
      v-on:show-success-notification="$emit('show-success-notification', $event)"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
    </ProgramLocationsTable>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import ProgramLocationsTable from "@/components/program/ProgramLocationsTable.vue"
  import ProgramsBase from "@/components/program/ProgramsBase.vue";

  @Component({
    components: {
      ProgramLocationsTable
    }
  })
  export default class ProgramLocationManagement extends ProgramsBase {

  }
</script>