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
      class="is-flex-grow-1"
  >
    <b-autocomplete
        v-bind="$attrs"
        v-on:input="$emit('input', $event)"
        v-on:select="$emit('select', $event)"
        v-on:focus="$emit('focus', $event)"
        v-on:blur="$emit('blur', $event)"
        v-on:typing="$emit('typing', $event)"
        v-on:infinite-scroll="$emit('infinite-scroll', $event)"
    >
      <template slot-scope="props">
        <slot v-bind="props"></slot>
      </template>
    </b-autocomplete>
  </BaseFieldWrapper>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import BaseFieldWrapper from "@/components/forms/BaseFieldWrapper.vue";
  import {FieldError} from "@/breeding-insight/model/errors/FieldError";

  @Component({
    components: {BaseFieldWrapper}
  })
  export default class AutoCompleteField extends Vue {
    @Prop()
    fieldName!: string;
    @Prop()
    fieldHelp!: string;
    @Prop()
    validations!: any;
    @Prop()
    serverValidations!: FieldError[];
    @Prop()
    showLabel!: boolean;

    filteredDataObj(data: string[]): string[] {
      if (!this.value) {
        return data;
      }

      const result = data.filter(option => {
        return (
          option
            .toLowerCase()
            .indexOf(this.value.toLowerCase()) >= 0
        )
      });

      return result;
    }
  }

</script>