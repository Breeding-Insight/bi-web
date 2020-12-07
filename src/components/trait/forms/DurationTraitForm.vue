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
      <div class="column">
        <b-field
            label="Unit of Time"
        >
          <b-autocomplete
              v-bind:value="unit"
              v-bind:open-on-focus="true"
              v-bind:data="filteredDataObj(unitOptions)"
              v-on:input="$emit('unit-change', $event)"
              placeholder="Start typing to see suggestions"
          />
        </b-field>
      </div>
    </div>
    <div class="columns is-vcentered">
      <div class="column is-half">
        <BasicInputField
            v-bind:field-name="'Minimum Valid Value'"
            v-bind:value="validMin"
            v-on:input="$emit('min-change', $event)"
            v-bind:field-help="'Leave blank to specify no lower limit.'"
        />
      </div>
      <div class="column is-half">
        <BasicInputField
            v-bind:field-name="'Maximum Valid Value'"
            v-bind:value="validMax"
            v-on:input="$emit('max-change', $event)"
            v-bind:field-help="'Leave blank to specify no upper limit.'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue} from "vue-property-decorator";
  import BasicInputField from "@/components/forms/BasicInputField.vue";

  @Component({
    components: {BasicInputField}
  })
  export default class DurationTraitForm extends Vue {
    @Prop()
    private unit!: string;
    @Prop()
    private validMin!: number;
    @Prop()
    private validMax!: number;

    private unitOptions: string[] = ["seconds","minutes","days","weeks","months"];

    filteredDataObj(data: string[]): string[] {
      if (this.unit) {
        return data.filter(option => {
          return (
            option
              .toLowerCase()
              .indexOf(this.unit.toLowerCase()) >= 0
          )
        });
      } else {
        return data;
      }
    }
  }
</script>