<template>
  <BaseSideBarLayout
    v-bind:title="title" 
    v-bind:username="username"
    v-on:logout="$emit('logout')"
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
        <router-link to="/program-management/locations" v-bind:class="{ 'is-active': programManagementActive }">
          Program Management
          <MoreVerticalIcon v-if="!programManagementActive" class="is-pulled-right"></MoreVerticalIcon>
          <MoreHorizontalIcon v-if="programManagementActive" class="is-pulled-right"></MoreHorizontalIcon>
        </router-link>
        <ul v-show="programManagementActive">
          <li><router-link to="/program-management/locations">Locations</router-link></li>
          <li><router-link to="/program-management/program-users">Users</router-link></li>
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
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import BaseSideBarLayout from '@/components/layouts/BaseSideBarLayout.vue';
  import { MoreVerticalIcon, MoreHorizontalIcon } from 'vue-feather-icons'

  @Component( {
    components: {BaseSideBarLayout, MoreVerticalIcon, MoreHorizontalIcon}
  })
  export default class UserSideBarLayout extends Vue {
    programManagementActive: boolean =  true;

    @Prop()
    username!: string;

    mounted() {
      this.setActiveLinkSubmenus();
    }
    updated() {
      this.setActiveLinkSubmenus();
    }

    get title(): string {
      return this.$store.state.program ? this.$store.state.program.name : 'Program Name';
    }

    setActiveLinkSubmenus() {
      var path: string = this.$route.path;
      this.programManagementActive = path.startsWith('/program-management');
    }
  
  }

</script>