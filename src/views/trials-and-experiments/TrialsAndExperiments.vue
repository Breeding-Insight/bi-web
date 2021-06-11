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
  <div class="trials-experiments">
    <h1 class="title">
      Trials and Experiments
    </h1>

    <section>
      <nav class="tabs is-boxed">
        <ul>
          <router-link
              v-bind:to="{name: 'trials-list', params: {programId: activeProgram.id}}"
              tag="li" active-class="is-active">
            <a>Trials</a>
          </router-link>
          <a>Experiments</a>
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
  import ExperimentsTable from '@/components/trials/ExperimentsTable.vue';
  import TrialsTable from '@/components/trials/TrialsTable.vue';
  import {mapGetters} from "vuex";
  import {Program} from "@/breeding-insight/model/Program";
  import TrialsBase from "@/components/trials/TrialsBase.vue";

  @Component({
    components: {
      ExperimentsTable, TrialsTable
    },
    computed: {
      ...mapGetters([
        'activeProgram'
      ])
    }
  })
  export default class TrialsAndExperiments extends TrialsBase {

    private activeProgram?: Program;

  }
</script>
