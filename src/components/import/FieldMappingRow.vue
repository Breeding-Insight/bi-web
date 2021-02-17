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
    <div class="level">
      <div class="level-item">
        <span class="mr-2">{{field.name}}</span>
        <span v-if="field.required" class="has-text-danger">(*required)</span>
        <span v-else>(optional)</span>
      </div>
      <div class="level-item">
        <BasicSelectField
          v-if="!manualInput"
          v-bind:options="fileFields"
          v-bind:field-name="`File column mapping for ${field.name}`"
          v-bind:show-label="false"
          v-bind:empty-value-name="`-- ${field.name} column --`"
          v-on:input="$emit('mapping', $event)"
        />
        <BasicInputField
          v-if="manualInput"
          v-bind:field-name="`Manual entry for ${field.name}`"
          v-bind:placeholder="field.name"
          v-bind:show-label = false
          v-on:input="$emit('manualEntry', $event)"
        />
        <a
          v-if="!manualInput"
          v-on:click="manualInput = true"
        >
          Set value manually
        </a>
        <a
          v-else
          v-on:click="manualInput = false"
        >
          Map to column in file
        </a>
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

  @Component({
    components: {BasicInputField, BasicSelectField }
  })
  export default class FieldMappingRow extends Vue {
    @Prop()
    field!: ImportField;
    @Prop()
    fileFields!: string[];

    manualInput: boolean = false;
  }

</script>