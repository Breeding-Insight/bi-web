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
  <div id="ontology-sharing">
      <SharedOntologyConfiguration
          v-on="$listeners"
          class="mb-6"
          v-bind:subscription-change="subscribeAction"
          v-on:share-change="shareAction += 1"
      />
      <SubscribeOntologyConfiguration
          v-on="$listeners"
          v-on:subscription-change="subscribeAction += 1"
          v-bind:share-change="shareAction"
      />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import {mapGetters} from "vuex";
import SharedOntologyConfiguration from "@/components/program/SharedOntologyConfiguration.vue";
import SubscribeOntologyConfiguration from "@/components/program/SubscribeOntologyConfiguration.vue";
import BreedingMethods from "@/views/germplasm/BreedingMethods.vue";

@Component({
  components: {
    SubscribeOntologyConfiguration,
    SharedOntologyConfiguration,
    BreedingMethods
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class OntologySharing extends ProgramsBase {
  // Change tracker to pass to children for refresh
  private subscribeAction: number = 0;
  private shareAction: number = 0;
}
</script>