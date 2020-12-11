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
    <div class="columns is-vcentered is-mobile is-gapless">
      <div class="column is-four-fifths">
        <BasicInputField
            v-bind:field-name="'Value'"
            v-bind:show-label="false"
            v-bind:placeholder="valuePlaceholder"
            v-bind:value="value"
            v-on:input="$emit('value-change', $event)"
            v-bind:input-id="'value' + Math.random()"
            v-bind:server-validations="serverRowValidation ? serverRowValidation.getValidation(TraitError.CategoryValue): undefined"
        />
      </div>
      <div class="column is-one-fifth ml-2">
        <button type="button" class="delete" v-on:click="$emit('delete')"></button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue} from "vue-property-decorator";
  import BasicInputField from "@/components/forms/BasicInputField.vue";
  import {XIcon} from 'vue-feather-icons';
  import {RowError} from "@/breeding-insight/model/errors/RowError";
  import {TraitError} from "@/breeding-insight/model/errors/TraitErrorHandler";

  @Component({
    components: {BasicInputField, XIcon},
    data: () => ({TraitError})
  })
  export default class ValueRow extends Vue {
    @Prop()
    value!: string;
    @Prop()
    valuePlaceholder: string | undefined;
    @Prop()
    serverRowValidation!: RowError;
  }

</script>