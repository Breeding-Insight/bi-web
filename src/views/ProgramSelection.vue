<template>
  <div class="program-selection">
    <h1 class="title">
      Welcome, {{ activeUser.name }}!
    </h1>
    <p>Which program are you working with today?</p>
    <div class="columns">
      <div class="column is-narrow">
        <div class="buttons">
          <template v-if="activeUser && activeUser.hasRole('admin')">
            <router-link
              v-bind:to="{name: 'admin'}"
              class="button is-primary is-light is-fullwidth is-outlined"
            >
              System Administration
            </router-link>
          </template>
          <template v-if="programs.length > 0">
            <router-link
                v-for="program in programs"
                v-bind:key="program.id"
                v-bind:to="{name: 'program-home', params: {programId: program.id}}"
                class="button is-primary is-light is-fullwidth is-outlined"
            >
              {{program.name}}
            </router-link>
          </template>
          <template v-else>
            <p>No programs found in system</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import {Program} from "@/breeding-insight/model/Program";
  import { ProgramService } from '../breeding-insight/service/ProgramService';
  import {mapGetters} from "vuex";
  import {User} from "@/breeding-insight/model/User";

  @Component({
    components: {},
    computed: {
      ...mapGetters([
        'activeUser'
      ])
    }
  })
  export default class ProgramSelection extends Vue {

    private programs: Program[] = [];
    private activeUser?: User;

    mounted() {
      this.getPrograms();
    }

    getPrograms() {
      ProgramService.getAll().then((programs: Program[]) => {
        this.programs = programs;
        if (programs.length == 1){
          const program: Program = programs[0];
          this.$router.replace({name: 'program-home', params: {programId: program.id!}});
        }
      }).catch((error) => {
        this.$emit('show-error-notification', 'Error while trying to load programs');
        throw error;
      });
    }

  }
</script>