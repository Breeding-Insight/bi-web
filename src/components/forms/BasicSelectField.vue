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
  <BaseFieldWrapper
      v-bind:validations="validations"
      v-bind:field-help="fieldHelp"
      v-bind:field-name="fieldName"
      v-bind:show-label="showLabel"
      v-bind:server-validations="serverValidations"
  >
    <div class="select is-fullwidth">
      <select
          v-bind:id="fieldName.split(' ').join('-').replace(/[^a-zA-Z0-9\-]/gm, '')"
          v-on:change="$emit('input', $event.target.value)"
          class="select is-fullwidth"
          v-bind:disabled="isDisabled"
      >
        <option disabled v-bind:selected="displayDefault()" value="">Select a {{fieldName.toLowerCase()}}</option>
        <template v-if="emptyValueName">
          <option v-bind:value="undefined" v-bind:selected="selectedId === undefined">
            {{emptyValueName}}
          </option>
        </template>
        <option
            v-for="option in options"
            v-bind:key="option.id || option"
            v-bind:selected="option.id ? option.id === selectedId : option === selectedId"
            v-bind:value="option.id || option"
        >
          {{ option.name || option }}
        </option>
      </select>
    </div>
  </BaseFieldWrapper>

</template>

<script lang="ts">
  import { Component, Prop, PropSync, Vue } from 'vue-property-decorator';
  import BaseFieldWrapper from "@/components/forms/BaseFieldWrapper.vue";
  import {FieldError} from "@/breeding-insight/model/errors/FieldError";
  @Component({
    components: {BaseFieldWrapper}
  })
  export default class BasicSelectField extends Vue {
    @Prop()
    selectedId!: string;
    @Prop()
    options!: any;
    @Prop()
    fieldName!: string;
    @Prop()
    fieldHelp!: string;
    @Prop()
    validations!: any;
    @Prop()
    serverValidations!: FieldError[];
    @Prop()
    emptyValueName!: string;
    @Prop()
    showLabel!: boolean;
    @Prop()
    isDisabled!: boolean;


    displayDefault() {
      return this.selectedId === null || this.selectedId === undefined;
    }
  }

</script>
