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
      <div class="column is-half">
        <BasicInputField
            v-bind:field-name="'Unit'"
            v-bind:value="unit"
            v-on:input="$emit('unit-change', $event)"
            v-bind:field-help="'Can be any measurable unit.'"
            v-bind:server-validations="validationHandler.getValidation(validationIndex, TraitError.ScaleName)"
        />
      </div>
      <div class="column is-half">
        <BasicInputField
            v-bind:field-name="'Decimal Places'"
            v-bind:value="decimalPlaces"
            v-on:input="$emit('decimal-change', $event)"
            v-bind:field-help="'Leave blank to constrain to integers.'"
        />
      </div>
    </div>
    <div class="columns is-vcentered">
      <div class="column is-half">
        <BasicInputField
            v-bind:field-name="'Minimum Valid Value'"
            v-bind:value="validMin"
            v-on:input="$emit('min-change', $event)"
            v-bind:field-help="'Numbers only. Decimals ok.'"
        />
      </div>
      <div class="column is-half">
        <BasicInputField
            v-bind:field-name="'Maximum Valid Value'"
            v-bind:value="validMax"
            v-on:input="$emit('max-change', $event)"
            v-bind:field-help="'Numbers only. Decimals ok.'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from "vue-property-decorator";
  import BasicInputField from "@/components/forms/BasicInputField.vue";
  import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
  import {TraitError} from "@/breeding-insight/model/errors/TraitErrorHandler";
  import {DataType} from "@/breeding-insight/model/Scale";

@Component({
  components: {BasicInputField},
  data: () => ({TraitError})
})
export default class NumericalTraitForm extends Vue {
  @Prop()
  private unit: string | undefined;
  @Prop()
  private decimalPlaces: number | undefined;
  @Prop()
  private validMin: number | undefined;
  @Prop()
  private validMax: number | undefined;
  @Prop()
  private validationHandler: ValidationError | undefined;
  @Prop()
  private validationIndex: number | undefined;

  @Watch('validationHandler', {deep: true})
  overrideScaleName() {
    // Overwrite missing scale name message
    if (this.validationHandler && this.validationHandler.getValidation(this.validationIndex!, TraitError.ScaleName).length > 0) {
      this.validationHandler.overrideMessage(this.validationIndex!, TraitError.ScaleName, 'Missing unit', 400);
    }
  }
}
</script>