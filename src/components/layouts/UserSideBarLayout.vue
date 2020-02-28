<template>
  <BaseSideBarLayout
    :title="'Program Name'" 
    :username="username"
    v-on:logout="logout"
  >
  <template v-slot:menu>
    <ul class="menu-list">
      <li><router-link to="/home">Home</router-link></li>
      <li><a>Trials and Experiments</a></li>
      <li><a>Germplasm Inventory</a></li>
      <li><a>Ontology Management</a></li>
      <li><a>Labels</a></li>
      <li><a>Reports</a></li>
      <li>
        <a
            v-bind:class="{ 'is-active': programManagementActive }"
            @click="programManagementActive = !programManagementActive"
        >
          Program Management
          <MoreVerticalIcon v-if="!programManagementActive" class="is-pulled-right"></MoreVerticalIcon>
          <MoreHorizontalIcon v-if="programManagementActive" class="is-pulled-right"></MoreHorizontalIcon>
        </a>
        <ul v-show="programManagementActive">
          <li><router-link to="/program-management">Locations</router-link></li>
          <li><a>Users</a></li>
        </ul>
      </li>
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
    programManagementActive: boolean =  true;

    @Prop()
    username!: string;

    logout() {
      this.$emit('logout');
    }
  
  }

</script>