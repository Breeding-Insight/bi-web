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
  <div class="studies-list">
    <h1 class="title">{{title}}</h1>
    <StudiesListTable
    v-on:show-success-notification="$emit('show-success-notification', $event)"
    v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
    </StudiesListTable>
  </div>
</template>

<script lang="ts">
  import { Component } from 'vue-property-decorator'
  import StudiesListTable from '@/components/trials/StudiesListTable.vue'
  import ProgramsBase from "@/components/program/ProgramsBase.vue";
  import {Trial} from '@/breeding-insight/model/Trial';
  import {TrialService} from '@/breeding-insight/service/TrialService';
  import {Metadata} from "@/breeding-insight/model/BiResponse";
  import { mapGetters } from 'vuex'
  import {Result} from '@/breeding-insight/model/Result';
  import {Program} from "@/breeding-insight/model/Program";

  @Component({
    components: {
      StudiesListTable
    },
    computed: {
      ...mapGetters([
      'activeProgram'
      ])
    }
  })

  export default class StudiesList extends ProgramsBase {
    private trial: Trial =  new Trial();
    private activeProgram?: Program;
    private trialId: string | undefined = this.$route.params.trialId;
    private title: string = 'All Studies';

    mounted() {
      if (this.$route.params.trialId) this.getTrial();
    } 

    async getTrial() {
      try {
        const response: Result<Error, Trial> = await TrialService.getById(this.activeProgram.id!, this.trialId!);
        if(response.isErr()) throw response.value;
        this.trial = response.value;
        this.title = `Studies in ${this.trial.trialName}`;
      } catch (error) {
        this.$emit('show-error-notification', 'Error while trying to load studies');
      }
    }
  }
</script>
