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
    <header>
      <div class="level header-title is-marginless is-mobile">
        <div class="level-left">
          <div class="level-item is-hidden-touch">
            <a href="/">
              <!-- 232 -->
              <img
                  src="../../assets/img/bi-logo.svg"
                  alt="Breeding Insight home"
                  width="160"
              >
            </a>
          </div>
          <div class="level-item is-hidden-desktop is-pulled-left">
            <a role="button"
               class="navbar-hamburger has-text-dark"
               aria-label="Open Navigation Menu"
               aria-expanded="false"
               @click="toggleSidebar()"
            >
              <MenuIcon></MenuIcon>
            </a>
          </div>
          <div class="level-item is-hidden-desktop">
            <a href="/">
              <img
                  src="../../assets/img/bi-logo.svg"
                  alt="Breeding Insight home"
                  width="175"
              >
            </a>
          </div>
          <div v-if="sandboxConfig !== ''" class="level-item">
            <div v-bind:class="{'notification is-warning px-5 has-text-centered': sandboxConfig === SandboxMode.Public,
                                'notification is-info px-5 has-text-centered': sandboxConfig === SandboxMode.Coordinator}">
              <p class="title is-size-4">Sandbox</p>
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
          <b-dropdown v-if="username !== undefined"
              position="is-bottom-left"
              append-to-body
              aria-role="menu">
            <template #trigger>
              <button
                  class="button is-small is-primary has-text-weight-bold level-item"
              >
                <span class="icon is-small mr-0">
                  <UserIcon
                      size="1.5x"
                      aria-hidden="true"
                  />
                </span>
                    <span class="icon is-small ml-0">
                  <ChevronDownIcon
                      size="1.5x"
                      aria-hidden="true"
                  />
                </span>
              </button>
            </template>
            <b-dropdown-item custom aria-role="menuitem">
              Logged in as <strong>{{username}}</strong>
            </b-dropdown-item>
            <hr class="dropdown-divider">
            <b-dropdown-item value="logout" aria-role="menuitem">
              <b-icon icon="log-out"></b-icon>
              Logout
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </header>

    <div class="columns is-marginless">
      <div
          class="column side-menu is-one-fifth menu-test"
          :class="{ 'is-hidden-touch': !showSidebarMobile }"
      >
        <aside id="sideMenu" class="menu mb-5 menu-test">
          <slot name="menu"></slot>
        </aside>
        <div id="versionInfo" class="is-size-7 is-justify-content-center is-align-content-center is-flex">
          <span class="is-centered">
            <VersionInfo />
          </span>
        </div>
      </div>

      <div class="column">
        <main>
        <!--
          <div v-if="username !== undefined" class="level is-mobile">
            <div class="level-left"></div>
            <div class="level-right">
              <div class="level-item">
                <p class="mb-0">Logged in as <strong>{{username}}</strong></p>
              </div>
              <div class="level-item">
                <button class="button is-outlined is-primary" :id="logoutId" @click="$emit('logout')">Log out</button>
              </div>
            </div>
          </div>
          -->
          <section class="section pt-0">
            <slot name="content"></slot>
          </section>

        </main>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { MenuIcon, UserIcon, ChevronDownIcon } from 'vue-feather-icons';
import { SandboxMode } from '@/util/config';
import VersionInfo from '@/components/layouts/VersionInfo.vue';
import Footer from "@/components/layouts/Footer.vue";
import store from "@/store";
import {SHOW_SIDEBAR_MOBILE} from "@/store/mutation-types";
import {mapGetters} from "vuex";

@Component( {
    components: { VersionInfo, MenuIcon, UserIcon, ChevronDownIcon, Footer},
    computed: {
      ...mapGetters([
        'showSidebarMobile',
      ])
    }
  })
  export default class SideBarMaster extends Vue {
    showSidebarMobile?: boolean;
    SandboxMode = SandboxMode;

    private logoutId: string = "basesidebarlayout-logout-button";

    @Prop()
    username!: string;

    @Watch('$route')
    onUrlChange() {
      store.commit(SHOW_SIDEBAR_MOBILE, false);
    }

    toggleSidebar() {
      store.commit(SHOW_SIDEBAR_MOBILE, !this.showSidebarMobile);
    }

    get sandboxConfig() {
      return process.env.VUE_APP_SANDBOX;
    }
  }

</script>
