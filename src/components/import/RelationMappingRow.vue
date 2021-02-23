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
  <div v-bind:key="field.id">
    <h2 class="title is-4">{{field.name}}</h2>
    <div class="subtitle ml-2">
      <p>{{field.description}}</p>
    </div>
    <template v-if="field.relation_options.length > 1">
      <div class="control">
        <template v-for="relation_type in field.relation_options">
          <label
              v-bind:key="relation_type.id"
              class="radio"
          >
            <input
                type="radio"
                v-bind:name="`${field.id} relation`"
                v-bind:value="relation_type.id"
                v-bind:checked="mapping ? relation_type.id === mapping.relationValue : false"
                v-on:input="setRelationType($event.target.value)"
            >
            {{relation_type.name}}
          </label>
        </template>
      </div>
    </template>
    <!-- Relationship view -->
    <template v-if="mapping && mapping.relationValue === ImportRelationType.DB_LOOKUP">
      <div class="columns">
        <div class="column">
          <BasicSelectField
              v-bind:selected-id="mapping && mapping.relationMap ? mapping.relationMap.target : undefined"
              v-bind:options="field.getRelationObject(ImportRelationType.DB_LOOKUP).importFields"
              v-bind:field-name="`Import Field Target`"
              v-bind:empty-value-name="`-- Import Field column --`"
              v-on:input="setRelationTarget($event)"
          />
        </div>
        <div class="column">
          <BasicSelectField
              v-bind:selected-id="mapping && mapping.relationMap ? mapping.relationMap.reference : undefined"
              v-bind:options="fileColumns"
              v-bind:field-name="`File Field Reference Column`"
              v-bind:empty-value-name="`-- File Field column --`"
              v-on:input="setRelationReference($event)"
          />
        </div>
      </div>
    </template>
    <template v-else-if="mapping && mapping.relationValue === ImportRelationType.FILE_LOOKUP">
      <div class="columns">
        <div class="column">
          <BasicSelectField
              v-bind:selected-id="mapping && mapping.relationMap ? mapping.relationMap.target : undefined"
              v-bind:options="fileColumns"
              v-bind:field-name="`File Field Column Target`"
              v-bind:empty-value-name="`-- File Field column --`"
              v-on:input="setRelationTarget($event)"
          />
        </div>
        <div class="column">
          <BasicSelectField
              v-bind:selected-id="mapping && mapping.relationMap ? mapping.relationMap.reference : undefined"
              v-bind:options="fileColumns"
              v-bind:field-name="`Import Field Column Reference`"
              v-bind:empty-value-name="`-- File Field column --`"
              v-on:input="setRelationReference($event)"
          />
        </div>
      </div>
    </template>
  </div>
</template>


<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import BasicSelectField from "@/components/forms/BasicSelectField.vue";
  import BasicInputField from "@/components/forms/BasicInputField.vue";
  import {AlertCircleIcon, SearchIcon} from "vue-feather-icons";
  import {ImportField} from "@/breeding-insight/model/import/ImportField";
  import {ObjectMapping} from "@/breeding-insight/model/import/ObjectMapping";
  import {ImportRelationType} from "@/breeding-insight/model/import/ImportRelation";
  import {Mapping} from "@/breeding-insight/model/import/Mapping";

  @Component({
    components: {BasicInputField, BasicSelectField, AlertCircleIcon, SearchIcon },
    data: () => ({ImportRelationType})
  })
  export default class RelationMappingRow extends Vue {
    @Prop()
    field!: ImportField;
    @Prop()
    mapping!: Mapping;
    @Prop()
    fileColumns!: string[];

    localMapping!: Mapping;
    mappingChangeEvent: string = 'mapping-change';

    @Watch('mapping', {immediate: true, deep: true})
    updateMapping(newVal: Mapping) {
      this.localMapping = new Mapping(newVal);
    }

    setRelationType(value: string){
      this.localMapping.relationValue = ImportRelationType[value as ImportRelationType];
      this.$emit(this.mappingChangeEvent, this.localMapping);
    }

    setRelationReference(value: string) {
      this.localMapping.setRelationReference(value);
      this.$emit(this.mappingChangeEvent, this.localMapping);
    }

    setRelationTarget(value: string) {
      this.localMapping.setRelationTarget(value);
      this.$emit(this.mappingChangeEvent, this.localMapping);
    }
  }
</script>

<style scoped>

</style>