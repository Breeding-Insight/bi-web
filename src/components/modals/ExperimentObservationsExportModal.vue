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
      v-bind:cardClass="cardClass"
      v-bind:bodyClass="bodyClass"
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
        <div class="columns">
          <!-- Dataset Select -->
          <div class="column control">
            <template>
              <section>
                <b-field label="Dataset">
                  <b-select placeholder="Select a name">
                    <option
                        v-for="option in options.dataset"
                        :value="option.id"
                        :key="option.id">
                      {{ option.name }}
                    </option>
                  </b-select>
                </b-field>
              </section>
            </template>
          </div>
          <!-- Environments Multi-select -->
          <div class="column control">
            <p class="has-text-dark has-text-weight-bold">
              Environment(s)
            </p>
            <template>
              <section>
                <div class="block">
                  <b-checkbox v-model="options.environments"
                              native-value="all">
                    All
                  </b-checkbox>
  <!--                <b-checkbox v-model="checkboxGroup"-->
  <!--                            native-value="Flint">-->
  <!--                  Environment Placeholder-->
  <!--                </b-checkbox>-->

                </div>
                <p class="content">
                  <b>Selection:</b>
                  {{ options.environments }}
                </p>
              </section>
            </template>
          </div>
          <!-- Timestamps Switch -->
          <div class="column control">
            <p class="has-text-dark has-text-weight-bold">
              With Timestamps?
            </p>
            <section>
              <b-field>
                <b-switch disabled v-model="options.includeTimestamps"
                          true-value="Yes"
                          false-value="No">
                  {{ options.includeTimestamps }}
                </b-switch>
              </b-field>
            </section>
          </div>
          <!-- File Format Radio -->
          <div class="column control">
            <p class="has-text-dark has-text-weight-bold">
              File Format
            </p>
            <template v-for="option in options.fileExtensionOptions">
              <div v-bind:key="option.id">
                <label
                    v-bind:key="option.id"
                    class="radio"
                >
                  <input
                      type="radio"
                      v-bind:name="optionType"
                      v-bind:value="option.id"
                      v-model="checked"
                      v-on:change="$emit('select-change', checked)"
                  >
                  {{option.name}}
                </label>
              </div>
            </template>
          </div>
        </div>
        <slot name="buttons"></slot>
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
export default class ExperimentObservationsExportModal extends Vue {
  @Prop()
  active!: boolean;
  @Prop()
  title!: string;
  @Prop()
  options!: object;  // Typed as string, but at runtime looks like: [{"name":".xls","id":"XLS"},{"name":".xlsx","id":"XLSX"},{"name":".csv","id":"CSV"}]

  private checked: string = "";

  private optionType = "optionType";
  private modalHeaderClass: string = "modal-header";
  private cardClass: string = "modal-card-lg";
  private bodyClass: string = "modal-card-body-lg";
  mounted(){
    this.checked = this.options.fileExtensionOptions;
    this.$emit('select-change', this.checked);
  }
}

</script>