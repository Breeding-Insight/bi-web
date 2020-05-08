<template>
  <div class="field" v-bind:class="{ 'field--error': fieldError }">
    <label class="label">
      {{ fieldName }}
    </label>
    <div class="control">
      <slot></slot>
      <template v-for="(validationMap, index) in validationSpec">
        <span
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