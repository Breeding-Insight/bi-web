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
    <div class="columns is-mobile is-gapless">
      <div class="column is-2">
        <BasicInputField
            v-bind:field-name="'Value'"
            v-bind:show-label="false"
            v-bind:value="value"
            v-bind:placeholder="valuePlaceholder"
            v-on:input="$emit('value-change', $event)"
            v-bind:input-id="'value' + Math.random()"
            v-bind:server-validations="serverRowValidation ? serverRowValidation.getValidation(TraitError.CategoryValue): undefined"
        />
      </div>
      <div class="column is-1 has-text-centered">
        <p class="is-size-4 mt-2">=</p>
      </div>
      <div class="column is-9">
        <div class="columns is-mobile is-gapless">
          <div class="column is-four-fifths">
            <BasicInputField
                v-bind:field-name="'Label'"
                v-bind:show-label="false"
                v-bind:placeholder="categoryPlaceholder"
                v-bind:value="label"
                v-on:input="$emit('label-change', $event)"
                v-bind:input-id="'label' + Math.random()"
                v-bind:server-validations="serverRowValidation ? serverRowValidation.getValidation(TraitError.CategoryLabel): undefined"
            />
          </div>
          <div class="column is-one-fifth ml-2">
            <button type="button" class="delete mt-4" v-on:click="$emit('delete')"></button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import BasicInputField from "@/components/forms/BasicInputField.vue";
import {XIcon} from 'vue-feather-icons';
import {FieldError} from "@/breeding-insight/model/errors/FieldError";
import {TraitError} from "@/breeding-insight/model/errors/TraitError";
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
  import {RowError} from "@/breeding-insight/model/errors/RowError";

@Component({
  components: {BasicInputField, XIcon},
  data: () => ({TraitError})
})
export default class LabelValueRow extends Vue {
  @Prop()
  label!: string;
  @Prop()
  value!: string;
  @Prop()
  valuePlaceholder: string | undefined;
  @Prop()
  categoryPlaceholder: string | undefined;
  @Prop()
  serverRowValidation!: RowError;
}

</script>