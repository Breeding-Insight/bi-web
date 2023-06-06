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
  <div class="observations-list">
    <!--<h1 class="title">{{title}}</h1>-->
    <ObservationsPlot
      v-on:study-changed="updateStudy"
    />

    <ObservationsListTable
        v-bind:study-id="studyId"
    v-on:show-success-notification="$emit('show-success-notification', $event)"
    v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
    </ObservationsListTable>

  </div>
</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator'
  import ObservationsListTable from '@/components/observations/ObservationsListTable.vue'
  import ProgramsBase from "@/components/program/ProgramsBase.vue";
  import {Study} from '@/breeding-insight/model/Study';
  import {StudyService} from '@/breeding-insight/service/StudyService';
  import {Result} from '@/breeding-insight/model/Result';
  import ObservationsPlot from "@/components/observations/ObservationsPlot.vue";
  import { Observation } from '@/breeding-insight/model/Observation';

  @Component({
    components: {
      ObservationsListTable, ObservationsPlot
    }
  })

  export default class ObservationsList extends ProgramsBase {
    private study: Study =  new Study();
    private programId?: string = this.$route.params.programId;
    private studyId?: string = 'test'; // = this.$route.params.studyId;
    private title: string = 'All Observations';


    private observations: Observation[] = [];

    mounted() {
      if (this.$route.params.studyId) this.getStudy();
    }

    updateStudy(studyId: string) {
      this.studyId = studyId;
    }

    async getStudy() {
      try {
        const response: Result<Error, Study> = await StudyService.getById(this.programId, this.studyId!);
        if(response.isErr()) throw response.value;
        this.study = response.value;
        this.title = `Observations in ${this.study.name}`;
      } catch (error) {
        this.$emit('show-error-notification', 'Error while trying to load studies');
      }
    }
  }

</script>
