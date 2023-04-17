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
    v-bind:card-class="cardClass"
    v-bind:body-class="bodyClass"
    v-bind:active.sync="active"
    v-on:deactivate="$emit('deactivate')"
  >
    <div>
      <div>
        <article class="media">
          <div class="media-content">
            <div class="content">
              <h3
                class="is-5 title"
                :class="modalHeaderClass"
              >
                {{ title }}
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
                  <b-select
                    v-model="options.dataset"
                    placeholder="Select a name"
                  >
                    <option
                      v-for="option in datasetOptions"
                      :key="option.id"
                      :value="option.id"
                    >
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
            <template v-for="option in environmentOptions">
              <b-field v-bind:key="option.id">
                <b-checkbox
                  v-model="options.environments"
                  :native-value="option.id"
                >
                  {{ option.name }}
                </b-checkbox>
              </b-field>
            </template>
          </div>
          <!-- Timestamps Switch -->
          <div class="column control">
            <p class="has-text-dark has-text-weight-bold">
              With Timestamps?
            </p>
            <section>
              <b-field>
                <b-switch
                  v-model="options.includeTimestamps"
                  disabled="true"
                  true-value="Yes"
                  false-value="No"
                >
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
            <template v-for="option in fileExtensionOptions">
              <div v-bind:key="option.id">
                <b-radio
                  v-model="options.fileExtension"
                  :native-value="option.id"
                >
                  {{ option.name }}
                </b-radio>
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
import {FileType} from "@/breeding-insight/model/FileType";
import {ExperimentObservationsDataset} from "@/breeding-insight/model/ExperimentObservationsDataset";
import {ExperimentEnvironment} from "@/breeding-insight/model/ExperimentEnvironment";
import {ExperimentExportOptions} from "@/breeding-insight/model/ExperimentExportOptions";

@Component({
  components: {BaseModal}
})
export default class ExperimentObservationsExportModal extends Vue {
  @Prop()
  active!: boolean;
  @Prop()
  title!: string;
  @Prop()
  options!: ExperimentExportOptions;

  private fileExtensionOptions: object[] = Object.values(FileType);
  private datasetOptions: object[] = Object.values(ExperimentObservationsDataset);
  private environmentOptions: object[] = Object.values(ExperimentEnvironment);

  private optionType = "optionType";
  private modalHeaderClass: string = "modal-header";
  private cardClass: string = "modal-card-lg";
  private bodyClass: string = "modal-card-body-lg";

}

</script>