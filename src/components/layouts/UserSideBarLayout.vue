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
  <BaseSideBarLayout
    v-bind:username="username"
    v-on:logout="$emit('logout')"
  >
    <template v-slot:title class="level">
      <h1 class="title has-text-primary level-item">{{title}}</h1>
      <div
        class="dropdown is-right level-item"
        v-bind:class="{'is-active': programSelectActive}"
        v-if="programs.length > 1"
      >
        <div class="dropdown-trigger">
          <button
            v-on:click.stop="programSelectActive = !programSelectActive"
            class="button is-small"
            v-bind:aria-expanded="programSelectActive.toString()"
            aria-haspopup="true"
            aria-controls="program-menu"
          >
            <span class="icon is-small">
              <span class="is-sr-only">Show Program Menu</span>
              <ChevronDownIcon></ChevronDownIcon>
            </span>
          </button>
        </div>
        <div
          class="dropdown-menu"
          id="program-menu"
          role="menu"
          v-click-outside="hideProgramSelect"
        >
          <div
            class="dropdown-content"
          >
            <template v-for="program of programs">
              <router-link
                v-if="activeProgram === undefined || program.id !== activeProgram.id"
                v-bind:key="`programNav${program.id}`"
                v-bind:to="{name: 'program', params: {programId: program.id}}"
                v-on:click.native="programSelectActive = false"
                class="dropdown-item"
                active-class="is-active"
                role="menuitem"
              >
                {{program.name}}
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:menu>
      <nav role="navigation" aria-label="main navigation">
        <template v-if="$ability.can('access', 'AdminSection')">

          <p class="menu-label">
            Admin
          </p>
          <ul class="menu-list">
            <li>
              <router-link to="/admin/user-management" :id="usersMenuId">
                Users
              </router-link>
            </li>
            <li>
              <router-link to="/admin/program-management" :id="programsMenuId">
                Programs
              </router-link>
              <ul class="menu-list">
                <template v-for="program of programs">
                  <li v-bind:key="program.id">
                    <router-link v-bind:to="{name: 'program', params: {programId: program.id}}">
                      {{program.name}}
                    </router-link>
                  </li>
                </template>
              </ul>
            </li>
          </ul>
          <template v-if="activeProgram">
            <hr style="margin:5px;">
            <p class="menu-label">
              {{activeProgram.name}}
            </p>
          </template>
        </template>
        <template v-if="activeProgram">
          <ul class="menu-list">
            <li>
              <router-link v-bind:to="{name: 'program-home', params: {programId: activeProgram.id}}" :id="homeMenuId">
                Home
              </router-link>
            </li>
            <li>
              <router-link
                  v-bind:to="{name: 'trials-studies', params: {programId: activeProgram.id}}"
                  v-bind:class="{ 'is-active': trialsAndStudiesActive }"
              >
                Trials and Studies
                <MoreVerticalIcon
                    v-if="!trialsAndStudiesActive"
                    class="is-pulled-right"
                />
                <MoreHorizontalIcon
                    v-if="trialsAndStudiesActive"
                    class="is-pulled-right"
                />
              </router-link>
              <ul v-show="trialsAndStudiesActive">
                <li>
                  <router-link v-bind:to="{name: 'trials-list', params: {programId: activeProgram.id}}">
                    Trials
                  </router-link>
                </li>
                <li>
                  <router-link v-bind:to="{name: 'studies-list', params: {programId: activeProgram.id}}">
                    Studies
                  </router-link>
                </li>
              </ul>
            </li>
<!--            <li>
              <a>Germplasm Inventory</a>
            </li>-->
            <li>
              <router-link
                v-bind:to="{name: 'import'}"
                v-bind:class="{ 'is-active': importFileActive }"
                :id="importFileMenuId"
                v-if="$ability.can('create', 'Import')"
              >
                Import File
                <MoreVerticalIcon
                    v-if="!importFileActive"
                    class="is-pulled-right"
                />
                <MoreHorizontalIcon
                    v-if="importFileActive"
                    class="is-pulled-right"
                />
              </router-link>
              <ul v-show="importFileActive">
                <li>
                  <router-link v-bind:to="{name: 'import-ontology', params: {programId: activeProgram.id}}">
                    Ontology
                  </router-link>
                </li>
                <li>
                  <router-link v-bind:to="{name: 'germplasm-import', params: {programId: activeProgram.id}}">
                    Germplasm
                  </router-link>
                </li>
                <li>
                  <router-link v-bind:to="{name: 'experiment-import', params: {programId: activeProgram.id}}">
                    Experiments & Observations
                  </router-link>
                </li>
                <li>
                  <router-link v-bind:to="{name: 'brapi-import', params: {programId: activeProgram.id}}">
                    BrAPI Import
                  </router-link>
                </li>
              </ul>
            </li>
            <li>
              <router-link
                v-bind:to="{name: 'ontology', params: {programId: activeProgram.id}}"
                v-bind:class="{ 'is-active': ontologyActive }"
                :id="ontologyMenuId"
              >
                Ontology
                <MoreVerticalIcon
                  v-if="!ontologyActive"
                  class="is-pulled-right"
                />
                <MoreHorizontalIcon
                  v-if="ontologyActive"
                  class="is-pulled-right"
                />
              </router-link>
              <ul v-show="ontologyActive">
                <li>
                  <router-link v-bind:to="{name: 'active-terms', params: {programId: activeProgram.id}}">
                    Ontology List
                  </router-link>
                </li>
                <li>
                  <router-link v-bind:to="{name: 'traits-favorites', params: {programId: activeProgram.id}}">
                    Favorites
                  </router-link>
                </li>
                <li
                  v-if="$ability.can('create', 'Trait')"
                >
                  <router-link v-bind:to="{name: 'traits-import', params: {programId: activeProgram.id}}">
                    Import Ontology
                  </router-link>
                </li>
                <li>
                  <router-link v-bind:to="{name: 'archived-terms', params: {programId: activeProgram.id}}">
                    Archived Ontology
                  </router-link>
                </li>
              </ul>
            </li>
            <li>
              <router-link
                  v-bind:to="{name: 'germplasm', params: {programId: activeProgram.id}}"
                  v-bind:class="{ 'is-active': germplasmActive }"
                  :id="germplasmMenuId"
              >
                Germplasm
                <MoreVerticalIcon
                    v-if="!germplasmActive"
                    class="is-pulled-right"
                />
                <MoreHorizontalIcon
                    v-if="germplasmActive"
                    class="is-pulled-right"
                />
              </router-link>
              <ul v-show="germplasmActive">
                <li>
                  <router-link v-bind:to="{name: 'germplasm-all', params: {programId: activeProgram.id}}">
                    All Germplasm
                  </router-link>
                </li>
                <li>
                  <router-link v-bind:to="{name: 'germplasm-list', params: {programId: activeProgram.id}}">
                    Germplasm List
                  </router-link>
                </li>
              </ul>
            </li>
            <!--
            <li>
              <a>Labels</a>
            </li>
            <li>
              <a>Reports</a>
            </li>
            -->
            <li>
              <router-link
                v-bind:to="{name: 'program-management', params: {programId: activeProgram.id}}"
                v-bind:class="{ 'is-active': programManagementActive }"
                :id="programManagementMenuId"
              >
                Program Management
                <MoreVerticalIcon
                  v-if="!programManagementActive"
                  class="is-pulled-right"
                />
                <MoreHorizontalIcon
                  v-if="programManagementActive"
                  class="is-pulled-right"
                />
              </router-link>
              <ul v-show="programManagementActive">
                <li>
                  <router-link v-bind:to="{name: 'program-locations', params: {programId: activeProgram.id}}">
                    Locations
                  </router-link>
                </li>
                <li>
                  <router-link v-bind:to="{name: 'program-users', params: {programId: activeProgram.id}}">
                    Users
                  </router-link>
                </li>
              </ul>
            </li>
            <li>
              <router-link v-bind:to="{name: 'brapi-info', params: {programId: activeProgram.id}}" :id="brAPIMenuId">
                BrAPI
              </router-link>
            </li>
          </ul>
        </template>
      </nav>
    </template>
    <template v-slot:content>
      <slot />
    </template>
  </BaseSideBarLayout>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import BaseSideBarLayout from '@/components/layouts/BaseSideBarLayout.vue';
  import { MoreVerticalIcon, MoreHorizontalIcon, ChevronDownIcon } from 'vue-feather-icons'
  import {Program} from "@/breeding-insight/model/Program";
  import {mapGetters} from "vuex";
  import {User} from "@/breeding-insight/model/User";
  import {ProgramService} from "@/breeding-insight/service/ProgramService";
  import {EventBus} from "@/util/event-bus";
  import ClickOutside from 'vue-click-outside';

  @Component( {
    components: {BaseSideBarLayout, MoreVerticalIcon, MoreHorizontalIcon, ChevronDownIcon},
    computed: {
      ...mapGetters([
        'activeProgram',
        'activeUser'
      ])
    },
    directives: {
      ClickOutside
    }
  })
  export default class UserSideBarLayout extends Vue {
    sideMenuShownMobile: boolean = false;
    private activeProgram?: Program;
    private activeUser?: User;
    programManagementActive: boolean =  true;
    ontologyActive: boolean = false;
    traitsActive: boolean = false;
    trialsAndStudiesActive: boolean = false;
    importFileActive: boolean = false;
    germplasmActive: boolean = false;
    private programs: Program[] = [];
    private programSelectActive: boolean = false;

    private usersMenuId: string = "usersidebarlayout-users-menu";
    private programsMenuId: string = "usersidebarlayout-programs-menu";

    private homeMenuId: string = "usersidebarlayout-home-menu";
    private importFileMenuId: string = "usersidebarlayout-import-file-menu";
    private ontologyMenuId: string = "usersidebarlayout-ontology-menu";
    private programManagementMenuId: string = "usersidebarlayout-program-management-menu";
    private brAPIMenuId: string = "usersidebarlayout-brapi-menu";
    private germplasmMenuId: string = "usersidebarlayout-germplasm-menu";

  @Prop()
    username!: string;
    created() {
      EventBus.bus.$on(EventBus.programChange, this.getPrograms);
    }
    mounted() {
      this.setActiveLinkSubmenus();
      this.getPrograms();
    }
    updated() {
      this.setActiveLinkSubmenus();
      this.getPrograms();
    }
    get title(): string {
      var path: string = this.$route.path;
      if (path.startsWith("/admin")){
        return "System Administration";
      }
      else {
        if (this.activeProgram){
          return this.activeProgram.name ? this.activeProgram.name : 'Program Name';
        } else {
          return 'Program Name'
        }
      }
    }
    getPrograms() {
      ProgramService.getAll().then(([programs, metadata]) => {
        this.programs = programs;
        // Clear the active program if its not in the list of programs anymore
        if (this.activeProgram){
          const foundActiveProgram: Program[] = programs.filter((program) => program.id === this.activeProgram!.id);
          if (foundActiveProgram.length === 0){
            this.$store.dispatch('clearActiveProgram');
          }
        }
      }).catch((error) => {
        throw error;
      });
    }
    setActiveLinkSubmenus() {
      var path: string = this.$route.path;
      this.programManagementActive = path.includes('/program-management/');
      this.trialsAndStudiesActive = path.includes('/trials-studies/');
      this.ontologyActive = path.includes('/ontology/') || path.includes('traits/import') || path.includes('traits/favorites');
      this.traitsActive = path.includes('/traits/');
      this.importFileActive = path.includes('/import/');
      this.germplasmActive = path.includes('/germplasm/');
    }
    hideProgramSelect() {
      this.programSelectActive = false;
    }
  }
</script>
