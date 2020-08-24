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
  <div class="field" v-bind:class="{ 'field--error': fieldError }">
    <label class="label" v-bind:for="fieldName">
      {{ fieldName }}
    </label>
    <div class="control">
      <slot></slot>
      <template v-for="(validationMap, index) in validationSpec">
        <span
            data-testid="formError"
            v-bind:key="fieldName + validationMap.name + index"
            class="form-error has-text-danger"
            :class="{ 'is-hidden': ( validateTypeError(validationMap.name) ) }"
        >
          {{ validationMap.message }}
        </span>
      </template>
      <p
          v-if="fieldHelp !== null"
          class="help"
      >
        {{ fieldHelp }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue} from "vue-property-decorator";

  @Component
  export default class BaseFieldWrapper extends Vue {

    @Prop()
    fieldName!: string;
    @Prop()
    fieldHelp!: string;
    @Prop()
    validations!: any;

    get validationSpec(): Object[] {

      if (this.validations) {
        const validations: string[] = Object.keys(this.validations.$params);
        const validationArray: Map<string, string>[] = [];

        for (const validation of validations){

          const validationMap: any = {}
          validationMap['name'] = validation;
          if (validation === 'required'){
            validationMap['message'] = `${this.fieldName} is required`;
          } else {
            // For now assume other possibility is a specific format
            validationMap['message'] = `${this.fieldName} must be in ${validation} format`;
          }

          validationArray.push(validationMap);
        }

        return validationArray;

      } else {
        return [];
      }

    }

    get fieldError() {
      if (this.validations) {
        return this.validations.$anyError;
      } else {
        return false;
      }
    }

    validateTypeError(type: string) {

      if (this.validations) {
        if (this.validations[type]) {
          return this.validations[type];
        }
      }

      return false;
    }
  }

</script>