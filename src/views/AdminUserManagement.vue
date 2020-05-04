<template>
  <div class="admin-user-management">
    <h1 class="title">
      Users
    </h1>
    <AdminUsersTable v-on:show-success-notification="showSuccessNotification"
                     v-on:show-error-notification="showErrorNotification"
    >
    </AdminUsersTable>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import AdminUsersTable from '@/components/admin/AdminUsersTable.vue'

  @Component({
    components: {AdminUsersTable}
  })
  export default class AdminUserManagement extends Vue {

    // get this when endpoint is implemented
    private programName: string = "Program Name";

    mounted() {

    }

    showSuccessNotification(msg: string) {
      this.$emit('show-success-notification', msg);
    }

    showErrorNotification(msg: string) {
      this.$emit('show-error-notification', msg);
    }


  }
</script>