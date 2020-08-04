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
    <template v-if="trait">
      <p v-if="trait.traitName" class="is-size-5 has-text-weight-bold mb-0">{{trait.traitName}}</p>

      <!-- just shows first abbreviation AKA main abbreviation -->
      <template v-if="trait.abbreviations && trait.abbreviations.length > 0">
        <p class="is-size-7">{{trait.abbreviations[0]}}</p>
      </template>

      <p v-if="scaleTypeString" class="has-text-weight-bold">{{scaleTypeString}}</p>

      <!-- scale types hardcoded for now until we can get them from bi-api -->
      <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Ordinal)">
        <p class="mb-0" v-for="category in trait.scale.categories" :key="category.label">
          {{ category.label }} = {{category.value}}
        </p>
      </template>

      <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Text)">
        <!-- TODO -->
      </template>

      <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Numerical)">
        <!-- TODO -->
      </template>

      <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Date)">
        <!-- TODO -->
      </template>

      <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Duration)">
        <!-- TODO -->
      </template>

      <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Code)">
        <!-- TODO -->
      </template>

      <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Nominal)">
        <!-- TODO -->
      </template>

      <p class="has-text-weight-bold mt-3 mb-0">Description of collection method</p>
      <p>{{trait.method.description}}</p>

      <!-- maybe break out controls for reuse -->
      <div class="columns is-mobile is-centered pt-6">
        <div class="column is-narrow">
          <a v-on:click="$emit('edit')"
             v-on:keypress.enter.space="$emit('edit')"
             tabindex="0">
            Edit
          </a>
        </div>
        <div class="column is-narrow">
          <a v-on:click="$emit('archive')"
             v-on:keypress.enter.space="$emit('archive')"
             tabindex="0">
            Archive
          </a>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import SidePanel from '@/components/tables/SidePanel.vue'
  import {Trait} from '@/breeding-insight/model/Trait'
  import {Scale, DataType} from '@/breeding-insight/model/Scale'
  import {StringFormatters} from '@/breeding-insight/utils/StringFormatters'

  @Component({
    components: { SidePanel }
  })
  export default class TraitDetailPanel extends Vue {

    @Prop()
    private data!: any;
    private trait: Trait | null = null;
    private DataType = DataType;
    private Scale = Scale;

    @Watch('data', {immediate: true})
    updatedData() {
      console.log('updated trait data');
      this.trait = this.data.data as Trait;
    }

    get abbreviationsSynonymsString() {
      var synonyms;
      var abbsyn = "";
      if (this.trait && this.trait.abbreviations.length > 0) {
        abbsyn = this.trait.abbreviations[0];
      }


      return null;
    }

    get scaleType() {
      if (this.trait && this.trait.scale && this.trait.scale.dataType) {
        return this.trait.scale.dataType;
      }
      return undefined;
    }

    get scaleTypeString() {
      if (this.trait && this.trait.programObservationLevel && this.trait.method && this.trait.scale) {
        return this.trait.programObservationLevel.name + " " +
               this.trait.method.methodClass + " using " +
               StringFormatters.toStartCase(this.trait.scale.dataType!);
      }
      return undefined;
    }
    
  }
</script>


<style scoped>
.is-full-content-height {
  height: 100%;
}
</style>

