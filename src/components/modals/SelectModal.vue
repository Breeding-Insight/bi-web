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
              <h3 class="is-5 title" :class="modalHeaderClass">
                {{title}}
              </h3>
            </div>
          </div>
        </article>
        <section>
          <p class="has-text-dark has-text-weight-bold" :class="this.$modalTextClass">
            {{ subtitle }}
          </p>
        </section>
        <div class="control">
          <template v-for="option in options">
            <label
                v-bind:key="option.name"
                class="radio modal-radio"
            >
              <input
                  type="radio"
                  v-bind:name="optionType"
                  v-bind:value="option.name"
                  v-model="checked"
                  v-on:change="$emit('select-change', checked)"
              >
              {{option.name}}
            </label>
          </template>
        </div>
        <slot></slot>
      </div>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BaseModal from '@/components/modals/BaseModal.vue';

@Component({
  components: {BaseModal}
})
export default class SelectModal extends Vue {
  @Prop()
  active!: boolean;
  @Prop()
  title! : string;
  @Prop()
  subtitle!: string;
  @Prop()
  options:string;

  private checked: string = "";

  private optionType = "optionType";
  private modalHeaderClass: string = "modal-header";

  mounted(){
    this.checked = this.options[0].name;
    this.$emit('select-change', this.checked);
  }

  //TODO utilize id instead of name in places?
}

</script>