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
              v-on:click="createNewListMappingEntry()"
          >
            Add {{field.list_object.name}}
          </button>
        </div>
      </div>

      <template v-for="({config, object}) in getObjectListMappings()">
        <ImportGroupSummaryCard
            v-bind:key="`test ${object.id}`"
            v-bind:config="config"
            v-bind:object="object"
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
  import {ObjectMapping} from "@/breeding-insight/model/import/ObjectMapping";
  import {Mapping} from "@/breeding-insight/model/import/Mapping";
  import {ImportGroup} from "@/breeding-insight/model/import/ImportGroup";
  import ImportGroupSummaryCard from "@/components/import/ImportGroupSummaryCard.vue";

  @Component({
    components: {BasicInputField, BasicSelectField, ImportGroupSummaryCard},
    data: () => ({ImportRelationType})
  })
  export default class ListMappingRow extends Vue {
    @Prop()
    field!: ImportField;
    @Prop()
    mapping!: Mapping;

    localMapping!: Mapping;
    mappingChangeEvent: string = 'mapping-change';

    @Watch('mapping', {immediate: true, deep: true})
    updateMapping(newVal: Mapping) {
      this.localMapping = new Mapping(newVal);
    }

    createNewListMappingEntry() {
      this.localMapping.addObject(new ObjectMapping({object_id: this.field.list_object!.id} as ObjectMapping));
      this.$emit(this.mappingChangeEvent, this.localMapping);
    }

    getObjectListMappings(): {config: ImportGroup, object?: ObjectMapping}[] {
      if (this.mapping){
        const results = this.mapping.objects!.map(object => { return { config: this.field.list_object!, object}});
        return results;
      } else {
        return [];
      }
    }
  }

</script>

<style scoped>

</style>