<template>
  <div class="program-selection">
    <h1 class="title">
      Welcome, {{ username }}!
    </h1>
    <p>Which program are you working with today?</p>
    <div class="columns">
      <div class="column is-2">
        <div class="buttons">
          <button v-on:click="$router.push('/admin')" class="button is-primary is-light is-fullwidth is-outlined">System Administration</button>
          <template v-if="programs.length > 0">
            <button v-for="program in programs" :key="program.id" 
              v-on:click="selectProgram(program)" 
              class="button is-primary is-light is-fullwidth is-outlined"
            >
              {{ program.name }}
            </button>
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
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import {Program} from "@/breeding-insight/model/Program";
  import store from '@/store/index.ts';
  import { SET_ACTIVE_PROGRAM } from '@/store/mutation-types';
  import { ProgramService } from '../breeding-insight/service/ProgramService';

  @Component({
    components: {}
  })
  export default class ProgramSelection extends Vue {

    private programs: Program[] = [];

    get username(): string {
      return this.$store.state.user ? this.$store.state.user.name : '';
    }

    mounted() {
      this.getPrograms();
    }

    getPrograms() {
      ProgramService.getAll().then((programs: Program[]) => {
        this.programs = programs;
      }).catch((error) => {
        this.$emit('show-error-notification', 'Error while trying to load programs');
        throw error;
      });
    }

    selectProgram(program: Program) {
      store.commit(SET_ACTIVE_PROGRAM, {'id': program.id, 'name': program.name });
      this.$router.push('/home')
    }

  }
</script>