<template>
  <div class="sidebarlayout">
    <header>
      <div class="level header-title is-marginless is-mobile">
        <div class="level-left">
          <div class="level-item is-hidden-touch">
            <a href="/">
              <img
                  src="../../assets/img/bi-logo.svg"
                  alt="Breeding Insight home"
                  width="232"
              >
            </a>
          </div>
          <div class="level-item is-hidden-desktop is-pulled-left">
            <a role="button"
               class="navbar-hamburger has-text-black"
               aria-label="menu"
               aria-expanded="false"
               @click="sideMenuShownMobile = !sideMenuShownMobile"
            >
              <MenuIcon></MenuIcon>
            </a>
          </div>
        </div>
        <div class="level-right">
          <h1 class="title has-text-primary">Program Name</h1>
        </div>
      </div>
    </header>

    <div class="columns is-marginless">
      <div
          class="column side-menu is-one-quarter"
          :class="{ 'is-hidden-touch': !sideMenuShownMobile }"
      >
        <nav role="navigation" aria-label="main navigation">
          <aside id="sideMenu" class="menu">
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
                  <li><router-link to="/program-management">Locations</router-link></li>
                  <li><a>Users</a></li>
                </ul>
              </li>
            </ul>
          </aside>
        </nav>
      </div>


      <div class="column">
        <main>
          <div class="level is-mobile">
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
        </main>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator'
  import { MoreVerticalIcon, MoreHorizontalIcon, MenuIcon } from 'vue-feather-icons'


  @Component( {
    components: {MoreVerticalIcon, MoreHorizontalIcon, MenuIcon}
  })
  export default class SideBarMaster extends Vue {
    programManagementActive: boolean =  true;
    sideMenuShownMobile: boolean = false;

    @Prop()
    username!: string;

    @Watch('$route')
    onUrlChange(){
      this.sideMenuShownMobile = false;
    }
  }

</script>

<style>

</style>