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
  <div>
    <div v-bind:key="field.id">
      <h2>{{field.name}}</h2>
      <p>{{field.description}}</p>
      <div class="columns">
        <div class="column has-text-right">
          <button
              class="button is-primary"
              v-on:click="addListMapping"
          >
            Add {{field.name}}
          </button>
        </div>
      </div>

      <template v-for="({config, listMapping}, i) in getObjectListMappings()">
        <ObjectMappingRow
            v-bind:key="`${config.id}${i}`"
            v-bind:config="config"
            v-bind:mapping="listMapping"
            v-on:focus-object="$emit('focus-object', $event)"
        />
      </template>

    </div>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import BasicSelectField from "@/components/forms/BasicSelectField.vue";
  import BasicInputField from "@/components/forms/BasicInputField.vue";
  import {ImportRelationType} from "@/breeding-insight/model/import/ImportRelation";
  import {ImportField} from "@/breeding-insight/model/import/ImportField";
  import {Mapping} from "@/breeding-insight/model/import/Mapping";
  import ObjectMappingRow from "@/components/import/ObjectMappingRow.vue";
  import {ImportMappingConfig} from "@/breeding-insight/model/import/ImportMapping";

  @Component({
    components: {ObjectMappingRow, BasicInputField, BasicSelectField},
    data: () => ({ImportRelationType})
  })
  export default class ListMappingRow extends Vue {
    @Prop()
    field!: ImportField;
    @Prop()
    mapping!: Mapping;
    @Prop()
    importMapping!: ImportMappingConfig;

    mappingChangeEvent: string = 'mapping-change';

    addListMapping() {
      this.importMapping.addMapping(this.field, this.mapping.id!);
    }

    getObjectListMappings(): {config: ImportField, listMapping?: Mapping}[] {
      if (this.mapping){
        const results = this.mapping.mapping!.map(mappedField => { return { config: this.field, listMapping: mappedField}});
        return results;
      } else {
        return [];
      }
    }
  }

</script>

<style scoped>

</style>