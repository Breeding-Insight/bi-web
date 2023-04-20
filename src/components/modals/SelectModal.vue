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
  <BaseModal
    v-bind:active.sync="active"
    v-on:deactivate="$emit('deactivate')"
  >
    <div>
      <div>
        <article class="media">
          <div class="media-content">
            <div class="content">
              <h2
                class="is-5 title"
                :class="modalHeaderClass"
              >
                {{ title }}
              </h2>
            </div>
          </div>
        </article>
        <div class="control">
          <template>
            <fieldset>
              <legend class="label">
                {{ fieldsetLegend }}
              </legend>
              <div
                v-for="option in options"
                v-bind:key="option.id"
              >
                <label class="b-radio radio">
                  <input
                    v-model="checked"
                    type="radio"
                    v-bind:name="optionType"
                    v-bind:value="option.id"
                    v-on:change="$emit('select-change', checked)"
                  ><span class="check" />
                  <span class="control-label"> {{ option.name }} </span>
                </label>
              </div>
            </fieldset>
          </template>
        </div>
        <slot name="buttons" />
      </div>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BaseModal from '@/components/modals/BaseModal.vue';
import {SelectOption} from "@/breeding-insight/model/SelectOption";

@Component({
  components: {BaseModal}
})
export default class SelectModal extends Vue {
  @Prop()
  active!: boolean;
  @Prop()
  title! : string;
  @Prop()
  fieldsetLegend?: string;
  @Prop()
  options!: SelectOption<string, string>[];

  private checked: string = "";

  private optionType = "optionType";
  private modalHeaderClass: string = "modal-header";

  mounted(){
    this.checked = this.options[0].id;
    this.$emit('select-change', this.checked);
  }
}

</script>