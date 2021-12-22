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
    <ImportTemplate
        v-bind:abort-msg="'No germplasm records will be added, and the import in progress will be completely removed.'"
        v-bind:system-import-template-name="germplasmImportTemplateName"
        v-bind:confirm-msg="'Confirm New Germplasm Records'"
        v-bind:import-type-name="'Germplasm'"
        v-bind:confirm-import-state="confirmImportState"
        v-bind:userInput="germplasmList"
        v-on="$listeners"
        v-on:finished="importFinished"
    >

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

      <template v-slot:userInput>
        <form
            class="new-form"
            novalidate="true"
        >
          <p>The following information is required in order to keep a record of your import history.</p>
          <div class="columns">
            <div class="column is-one-quarter">
              <BasicInputField
                  v-model="germplasmList.germplasmListName"
                  v-bind:field-name="'Import Group Name'"
                  v-bind:field-help="'The name of this group of germplasm. It must be unique within your program.'"
              />
            </div>
            <div class="column is-three-quarters">
              <BasicInputField
                  v-model="germplasmList.germplasmListDescription"
                  v-bind:field-name="'Import Group Description'"
                  v-bind:field-help="'The description of this group of germplasm. This field is optional.'"
              />
            </div>
          </div>
        </form>
      </template>

      <template v-slot:confirmImportMessageBox="{ statistics, abort, confirm, rows }">
        <ConfirmImportMessageBox v-bind:num-records="getNumNewGermplasmRecords(statistics)"
                                 v-bind:import-type-name="'Germplasm'"
                                 v-bind:confirm-import-state="confirmImportState"
                                 v-on:abort="abort"
                                 v-on:confirm="confirm"
                                 class="mb-4">
          <div>
            <p class="is-size-5 mb-2"><strong>Import Summary</strong></p>
            <p>Total number of entries: {{ rows.length }}</p>
            <p>New Germplasm count: {{ statistics.Germplasm.newObjectCount }}</p>
            <p>New Pedigree Connections: {{ statistics["Pedigree Connections"].newObjectCount }}</p>
            <p>Potential duplicate Germplasm records are highlighted in yellow and show a <alert-triangle-icon size="1.2x" class="icon-align"/> icon.
              These records will be imported as new germplasm.</p>
          </div>
        </ConfirmImportMessageBox>
      </template>

      <template v-slot:importPreviewTable="previewData">
        <report-table
            v-bind:report="processPreviewData(previewData.import)"
            v-bind:config="importConfig"
            detailed
            paginated
        />
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
import defaultRenames from '@/config/report/ReportRenames';
import { AlertTriangleIcon } from 'vue-feather-icons';
import {GermplasmList} from "@/breeding-insight/model/GermplasmList";
import BasicInputField from "@/components/forms/BasicInputField.vue";

@Component({
  components: {
    ReportTable, ImportInfoTemplateMessageBox, ConfirmImportMessageBox, ImportTemplate, AlertTriangleIcon, BasicInputField
  },
  data: () => ({ImportFormatter})
})
export default class ImportGermplasm extends ProgramsBase {

  private germplasmList: GermplasmList = new GermplasmList();

  // TODO: maybe move to config instead of hardcode?
  private germplasmImportTemplateName = 'GermplasmTemplateMap';
  private importConfig: any = {
    names: Object.assign(defaultRenames, {
      'defaultDisplayName': 'Name',
      'breedingMethod': 'Breeding Method',
      'seedSource': 'Source',
      'pedigree': 'Pedigree',
      'importEntryNumber': 'Entry No.'
    }),
    display: ['germplasm.additionalInfo.importEntryNumber','germplasm.defaultDisplayName',
      'germplasm.additionalInfo.breedingMethod', 'germplasm.seedSource', 'germplasm.pedigree'],
    detailDisplay: '*',
    defaultSort: 'germplasm.germplasmName',
    defaultSortOrder: 'asc'
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

  processPreviewData(previewData: any): ReportStruct {
    // Do special germplasm import formatting here
    return ImportFormatter.format(previewData, this.importConfig);
  }

  importFinished() {
    this.germplasmList = new GermplasmList();
  }
}
</script>