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
  <div class="program-management">
    <h1 class="title">
      Program Administration
    </h1>

    <section>
      <nav class="tabs is-boxed">
        <ul>
          <router-link
              v-bind:to="{name: 'program-users', params: {programId: activeProgram.id}}"
              tag="li" active-class="is-active">
            <a>Users</a>
          </router-link>
          <router-link
              v-bind:to="{name: 'program-locations', params: {programId: activeProgram.id}}"
              tag="li" active-class="is-active">
            <a>Locations</a>
          </router-link>
          <router-link
              v-bind:to="{name: 'breeding-methods', params: {programId: activeProgram.id}}"
              tag="li"
              active-class="is-active"
          >
            <a>Breeding Methods</a>
          </router-link>
          <router-link
              v-if="$ability.can('access', 'ProgramConfiguration')"
              v-bind:to="{name: 'ontology-sharing', params: {programId: activeProgram.id}}"
              tag="li" active-class="is-active">
            <a>Ontology Sharing</a>
          </router-link>
        </ul>
      </nav>
    </section>

    <div class="tab-content">
      <router-view
        @show-success-notification="$emit('show-success-notification', $event)"
        @show-info-notification="$emit('show-info-notification', $event)"
        @show-error-notification="$emit('show-error-notification', $event)"
      ></router-view>
    </div>

  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import ProgramUsersTable from '@/components/program/ProgramUsersTable.vue';
  import ProgramLocationsTable from '@/components/program/ProgramLocationsTable.vue';
  import {mapGetters} from "vuex";
  import {Program} from "@/breeding-insight/model/Program";
  import ProgramsBase from "@/components/program/ProgramsBase.vue";

  @Component({
    components: {
      ProgramUsersTable, ProgramLocationsTable
    },
    computed: {
      ...mapGetters([
        'activeProgram'
      ])
    }
  })
  export default class ProgramManagement extends ProgramsBase {

    private activeProgram?: Program;

  }
</script>