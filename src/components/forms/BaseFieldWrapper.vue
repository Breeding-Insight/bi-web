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
    <div class="field-label is-normal has-text-left">
      <label class="label is-left" v-bind:for="fieldName" v-bind:class="{'is-sr-only': !showLabel}">
        {{ fieldName }}
      </label>
    </div>
    <div class="field-body">
      <div class="field">
        <div class="control">
          <slot></slot>
          <template v-for="(validationMap, index) in validationSpec">
            <span
                data-testid="formError"
                v-bind:key="fieldName + validationMap.name + index"
                class="form-error has-text-danger"
                :class="{ 'is-hidden': ( validateTypeError(validationMap.name) ) }"
            >
              <AlertTriangleIcon size="1x" aria-hidden="true" class="has-vertical-align-middle mr-1"></AlertTriangleIcon>
              {{ validationMap.message }}
            </span>
          </template>
          <template v-for="(fieldError, index) in serverValidations">
              <span
                  v-bind:key="fieldName + fieldError.field + index"
                  data-testid="formError"
                  class="form-error has-text-danger"
              >
                <AlertTriangleIcon size="1x" aria-hidden="true" class="has-vertical-align-middle mr-1"></AlertTriangleIcon>
                {{ fieldError.errorMessage }}
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
    </div>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue} from "vue-property-decorator";
  import {FieldError} from "@/breeding-insight/model/errors/FieldError";
  import { AlertTriangleIcon } from 'vue-feather-icons';

  @Component({
    components: {AlertTriangleIcon}
  })
  export default class BaseFieldWrapper extends Vue {

    @Prop()
    fieldName!: string;
    @Prop()
    fieldHelp!: string;
    @Prop()
    validations!: any;
    @Prop()
    serverValidations!: FieldError[];
    @Prop({default: true})
    showLabel!: boolean;

    get validationSpec(): Object[] {

      if (this.validations) {
        const validations: string[] = Object.keys(this.validations.$params);
        const validationArray: Map<string, string>[] = [];

        for (const validation of validations){

          const validationMap: any = {}
          validationMap['name'] = validation;
          switch(validation) {
            case 'required':
              validationMap['message'] = `${this.fieldName} is required`;
              break;
            case 'url':
              // TODO: could probably pass optional validation example parameter in future but just hardcode this case for now
              validationMap['message'] = `${this.fieldName} must be in ${validation} format, ex: https://test-server.brapi.org`;
              break;
            case 'maxLength':
              validationMap['message'] = `${this.fieldName} must be less than ${this.validations.$params.maxLength.max} characters.`;
              break;
            case 'minLength':
              validationMap['message'] = `${this.fieldName} must have at least ${this.validations.$params.minLength.min} characters.`;
              break;
            case 'alpha':
              validationMap['message'] = `${this.fieldName} must use only alphabetic characters.`;
              break;
            default:
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
      return (this.validations && this.validations.$anyError) ||
             (this.serverValidations && this.serverValidations.length > 0);
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