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
    <div class="columns is-vcentered">
      <div class="column is-narrow">
        <h2 class="title is-4">{{field.name}}</h2>
      </div>
      <div class="column">
        <span v-if="field.required" class="has-text-danger">
          <AlertCircleIcon size="1x" class="mr-1 has-vertical-align-middle"></AlertCircleIcon>
          Required
        </span>
        <span v-else>(optional)</span>
      </div>
      <div class="column has-text-right">
        <button class="button is-info is-small is-rounded" v-on:click="showInfo = !showInfo">
          <span v-if="!showInfo">Show Info</span>
          <span v-else>Hide Info</span>
          <SearchIcon size="1x" class="ml-1"></SearchIcon>
        </button>
      </div>
    </div>
    <article
        v-if="field.description && showInfo"
        class="message is-info is-light"
    >
      <div class="message-body">
        {{field.description}}
      </div>
    </article>
    <div class="columns">
      <div class="column">
        <BasicSelectField
          v-if="!manualInput"
          v-bind:selected-id="mapping ? mapping.fileFieldName : undefined"
          v-bind:options="fileFields"
          v-bind:field-name="`File Column`"
          v-bind:empty-value-name="`-- ${field.name} column --`"
          v-on:input="setMappingField($event)"
          class="mb-0"
        />
        <BasicInputField
          v-if="manualInput"
          v-bind:value="mapping ? mapping.constantValue : undefined"
          v-bind:field-name="`Constant Value`"
          v-bind:placeholder="field.name"
          v-on:input="setManualField($event)"
          class="mb-0"
        />
        <a
          v-if="!manualInput"
          v-on:click.stop="manualInput = true"
          class="is-underlined"
        >
          Set value manually
        </a>
        <a
          v-else
          v-on:click.stop="manualInput = false"
          class="is-underlined"
        >
          Map to column in file
        </a>
      </div>
      <div class="column">
        <BasicInputField
            v-bind:value="mapping ? mapping.fieldAlias : undefined"
            v-bind:field-name="`Field Display Name`"
            v-bind:field-help="'The name that will be display during import data review.'"
            v-bind:placeholder="field.name"
            v-on:input="setDisplayName($event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {ImportField} from "@/breeding-insight/model/import/ImportField";
  import BasicSelectField from "@/components/forms/BasicSelectField.vue";
  import BasicInputField from "@/components/forms/BasicInputField.vue";
  import {Mapping} from "@/breeding-insight/model/import/Mapping";
  import {AlertCircleIcon, SearchIcon} from "vue-feather-icons";

  @Component({
    components: {BasicInputField, BasicSelectField, AlertCircleIcon, SearchIcon }
  })
  export default class FieldMappingRow extends Vue {
    @Prop()
    field!: ImportField;
    @Prop()
    mapping!: Mapping;
    @Prop()
    fileFields!: string[];

    manualInput: boolean = false;
    showInfo: boolean = false;
    localMapping!: Mapping;
    mappingChangeEvent: string = 'mapping-change';

    mounted() {
      if (this.mapping && this.mapping.constantValue){
        this.manualInput = true;
      } else {
        this.manualInput = false;
      }
    }

    @Watch('mapping', {immediate: true, deep: true})
    updateMapping(newVal: Mapping) {
      this.localMapping = new Mapping(newVal);
    }

    setManualField(value: string){
      this.localMapping.constantValue = value;
      this.$emit(this.mappingChangeEvent, this.localMapping);
    }

    setMappingField(value: string){
      this.localMapping.fileFieldName = value;
      this.$emit(this.mappingChangeEvent, this.localMapping);
    }

    setDisplayName(value: string) {
      this.localMapping.fieldAlias = value;
      this.$emit(this.mappingChangeEvent, this.localMapping);
    }
  }

</script>

<style scoped>
</style>