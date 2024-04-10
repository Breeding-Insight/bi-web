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
            <div class="dropdown-item">
              <input class="input" type="text" placeholder="Program Name" v-on:input="filterPrograms($event)" v-bind:value="programFilterValue">
            </div>
            <hr class="dropdown-divider">
            <div class="programs">
              <template v-for="program of filteredPrograms">
                <router-link
                    v-if="activeProgram === undefined || program.id !== activeProgram.id"
                    v-bind:key="`programNav${program.id}`"
                    v-bind:to="{name: 'program', params: {programId: program.id}}"
                    v-on:click.native="beforeProgramNav()"
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
      </div>
    </template>
    <template v-slot:menu>
      <nav role="navigation" aria-label="main navigation">
        <template v-if="activeProgram">
          <p class="menu-label">
            {{activeProgram.name}}
          </p>
          <ul class="menu-list">
            <li>
              <router-link v-bind:to="{name: 'program-home', params: {programId: activeProgram.id}}" :id="homeMenuId">
                Home
              </router-link>
            </li>
<!--            <li>
              <a>Germplasm Inventory</a>
            </li>-->
            <li>
              <router-link
                  v-bind:to="{name: 'germplasm', params: {programId: activeProgram.id}}"
                  :id="germplasmMenuId"
              >
                Germplasm
              </router-link>
            </li>
            <li>
              <router-link
                  v-bind:to="{name: 'experiments-observations', params: {programId: activeProgram.id}}"
              >
                Experiments & Observations
              </router-link>
            </li>
            <li>
              <router-link
                  v-bind:to="{name: 'ontology', params: {programId: activeProgram.id}}"
                  :id="ontologyMenuId"
              >
                Ontology
              </router-link>
            </li>
            <li>
              <router-link
                v-bind:to="{name: 'import'}"
                :id="importFileMenuId"
                v-if="$ability.can('create', 'Import')"
              >
                Import Data
              </router-link>
            </li>
            <li>
              <router-link
                  v-bind:to="{name: 'sample-management', params: {programId: activeProgram.id}}"
                  :id="sampleMgmtMenuId"
              >
                Sample Management
              </router-link>
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
                v-bind:to="{name: 'program-administration', params: {programId: activeProgram.id}}"
                :id="programManagementMenuId"
              >
                Program Administration
              </router-link>
            </li>
            <li>
              <router-link v-bind:to="{name: 'brapi-info', params: {programId: activeProgram.id}}" :id="brAPIMenuId">
                BrAPI
              </router-link>
            </li>
            <li>
              <router-link
                  v-bind:to="{name: 'job-management', params: {programId: activeProgram.id}}"
                  :id="jobManagementMenuId"
              >
                Jobs
              </router-link>
            </li>
          </ul>
        </template>
        <template v-if="$ability.can('access', 'AdminSection')">
          <template v-if="activeProgram">
            <hr style="margin:5px;">
          </template>
          <p class="menu-label">
            System Administration
          </p>
          <ul class="menu-list">
            <li>
              <router-link to="/admin/users" :id="usersMenuId">
                Users
              </router-link>
            </li>
            <li>
              <router-link to="/admin/programs" :id="programsMenuId">
                Programs
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
    private programs: Program[] = [];
    private filteredPrograms: Program[] = [];
    private programFilterValue: string = "";
    private programSelectActive: boolean = false;

    private usersMenuId: string = "usersidebarlayout-users-menu";
    private programsMenuId: string = "usersidebarlayout-programs-menu";

    private homeMenuId: string = "usersidebarlayout-home-menu";
    private importFileMenuId: string = "usersidebarlayout-import-file-menu";
    private sampleMgmtMenuId: string = "usersidebarlayout-sample-management-menu";
    private ontologyMenuId: string = "usersidebarlayout-ontology-menu";
    private programManagementMenuId: string = "usersidebarlayout-program-management-menu";
    private jobManagementMenuId: string = "usersidebarlayout-job-management-menu";
    private brAPIMenuId: string = "usersidebarlayout-brapi-menu";
    private germplasmMenuId: string = "usersidebarlayout-germplasm-menu";

  @Prop()
    username!: string;
    created() {
      EventBus.bus.$on(EventBus.programChange, this.getPrograms);
    }
    mounted() {
      this.getPrograms();
    }
    updated() {
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
        this.filteredPrograms = programs;
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

    hideProgramSelect() {
      this.programSelectActive = false;
    }

    filterPrograms($event: any) {
      let filter = $event.target.value.toLowerCase();
      if(filter.trim().length > 0) {
        this.filteredPrograms = this.programs.filter(value => value.name!.toLowerCase().includes(filter));
      } else {
        this.filteredPrograms = this.programs;
      }
    }

    beforeProgramNav() {
      this.programSelectActive = false;
      this.programFilterValue = "";
    }
  }
</script>
