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
  <div id="import-germplasm">
    <ImportTemplate v-bind:abort-msg="'No germplasm records will be added, and the import in progress will be completely removed.'"
                    v-bind:system-import-template-name="germplasmImportTemplateName"
                    v-bind:confirm-msg="'Confirm New Germplasm Records'"
                    v-bind:import-type-name="'Germplasm'"
                    v-bind:confirm-import-state="confirmImportState"
                    v-on="$listeners">

      <template v-slot:importInfoTemplateMessageBox>
        <ImportInfoTemplateMessageBox v-bind:import-type-name="'Germplasm'"
                                      v-bind:template-url="'https://cornell.box.com/shared/static/kv3l900otsea9zm3iowp7e9umpcjvsck.xls'"
                                      class="mb-5">
          <strong>Before You Import...</strong>
          <br/>
          Any file containing germplasm names, breeding methods, and sources can be imported regardless of header format.
          The system provides guidance for matching file column headers to their appropriate database location.
          If you use the headers specified in the import template, matching will be automatic.
          Any germplasm detail (attribute or passport information) not specified in the template can be added to the
          database via customized matching in the upcoming step.
        </ImportInfoTemplateMessageBox>
      </template>

      <template v-slot:confirmImportMessageBox="{ statistics, abort, confirm }">
        <ConfirmImportMessageBox v-bind:num-records="getNumNewGermplasmRecords(statistics)"
                                 v-bind:import-type-name="'Germplasm'"
                                 v-bind:confirm-import-state="confirmImportState"
                                 v-on:abort="abort"
                                 v-on:confirm="confirm"
                                 class="mb-4"/>
      </template>

      <template v-slot:importPreviewTable="previewData">
        <!-- TODO: Replace tree-view when table is ready -->
        <report-table
            v-bind:report="processPreviewData(previewData.previewData)"
            v-bind:config="importTableConfigv2"
            detailed
        />
        <tree-view v-bind:data="previewData.previewData" v-bind:options="{maxDepth: 0}"></tree-view>
      </template>

    </ImportTemplate>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import ImportInfoTemplateMessageBox from "@/components/file-import/ImportInfoTemplateMessageBox.vue";
import ConfirmImportMessageBox from "@/components/trait/ConfirmImportMessageBox.vue";
import ImportTemplate from "@/views/import/ImportTemplate.vue";
import {DataFormEventBusHandler} from "@/components/forms/DataFormEventBusHandler";
import ReportTable from "@/components/report/ReportTable.vue";
import {ImportFormatter} from "@/breeding-insight/model/report/ImportFormatter";
import {ReportStruct} from "@/breeding-insight/model/report/ReportStruct";

@Component({
  components: {
    ReportTable, ImportInfoTemplateMessageBox, ConfirmImportMessageBox, ImportTemplate
  },
  data: () => ({ImportFormatter})
})
export default class ImportGermplasm extends ProgramsBase {

  // TODO: maybe move to config instead of hardcode?
  private germplasmImportTemplateName = 'GermplasmTemplateMap';
  private importTableConfig: any = [
    {field: 'germplasm.germplasmName', displayName: 'Germplasm Name'},
    {field: 'germplasm.externalReferences', displayName: 'External References'},
    {field: 'germplasm.additionalInfo.programId', displayName: 'Program ID'},
    {field: 'germplasm.commonCropName', displayName: 'Species'},
    {field: 'germplasm.seasons', displayName: 'Seasons'}
  ];
  private importTableConfigv2: any = {
    names: {
      'additionalInfo.programId': 'Program ID',
    },
    display: ['germplasm.germplasmName', 'germplasm.externalReferences', 'germplasm.additionalInfo.programId', 'germplasm.commonCropName', 'germplasm.seasons'],
    visible: [],
    detailDisplay: '*'
  }

  private confirmImportState: DataFormEventBusHandler = new DataFormEventBusHandler();

  getNumNewGermplasmRecords(statistics: any): number | undefined {
    if (statistics.Germplasm) {
      if (statistics.Germplasm.newObjectCount !== undefined) {
        return statistics.Germplasm.newObjectCount;
      }
    }
    return undefined;
  }

  processPreviewData(previewData: any[]): ReportStruct {
    // Do special germplasm import formatting here

    return ImportFormatter.format(previewData, this.importTableConfigv2);
  }

}
</script>