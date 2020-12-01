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
    <div class="columns is-vcentered is-mobile">
      <div class="column is-one-fifth">
        <BasicInputField
          v-bind:field-name="'Label'"
          v-bind:show-label="false"
        />
      </div>
      <div class="column">
        <p class="is-size-2">=</p>
      </div>
      <div class="column is-four-fifths">
        <BasicInputField
          v-bind:field-name="'Value'"
          v-bind:show-label="false"
          :placeholder="'e.g. Very thin (< 4mm)'"
        />
      </div>
    </div>
  </div>
</template>

<script>

import {Component, Vue} from "vue-property-decorator";
import BasicInputField from "@/components/forms/BasicInputField";

@Component({
  components: {BasicInputField}
})
export default class OrdinalTraitForm extends Vue {

}
</script>