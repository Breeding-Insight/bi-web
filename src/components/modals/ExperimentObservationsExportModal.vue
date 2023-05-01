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
      <div class="columns">
        <!-- Dataset Select -->
        <div class="column control">
          <div class="field">
            <label
              class="label"
              for="dataset"
            >Dataset</label>
            <div class="control">
              <div class="select">
                <select id="dataset">
                  <option
                    v-for="option in datasetOptions"
                    v-bind:key="option.id"
                    v-bind:value="option.id"
                  >
                    {{ option.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <!-- Environments Multi-select -->
        <div class="column control">
          <fieldset class="field">
            <legend class="label">
              Environment(s)
            </legend>
            <div
              v-for="option in environmentOptions"
              v-bind:key="option.id"
              class="control"
            >
              <b-checkbox
                v-model="exportOptions.environments"
                :native-value="option.id"
              >
                {{ option.name }}
              </b-checkbox>
            </div>
          </fieldset>
        </div>
        <!-- Timestamps Switch -->
        <div class="column control">
          <label
            class="label"
            for="timestamps-switch"
          >With{{ '\xa0' }}Timestamps?</label>
          <div class="field">
            <label
              class="switch is-rounded"
            ><input
               id="timestamps-switch"
               v-model="exportOptions.includeTimestamps"
               aria-label="Include Timestamps?"
               type="checkbox"
               true-value="Yes"
               false-value="No"
             ><span class="check" />
              <span class="control-label">{{ exportOptions.includeTimestamps }}</span>
            </label>
          </div>
        </div>
        <!-- File Format Radio -->
        <div class="column control">
          <fieldset>
            <legend class="label">
              File{{ '\xa0' }}Format
            </legend>
            <div
              v-for="option in fileExtensionOptions"
              v-bind:key="option.id"
            >
              <b-radio
                v-model="exportOptions.fileExtension"
                :native-value="option.id"
              >
                {{ option.name }}
              </b-radio>
            </div>
          </fieldset>
        </div>
      </div>
      <slot name="buttons" />
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BaseModal from '@/components/modals/BaseModal.vue';
import {FileType} from "@/breeding-insight/model/FileType";
import {ExperimentDatasetOption} from "@/breeding-insight/model/ExperimentDatasetOption";
import {EnvironmentOption} from "@/breeding-insight/model/EnvironmentOption";
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
  exportOptions!: ExperimentExportOptions;

  private fileExtensionOptions: object[] = Object.values(FileType);
  private datasetOptions: object[] = Object.values(ExperimentDatasetOption);
  private environmentOptions: object[] = Object.values(EnvironmentOption);

  private optionType = "optionType";
  private modalHeaderClass: string = "modal-header";

}

</script>