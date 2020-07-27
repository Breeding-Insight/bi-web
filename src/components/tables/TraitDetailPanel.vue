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
  <div class="trait-details-panel is-full-content-height">
    <side-panel v-bind:background-color-class="'has-background-info-light'">
      <p class="is-size-5 has-text-weight-bold mb-0">{{trait.traitName}}</p>
      <template v-if="trait.abbreviations && trait.abbreviations.length > 0">
        <p class="is-size-7">{{trait.abbreviations[0]}}</p>
      </template>

      <p class="has-text-weight-bold mb-0">Description of collection method</p>
      <p>{{trait.method.description}}</p>


      
      <!-- maybe break out controls for reuse -->
      <div class="columns is-mobile is-centered pt-6">
        <div class="column is-narrow">
          <a>Edit</a>
        </div>
        <div class="column is-narrow">
          <a>Archive</a>
        </div>
      </div>
    </side-panel>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import SidePanel from '@/components/tables/SidePanel.vue'
  import {Trait} from '@/breeding-insight/model/Trait'

  @Component({
    components: { SidePanel }
  })
  export default class TraitDetailPanel extends Vue {

    @Prop()
    private trait!: Trait;
    
  }
</script>

<style scoped>
.is-full-content-height {
  height: 100%;
}
</style>
