<!--
  - See the NOTICE file distributed with this work for additional information regarding copyright ownership.
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
  import { ProgramService } from '../../breeding-insight/service/ProgramService';
  import {mapGetters} from "vuex";
  import {User} from "@/breeding-insight/model/User";
  import {BiResponse} from "@/breeding-insight/model/BiResponse";

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
      ProgramService.getAll().then(([programs, metadata]) => {
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