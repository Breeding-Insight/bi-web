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

      <template v-slot:importPreviewTable="currentImport">
        <report-table
            v-bind:report="processPreviewData(currentImport.import)"
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

@Component({
  components: {
    ReportTable, ImportInfoTemplateMessageBox, ConfirmImportMessageBox, ImportTemplate, AlertTriangleIcon
  },
  data: () => ({ImportFormatter})
})
export default class ImportGermplasm extends ProgramsBase {

  // TODO: maybe move to config instead of hardcode?
  private germplasmImportTemplateName = 'GermplasmTemplateMap';
  private importConfig: any = {
    names: Object.assign(defaultRenames, {
      'defaultDisplayName': 'Name',
      'breedingMethod': 'Breeding Method',
      'seedSource': 'Source',
      'pedigree': 'Pedigree',
      'entryNumber': 'Entry No.'
    }),
    display: ['germplasm.additionalInfo.entryNumber','germplasm.defaultDisplayName',
      'germplasm.breedingMethod', 'germplasm.seedSource', 'germplasm.pedigree',],
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

  processPreviewData(currentImport: any): ReportStruct {
    // Do special germplasm import formatting here
    //TODO: Remove test data
    for (const i: number in currentImport.preview.rows) {
      currentImport.preview.rows[i] = {
        germplasm: {
          brAPIObject: {
            defaultDisplayName: currentImport.preview.rows[i].germplasm.brAPIObject.germplasmName,
            breedingMethod: i % 2 == 0 ? 'Biparental' : 'Open Pollination',
            seedSource: i % 2 == 0 ? 'Greenhouse' : 'Field',
            pedigree: i > 1 ? `${currentImport.preview.rows[i - 2].germplasm.brAPIObject.defaultDisplayName}/${currentImport.preview.rows[i - 1].germplasm.brAPIObject.defaultDisplayName}` : '',
            additionalInfo: {
              entryNumber: +i + 1
            }
          }
        }
      };
    }

    return ImportFormatter.format(currentImport.preview.rows, this.importConfig);
  }

}
</script>