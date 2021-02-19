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
    <!-- List items -->
    <template v-for="({config: subConfig, object: subObject}) in getObjectListMappings()">
      <div
          v-bind:key="subObject.id"
      >
        <div
            v-bind:key="subConfig.id"
            class="box mb-5"
        >
          <template v-for="(subfield) in subConfig.fields">
            <FieldMappingRow
                v-bind:key="subfield.id"
                v-bind:field="subfield"
                v-bind:fileFields="fileColumns"
                v-bind:mapping="subObject.getField(subfield.id)"
                v-on:mapping-change="setMapping(subObject, $event)"
            />
          </template>
        </div>
      </div>
    </template>
  </div>
</template>


<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import BasicSelectField from "@/components/forms/BasicSelectField.vue";
  import BasicInputField from "@/components/forms/BasicInputField.vue";
  import {ImportRelationType} from "@/breeding-insight/model/import/ImportRelation";
  import {ImportField} from "@/breeding-insight/model/import/ImportField";
  import {ObjectMapping} from "@/breeding-insight/model/import/ObjectMapping";
  import {ImportGroup} from "@/breeding-insight/model/import/ImportGroup";
  import {Mapping} from "@/breeding-insight/model/import/Mapping";
  import FieldMappingRow from "@/components/import/FieldMappingRow.vue";

  @Component({
    components: {BasicInputField, BasicSelectField, FieldMappingRow},
    data: () => ({ImportRelationType})
  })
  export default class ListMappingRow extends Vue {
    @Prop()
    field!: ImportField;
    @Prop()
    fileColumns!: string[];
    @Prop()
    mapping!: Mapping;

    localMapping!: Mapping;
    mappingChangeEvent: string = 'mapping-change';

    @Watch('mapping', {immediate: true, deep: true})
    updateMapping(newVal: Mapping) {
      console.log(newVal);
      this.localMapping = new Mapping(newVal);
    }

    getObjectListMappings(): {config: ImportGroup, object?: ObjectMapping}[] {
      if (this.mapping){
        const results = this.mapping.objects!.map(object => { return { config: this.field.list_object!, object}});
        return results;
      } else {
        return [];
      }
    }

    setMapping(object: ObjectMapping, field: ImportField, newMapping: Mapping){
      //TODO
      //this.localMapping.getObjectById(object.id!)!.replaceMapping(field.id, newMapping);
      //this.$emit(this.mappingChangeEvent, this.localObject);
    }
  }
</script>

<style scoped>

</style>