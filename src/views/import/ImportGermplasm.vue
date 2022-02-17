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
                                      v-bind:template-url="'https://cornell.box.com/shared/static/z305olf7o3f0suoxduase05yywr9keid'"
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
                  v-bind:field-name="'List Name'"
                  v-bind:field-help="'The name of this group of germplasm. It must be unique within your program.'"
              />
            </div>
            <div class="column is-three-quarters">
              <BasicInputField
                  v-model="germplasmList.germplasmListDescription"
                  v-bind:field-name="'List Description'"
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
            <template v-if="duplicatesPresent(rows)">
              <p>Duplicate names detected and are highlighted in yellow and show a <alert-triangle-icon size="1.2x" class="icon-align"/> icon.
                Upon import duplicates will become independent database entries.</p>
            </template>

          </div>
        </ConfirmImportMessageBox>
      </template>

      <template v-slot:importPreviewTable="previewData">
        <ExpandableTable
            v-bind:records="processPreviewData(previewData.import)"
            v-bind:loading="false"
            v-bind:pagination="previewData.pagination"
            v-bind:rowClasses="constructRowClasses(previewData.import)"
            v-on:show-error-notification="$emit('show-error-notification', $event)"
        >
          <b-table-column field="defaultDisplayName" label="Name" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            <AlertTriangleIcon
                size="1x"
                class="has-vertical-align-middle"
                v-if="props.row.data.state === ImportObjectState.EXISTING"
            >
            </AlertTriangleIcon>
            {{ props.row.data.brAPIObject.defaultDisplayName }}
          </b-table-column>
          <b-table-column field="breedingMethod" label="Breeding Method" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.brAPIObject.additionalInfo.breedingMethod }}
          </b-table-column>
          <b-table-column field="seedSource" label="Source" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.brAPIObject.seedSource }}
          </b-table-column>
          <b-table-column field="pedigree" label="Pedigree" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.brAPIObject.pedigree }}
          </b-table-column>
          <b-table-column field="importEntryNumber" label="Entry No." v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.brAPIObject.additionalInfo.importEntryNumber }}
          </b-table-column>

          <template v-slot:emptyMessage>
            <p class="has-text-weight-bold">
              No germplasm were found in this import file.
            </p>
          </template>
        </ExpandableTable>
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
import { AlertTriangleIcon } from 'vue-feather-icons';
import {GermplasmList} from "@/breeding-insight/model/GermplasmList";
import BasicInputField from "@/components/forms/BasicInputField.vue";
import ExpandableTable from "@/components/tables/expandableTable/ExpandableTable.vue";
import {ImportObjectState} from "@/breeding-insight/model/import/ImportObjectState";

@Component({
  components: {
    ExpandableTable, ImportInfoTemplateMessageBox, ConfirmImportMessageBox, ImportTemplate, AlertTriangleIcon, BasicInputField
  },
  data: () => ({ImportObjectState})
})
export default class ImportGermplasm extends ProgramsBase {

  private germplasmList: GermplasmList = new GermplasmList();
  private duplicateClassName = "is-dup";
  private germplasmImportTemplateName = 'GermplasmTemplateMap';

  private confirmImportState: DataFormEventBusHandler = new DataFormEventBusHandler();

  getNumNewGermplasmRecords(statistics: any): number | undefined {
    if (statistics.Germplasm) {
      if (statistics.Germplasm.newObjectCount !== undefined) {
        return statistics.Germplasm.newObjectCount;
      }
    }
    return undefined;
  }

  processPreviewData(importPreviewRows: any): any[] {
    // Do special germplasm import formatting here
    return importPreviewRows.map((record:any) => record.germplasm);
  }

  constructRowClasses(importPreviewRows: any): any[] {
    // Do special germplasm import formatting here
    const rowClasses: any = {};
    for (const record of this.processPreviewData(importPreviewRows)) {
      if (record.state === ImportObjectState.EXISTING) {
        rowClasses[record.id] = this.duplicateClassName;
      }
    }
    return rowClasses;
  }

  duplicatesPresent(rows: any[]) {
    // TODO: If we paginate the import, this probably won't work anymore
    if (rows) {
      for (const row of rows) {
        if (row.germplasm.state === ImportObjectState.EXISTING) {
          return true;
        }
      }
    }
    return false;
  }

  importFinished() {
    this.germplasmList = new GermplasmList();
  }
}
</script>