<template>
  <ProgramUsersTable
    v-on:show-success-notification="$emit('show-success-notification', $event)"
    v-on:show-error-notification="$emit('show-error-notification', $event)"
  >
  </ProgramUsersTable>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import ProgramUsersTable from "../components/program/ProgramUsersTable.vue";

  @Component({
    components: {
      ProgramUsersTable
    }
  })
  export default class ProgramUserManagement extends Vue {

  }
</script>