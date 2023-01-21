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
  <div class="curate">
    <router-link v-bind:to="{name: 'pending-imports', params: {programId: activeProgram.id}}">
      &lt; Pending Imports
    </router-link>
    <div class="mb-4"></div>
    <h1 class="title">
      Curate Import
    </h1>
    <p>Import IDS: {{importIds}}</p>
  </div>
</template>

<script lang="ts">
import {Component, Watch} from 'vue-property-decorator'
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import {Germplasm} from "@/breeding-insight/brapi/model/germplasm";
import {GermplasmService} from "@/breeding-insight/service/GermplasmService";
import GermplasmLink from '@/components/germplasm/GermplasmLink.vue'
import {Pedigree} from "@/breeding-insight/model/import/germplasm/Pedigree";
import {GermplasmUtils} from '@/breeding-insight/utils/GermplasmUtils';
import { Result } from '@/breeding-insight/model/Result';
import {Route} from "vue-router";
import {BrAPIService, BrAPIType} from "@/breeding-insight/service/BrAPIService";
import {GermplasmSortField, SortOrder} from "@/breeding-insight/model/Sort";
import ProgramsBase from '@/components/program/ProgramsBase.vue';

@Component({
  components: {},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class CurateImport extends ProgramsBase {

  private activeProgram?: Program;
  private importIds: string[] = JSON.parse(this.$route.params.importIds);


}
</script>