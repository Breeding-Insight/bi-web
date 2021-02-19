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
    <div class="columns">
      <div class="column">
        <span class="mr-2">{{field.name}}</span>
        <span v-if="field.required" class="has-text-danger">(*required)</span>
        <span v-else>(optional)</span>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <BasicSelectField
          v-if="!manualInput"
          v-bind:selected-id="mapping ? mapping.fileFieldName : undefined"
          v-bind:options="fileFields"
          v-bind:field-name="`File Column`"
          v-bind:empty-value-name="`-- ${field.name} column --`"
          v-on:input="$emit('mapping', $event)"
          class="mb-0"
        />
        <BasicInputField
          v-if="manualInput"
          v-bind:value="mapping ? mapping.constantValue : undefined"
          v-bind:field-name="`Constant Value`"
          v-bind:placeholder="field.name"
          v-on:input="$emit('manualEntry', $event)"
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
            v-bind:field-name="`Field Display Name`"
            v-bind:field-help="'The name that will be display during import data review.'"
            v-bind:placeholder="field.name"
            v-on:input.stop="$emit('displayNameEntry', $event)"
        />
      </div>
    </div>
    <article
        v-if="field.description"
        class="message is-info is-light"
    >
      <div class="message-body">
        {{field.description}}
      </div>
    </article>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {ImportField} from "@/breeding-insight/model/import/ImportField";
  import BasicSelectField from "@/components/forms/BasicSelectField.vue";
  import BasicInputField from "@/components/forms/BasicInputField.vue";
  import {Mapping} from "@/breeding-insight/model/import/Mapping";

  @Component({
    components: {BasicInputField, BasicSelectField }
  })
  export default class FieldMappingRow extends Vue {
    @Prop()
    field!: ImportField;
    @Prop()
    mapping!: Mapping;
    @Prop()
    fileFields!: string[];

    manualInput: boolean = false;

    mounted() {
      if (this.mapping && this.mapping.constantValue){
        this.manualInput = true;
      } else {
        this.manualInput = false;
      }
    }
  }

</script>