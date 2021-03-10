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
    <template v-if="field.relationOptions.length >= 1">
      <div class="control">
        <template v-for="relation_type in field.relationOptions">
          <label
              v-bind:key="relation_type.id"
              class="radio"
          >
            <input
                type="radio"
                v-bind:name="`${field.id} relation`"
                v-bind:value="relation_type.id"
                v-bind:checked="mapping && mapping.value ? relation_type.id === mapping.value.relationValue : false"
                v-on:input="setRelationType($event.target.value)"
            >
            {{relation_type.name}}
          </label>
        </template>
      </div>
    </template>
    <!-- Relationship view -->

    <!-- DB Lookup -->
    <template v-if="getType() === ImportRelationType.DB_LOOKUP">
      <div class="columns">
        <div class="column">
          <BasicSelectField
              v-bind:selected-id="getTarget()"
              v-bind:options="field.getRelationObject(ImportRelationType.DB_LOOKUP).importFields"
              v-bind:field-name="`Import Field Target`"
              v-bind:empty-value-name="`-- Import Field column --`"
              v-on:input="setRelationTarget($event)"
          />
        </div>
        <div class="column">
          <BasicSelectField
              v-bind:selected-id="getReference()"
              v-bind:options="fileColumns"
              v-bind:field-name="`File Field Reference Column`"
              v-bind:empty-value-name="`-- File Field column --`"
              v-on:input="setRelationReference($event)"
          />
        </div>
      </div>
    </template>

    <!-- DB Lookup constant value -->
    <template v-if="getType() === ImportRelationType.DB_LOOKUP_CONSTANT_VALUE">
      <div class="columns">
        <div class="column">
          <BasicSelectField
              v-bind:selected-id="getTarget()"
              v-bind:options="field.getRelationObject(ImportRelationType.DB_LOOKUP_CONSTANT_VALUE).importFields"
              v-bind:field-name="`Import Field Target`"
              v-bind:empty-value-name="`-- Import Field column --`"
              v-on:input="setRelationTarget($event)"
          />
        </div>
        <div class="column">
          <BasicInputField
              v-bind:value="getReference()"
              v-bind:field-name="`Look Up Value`"
              v-bind:field-help="'This value will be used for the database search.'"
              v-on:input="setRelationReference($event)"
          />
        </div>
      </div>
    </template>

    <!-- File Lookup -->
    <template v-else-if="getType() === ImportRelationType.FILE_LOOKUP">
      <div class="columns">
        <div class="column">
          <BasicSelectField
              v-bind:selected-id="getTarget()"
              v-bind:options="fileColumns"
              v-bind:field-name="`File Field Column Target`"
              v-bind:empty-value-name="`-- File Field column --`"
              v-on:input="setRelationTarget($event)"
          />
        </div>
        <div class="column">
          <BasicSelectField
              v-bind:selected-id="getReference()"
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
  import {ImportRelationType} from "@/breeding-insight/model/import/ImportRelation";
  import {Mapping} from "@/breeding-insight/model/import/Mapping";
  import {ImportMappingConfig} from "@/breeding-insight/model/import/ImportMapping";

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
    importMapping!: ImportMappingConfig;
    @Prop()
    fileColumns!: string[];

    mappingChangeEvent: string = 'mapping-change';

    getType(): ImportRelationType | undefined {
      return this.mapping && this.mapping.value ? this.mapping.value.relationValue : undefined;
    }

    getTarget(): string | undefined {
      return this.mapping && this.mapping.value && this.mapping.value.relationMap ? this.mapping.value.relationMap.target : undefined;
    }

    getReference(): string | undefined {
      return this.mapping && this.mapping.value && this.mapping.value.relationMap ? this.mapping.value.relationMap.reference : undefined;
    }

    setRelationType(value: string){
      this.importMapping.setMappingRelationType(this.mapping.id!, ImportRelationType[value as ImportRelationType]);
      this.$forceUpdate();
    }

    setRelationReference(value: string) {
      this.importMapping.setMappingRelationReference(this.mapping.id!, value);
    }

    setRelationTarget(value: string) {
      this.importMapping.setMappingRelationTarget(this.mapping.id!, value);
    }
  }
</script>

<style scoped>

</style>