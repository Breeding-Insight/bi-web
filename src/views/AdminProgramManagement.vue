<template>
  <div class="admin-program-management">
    <h1 class="title">
      Programs
    </h1>
    <AdminProgramsTable v-on:show-success-notification="showSuccessNotification"
                        v-on:show-error-notification="showErrorNotification"
    >
    </AdminProgramsTable>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import AdminProgramsTable from '@/components/admin/AdminProgramsTable.vue'

  @Component({
    components: {AdminProgramsTable}
  })
  export default class AdminProgramManagement extends Vue {

    // get this when endpoint is implemented
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