<template>
  <BaseSideBarLayout
    v-bind:title="title" 
    v-bind:username="username"
    v-on:logout="$emit('logout')"
  >
    <template v-slot:menu>
      <template v-if="activeUser && activeUser.hasRole('admin')">
        <p class="menu-label">
          Admin
        </p>
        <ul class="menu-list">
          <li>
            <router-link to="/admin/program-management">
              Programs
            </router-link>
            <ul class="menu-list">
              <template v-for="program of programs">
                <router-link v-bind:key="program.id" v-bind:to="{name: 'program-home', params: {programId: program.id}}">
                  {{program.name}}
                </router-link>
              </template>
            </ul>
          </li>
          <li>
            <router-link to="/admin/user-management">
              Users
            </router-link>
          </li>
        </ul>
      </template>
      <hr style="margin:5px;">
      <p class="menu-label">
        My Breeding Insight
      </p>
      <ul class="menu-list">
        <li>
          <router-link to="/account/program-selection">
            My Programs
          </router-link>
        </li>
      </ul>
      <template v-if="activeProgram">
        <hr style="margin:5px;">
        <p class="menu-label">
          {{activeProgram.name}}
        </p>
        <ul class="menu-list">
          <li>
            <router-link v-bind:to="{name: 'program-home', params: {programId: activeProgram.id}}">
              Home
            </router-link>
          </li>
          <li>
            <a>Trials and Experiments</a>
          </li>
          <li>
            <a>Germplasm Inventory</a>
          </li>
          <li>
            <a>Ontology Management</a>
          </li>
          <li>
            <a>Labels</a>
          </li>
          <li>
            <a>Reports</a>
          </li>
          <li>
            <router-link
              v-bind:to="{name: 'program-management', params: {programId: activeProgram.id}}"
              v-bind:class="{ 'is-active': programManagementActive }"
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
        </ul>
      </template>
    </template>
    <template v-slot:content>
      <slot />
    </template>
  </BaseSideBarLayout>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import BaseSideBarLayout from '@/components/layouts/BaseSideBarLayout.vue';
  import { MoreVerticalIcon, MoreHorizontalIcon } from 'vue-feather-icons'
  import {Program} from "@/breeding-insight/model/Program";
  import {mapGetters} from "vuex";
  import {User} from "@/breeding-insight/model/User";
  import {ProgramService} from "@/breeding-insight/service/ProgramService";

  @Component( {
    components: {BaseSideBarLayout, MoreVerticalIcon, MoreHorizontalIcon},
    computed: {
      ...mapGetters([
        'activeProgram',
        'activeUser'
      ])
    }
  })
  export default class UserSideBarLayout extends Vue {
    private activeProgram: Program | undefined;
    private activeUser: User | undefined;
    programManagementActive: boolean =  true;
    private programs: Program[] = [];

    @Prop()
    username!: string;

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
      } else if (path.startsWith("/account")){
        return "Account";
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
      ProgramService.getAll().then((programs: Program[]) => {
        this.programs = programs;
      }).catch((error) => {
        throw error;
      });
    }

    setActiveLinkSubmenus() {
      var path: string = this.$route.path;
      this.programManagementActive = path.includes('/program-management/');
    }

  }

</script>