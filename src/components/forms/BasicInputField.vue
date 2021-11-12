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
    <input
        v-bind:id="inputId ? inputId : fieldName.split(' ').join('-')"
        v-bind:value="value"
        @input="$emit('input', $event.target.value)"
        class="input"
        v-bind:type="fieldTypeComputed"
        v-bind:placeholder="placeholder ? placeholder : fieldName"
        v-bind:autocomplete="autocomplete"
    />
  </BaseFieldWrapper>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import BaseFieldWrapper from "@/components/forms/BaseFieldWrapper.vue";
  import {FieldError} from "@/breeding-insight/model/errors/FieldError";

  @Component({
    components: {BaseFieldWrapper}
  })
  export default class BasicInputField extends Vue {
    @Prop()
    value!: any;
    @Prop()
    fieldType!: string;
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
    @Prop()
    placeholder: boolean | undefined;
    @Prop()
    inputId: string | undefined;
    @Prop()
    autocomplete: boolean | true;

    get fieldTypeComputed() {
      return this.fieldType ? this.fieldType : 'text';
    }
  }

</script>