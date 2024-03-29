<!--
  - See the NOTICE file distributed with this work for additional information
  - regarding copyright ownership.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <div class="sidebarlayout">

    <header class="main-header">
      <div class="level header-title is-marginless">
        <div class="level-left">
          <div class="level-item is-pulled-left">
            <a role="button"
               class="navbar-hamburger has-text-dark"
               aria-label="Open Navigation Menu"
               aria-expanded="false"
               @click="toggleSidebar()"
            >
              <MenuIcon v-if="showMenuToggle"></MenuIcon>
            </a>
          </div>
          <div class="level-item">
            <a href="/">
              <img
                  src="../../assets/img/bi-logo.svg"
                  alt="DeltaBreed home"
                  width="160"
              >
            </a>
          </div>
          <div v-if="sandboxConfig !== ''" class="level-item">
            <div id="sandbox-feedback" v-bind:class="{'notification is-warning px-5 has-text-centered': sandboxConfig === SandboxMode.Public,
                                'notification is-info px-5 has-text-centered': sandboxConfig === SandboxMode.Coordinator}">
              <p class="title is-size-5">Sandbox </p>
              <p>
              <a href="#" v-on:click="$showCollectorDialog()" v-bind:class="{'has-text-link': sandboxConfig === SandboxMode.Public,
                                                                               'has-text-white': sandboxConfig === SandboxMode.Coordinator}">Feedback
              </a>
              </p>
            </div>
          </div>
        </div>
        <div class="level-right program-selection-level">
          <div class="level-item">
            <slot name="title"></slot>
          </div>
          <div class="level-item">
            <UserStatusMenu v-bind:username="username" v-on:logout="$emit('logout')"/>
          </div>
        </div>
      </div>
    </header>
    <div class="columns is-marginless">
      <div class="column is-narrow p-0" :class="{ 'is-hidden': !showMenu || !showSidebarMobile }">
        <div class="is-300px">
          <div id="sideMenu" class="menu mb-0 menu-test sidebar side-menu">
            <slot name="menu"></slot>
            <div id="versionInfo" class="is-size-7 is-justify-content-center is-align-content-center is-flex">
              <span class="is-centered">
                <VersionInfo />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="column no-overflow-x">
        <div>
          <main id="main">
            <section class="section p-5">
              <slot name="content"></slot>
            </section>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { MenuIcon } from 'vue-feather-icons';
import { SandboxMode } from '@/util/config';
import VersionInfo from '@/components/layouts/VersionInfo.vue';
import store from "@/store";
import {SHOW_SIDEBAR_MOBILE} from "@/store/mutation-types";
import {mapGetters} from "vuex";
import UserStatusMenu from "@/components/layouts/menus/UserStatusMenu.vue";

@Component( {
    components: {UserStatusMenu, VersionInfo, MenuIcon},
    computed: {
      ...mapGetters([
        'showSidebarMobile',
      ])
    }
  })
  export default class SideBarMaster extends Vue {
    showSidebarMobile?: boolean;
    SandboxMode = SandboxMode;

    @Prop()
    username!: string;

    @Prop({default: true})
    showMenuToggle?: boolean;

    @Prop({default: true})
    showMenu?: boolean;

    toggleSidebar() {
      store.commit(SHOW_SIDEBAR_MOBILE, !this.showSidebarMobile);
    }

    get sandboxConfig() {
      return process.env.VUE_APP_SANDBOX;
    }
  }

</script>
