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
  <div id="import-experiment">
    <ImportTemplate
        v-bind:abort-msg="'No records will be added, and the import in progress will be completely removed.'"
        v-bind:system-import-template-name="experimentImportTemplateName"
        v-bind:confirm-msg="'Confirm New Experiments & Observations Records'"
        v-bind:import-type-name="'Experiments & Observations'"
        v-bind:confirm-import-state="confirmImportState"
        v-on="$listeners"
        v-on:finished="importFinished"
    >

      <template v-slot:importInfoTemplateMessageBox>
        <ImportInfoTemplateMessageBox v-bind:import-type-name="'Experiments & Observations'"
                                      v-bind:template-url="'https://cornell.box.com/shared/static/ecmwixiwp5wl3cjq493hvhi4agq03cyh.xls'"
                                      class="mb-5">
          <strong>Before You Import...</strong>
          <br/>
          Experimental germplasm and ontology terms must be created in the system before experiments can be created via import.
          See the import template for more information about data requirements. Importing phenotypic
          observations into existing experiments requires only Observation Unit IDs
          to match with the experimental design.
        </ImportInfoTemplateMessageBox>
      </template>

      <template v-slot:confirmImportMessageBox="{ statistics, abort, confirm, rows }">
        <ConfirmImportMessageBox v-bind:num-records="getNumNewExperimentRecords(statistics)"
                                 v-bind:import-type-name="'Experiments & Observations'"
                                 v-bind:confirm-import-state="confirmImportState"
                                 v-on:abort="abort"
                                 v-on:confirm="confirm"
                                 class="mb-4">
          <div>
            <p class="is-size-5 mb-2"><strong>Import Summary</strong></p>
            <p>Total number of entries: {{ rows.length }}</p>
          </div>
        </ConfirmImportMessageBox>
      </template>

      <template v-slot:importPreviewTable="previewData">
      </template>

    </ImportTemplate>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import ImportInfoTemplateMessageBox from "@/components/file-import/ImportInfoTemplateMessageBox.vue";
import ConfirmImportMessageBox from "@/components/trait/ConfirmImportMessageBox.vue";
import ImportTemplate from "@/views/import/ImportTemplate.vue";
import {DataFormEventBusHandler} from "@/components/forms/DataFormEventBusHandler";
import ReportTable from "@/components/report/ReportTable.vue";
import {ImportFormatter} from "@/breeding-insight/model/report/ImportFormatter";
import {ReportStruct} from "@/breeding-insight/model/report/ReportStruct";
import defaultRenames from '@/config/report/ReportRenames';
import { AlertTriangleIcon } from 'vue-feather-icons';
import {GermplasmList} from "@/breeding-insight/model/GermplasmList";
import BasicInputField from "@/components/forms/BasicInputField.vue";

@Component({
  components: {
    ImportInfoTemplateMessageBox, ConfirmImportMessageBox, ImportTemplate, AlertTriangleIcon, BasicInputField
  },
  data: () => ({ImportFormatter})
})
export default class ImportExperiment extends ProgramsBase {

  private experimentImportTemplateName = 'ExperimentsTemplateMap';
  private confirmImportState: DataFormEventBusHandler = new DataFormEventBusHandler();

  private germplasmList: GermplasmList = new GermplasmList();


  getNumNewExperimentRecords(statistics: any): number | undefined {
    return undefined;
  }

  importFinished(){}

}
</script>