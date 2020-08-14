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

      <!-- just shows first abbreviation AKA main abbreviation and first synonym -->
      <template v-if="abbreviationsSynonymsString">
        <p class="is-size-7">{{abbreviationsSynonymsString(2)}}</p>
      </template>
      <template v-else>
        <p class="mb-3"/>
      </template>

      <p v-if="scaleTypeString" class="has-text-weight-bold mb-0">{{scaleTypeString}}</p>

      <!-- scale types hardcoded for now until we can get them from bi-api -->
      <template v-if="scaleType && (Scale.dataTypeEquals(scaleType, DataType.Ordinal) || Scale.dataTypeEquals(scaleType, DataType.Nominal))">
        <p class="mb-0" v-for="category in trait.scale.categories" :key="category.label">
          <template v-if="category.label">
            {{ category.label }} = 
          </template>
          {{category.value}}
        </p>
      </template>

      <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Text)">
        <!-- TODO: Not showing anything for this now -->
      </template>

      <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Numerical)">
        <p class="mb-0">Decimal Places: {{valueOrNA(trait.scale.decimalPlaces)}}</p>
        <p class="mb-0">Minimum valid value: {{valueOrNA(trait.scale.validValueMin)}}</p>
        <p class="mb-0">Maximum valid value: {{valueOrNA(trait.scale.validValueMax)}}</p>
      </template>

      <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Date) || Scale.dataTypeEquals(scaleType, DataType.Duration)">
        <p class="mb-0">Minimum valid value: {{valueOrNA(trait.scale.validValueMin)}}</p>
        <p class="mb-0">Maximum valid value: {{valueOrNA(trait.scale.validValueMax)}}</p>
      </template>

      <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Code)">
        <!-- TODO: Not showing anything for this now -->
      </template>

      <!-- if computation method, show formula as well -->
      <template v-if="methodClass && Method.methodClassEquals(methodClass, MethodClass.Computation)">
        <p class="has-text-weight-bold mt-3 mb-0">Formula</p>
        <p class="mb-0">{{valueOrNA(trait.method.formula)}}</p>
      </template>


      <p class="has-text-weight-bold mt-3 mb-0">Description of collection method</p>
      <p>{{trait.method.description}}</p>

      <!-- maybe break out controls for reuse eventually -->
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
  import {Method, MethodClass} from '@/breeding-insight/model/Method'
  import {StringFormatters} from '@/breeding-insight/utils/StringFormatters'

  @Component({
    components: { SidePanel }
  })
  export default class TraitDetailPanel extends Vue {

    @Prop()
    private data!: any;
    private trait: Trait | null = null;
    private DataType = DataType;
    private MethodClass = MethodClass;
    private Scale = Scale;
    private Method = Method;

    @Watch('data', {immediate: true})
    updatedData() {
      this.trait = this.data.data as Trait;
    }

    abbreviationsSynonymsString(synonymsMaxLength: number) : string | undefined {
      let abbSyn = "";
      if (this.trait && this.trait.abbreviations && this.trait.abbreviations.length > 0) {
        abbSyn = this.trait.abbreviations[0];
      }
      if (this.trait && this.trait.synonyms && this.trait.synonyms.length > 0) {
        // Up to synonymsMaxLength synonyms will be shown before , ... cutoff
        const synonyms = this.trait.synonyms.slice(0, Math.min(this.trait.synonyms.length, synonymsMaxLength)).join(", ");
        abbSyn = (abbSyn === "") ? synonyms : abbSyn + ", " + synonyms;
        if (this.trait.synonyms.length > synonymsMaxLength && this.trait.synonyms.length !== 1) {
          abbSyn = abbSyn + ", ...";
        }
      }

      return abbSyn === "" ? undefined : abbSyn;
    }

    get scaleType() {
      if (this.trait && this.trait.scale && this.trait.scale.dataType) {
        return this.trait.scale.dataType;
      }
      return undefined;
    }

    get methodClass() {
      if (this.trait && this.trait.method && this.trait.method.methodClass) {
        return this.trait.method.methodClass;
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

    valueOrNA(value: any) {
      return value !== undefined ? value: "NA";
    }
    
  }
</script>


<style scoped>
.is-full-content-height {
  height: 100%;
}
</style>

