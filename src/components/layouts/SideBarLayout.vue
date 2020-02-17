<template>
  <div>
    <div class="level header-title is-marginless">
      <div class="level-left">
        <div class="level-item">
          <a href="/">
            <img
                src="../../assets/img/bi-logo.svg"
                alt="Breeding Insight home"
                width="232"
            >
          </a>
        </div>
      </div>
      <div class="level-right">
        <h1 class="title has-text-primary">Program Name Here</h1>
      </div>
    </div>

    <div class="columns is-marginless">
      <aside class="menu side-menu column is-one-fifth">
        <ul class="menu-list">
          <li><router-link to="/userhome">Home</router-link></li>
          <li><router-link to="/usermanagement">Manage Users</router-link></li>
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
              <li><a>Locations</a></li>
              <li><a>Users</a></li>
              <li><a>Roles</a></li>
              <li><a>Permissions</a></li>
            </ul>
          </li>
        </ul>
      </aside>
      <div class="column">
        <div class="level">
          <div class="level-left"></div>
          <div class="level-right">
            <div class="level-item">
              <p>Logged in as <b>{{username}}</b></p>
            </div>
            <div class="level-item">
              <button class="button is-outlined is-primary" @click="$emit('logout')">Log out</button>
            </div>
          </div>
        </div>
        <section class="section">
          <slot></slot>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import { MoreVerticalIcon, MoreHorizontalIcon } from 'vue-feather-icons'


  @Component( {
    components: {MoreVerticalIcon, MoreHorizontalIcon}
  })
  export default class SideBarMaster extends Vue {
    programManagementActive: boolean =  true;
    @Prop()
    username!: string;
  }

</script>

<style>

</style>