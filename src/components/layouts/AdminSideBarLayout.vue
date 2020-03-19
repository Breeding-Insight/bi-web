<template>
  <BaseSideBarLayout
    :title="'System Administration'"
    :username="username"
    v-on:logout="logout"
  >
  <template v-slot:menu>
    <p class="menu-label">
      Admin
    </p>
    <ul class="menu-list">
      <li><router-link to="/admin">Programs</router-link></li>
      <li><router-link to="/admin-user-management">Users</router-link></li>
    </ul>
  </template>
  <template v-slot:content>
    <slot></slot>
  </template>
  </BaseSideBarLayout>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import BaseSideBarLayout from '@/components/layouts/BaseSideBarLayout.vue';

  @Component( {
    components: {BaseSideBarLayout}
  })
  export default class AdminSideBarLayout extends Vue {

    @Prop()
    username!: string;

    logout() {
      this.$emit('logout');
    }
  
  }

</script>