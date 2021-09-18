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
  <div class="columns is-multiline is-mobile is-vcentered">
    <div class="column is-2 pt-0 pb-4">
      <span class="is-pulled-right required new-term">Unit of Time</span>
    </div>
    <div class="column new-term is-10 py-0">
      <AutoCompleteField
          v-bind:options="unitOptions"
          v-bind:value="unit"
          v-bind:show-label="false"
          v-bind:field-name="'Unit of Time'"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.ScaleName)"
          v-on:input="$emit('unit-change', $event)"
      />
    </div>
    <div class="column is-2 mt-0 pb-6 pt-2">
      <span class="is-pulled-right new-term">Min</span>
    </div>
    <div class="column new-term is-4 py-0">
      <BasicInputField
          v-bind:field-name="'Minimum Valid Value'"
          v-bind:value="validMin"
          v-bind:show-label="false"
          v-on:input="$emit('min-change', $event)"
          v-bind:field-help="'Leave blank to specify no lower limit.'"
          v-bind:validations="clientValidations && clientValidations.scale.validValueMin ? clientValidations.scale.validValueMin : undefined"
          v-bind:server-validations="validationHandler.getValidation(validationIndex, TraitError.MaximumValue)"
      />
    </div>
    <div class="column is-1 mt-0 pb-6 pt-2">
      <span class="is-pulled-right new-term">Max</span>
    </div>
    <div class="column new-term is-5 py-0">
      <BasicInputField
          v-bind:field-name="'Maximum Valid Value'"
          v-bind:value="validMax"
          v-bind:show-label="false"
          v-on:input="$emit('max-change', $event)"
          v-bind:field-help="'Leave blank to specify no upper limit.'"
          v-bind:validations="clientValidations && clientValidations.scale.validValueMax ? clientValidations.scale.validValueMax : undefined"
          v-bind:server-validations="validationHandler.getValidation(validationIndex, TraitError.MaximumValue)"
      />
    </div>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from "vue-property-decorator";
  import BasicInputField from "@/components/forms/BasicInputField.vue";
  import {TraitError} from "@/breeding-insight/model/errors/TraitError";
  import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
  import AutoCompleteField from "@/components/forms/AutoCompleteField.vue";

  @Component({
    components: {AutoCompleteField, BasicInputField},
    data: () => ({TraitError})
  })
  export default class DurationTraitForm extends Vue {
    @Prop()
    private unit!: string;
    @Prop()
    private validMin!: number;
    @Prop()
    private validMax!: number;
    @Prop()
    private clientValidations!: any | undefined;
    @Prop()
    private validationHandler!: ValidationError;
    @Prop()
    private validationIndex!: number;

    private unitOptions: string[] = ["seconds","minutes","days","weeks","months"];

    @Watch('validationHandler', {immediate: true, deep: true})
    overrideScaleName() {
      // Overwrite missing scale name message
      if (this.validationHandler && this.validationHandler.getValidation(this.validationIndex!, TraitError.ScaleName).length > 0) {
        this.validationHandler.overrideMessage(this.validationIndex!, TraitError.ScaleName, 'Missing unit of time', 400);
      }
    }
  }
</script>