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
  <div id="import-sample">
    <ImportTemplate
        v-bind:abort-msg="'No records will be added, and the import in progress will be completely removed.'"
        v-bind:system-import-template-name="importTemplateName"
        v-bind:confirm-msg="'Preview Sample Upload'"
        v-bind:import-type-name="'Genotype Sample Submission'"
        v-bind:confirm-import-state="confirmImportState"
        v-bind:userInput="submission"
        v-on="$listeners"
        v-on:finished="importFinished"
        v-on:preview-data-loaded="previewDataLoaded"
    >
      <template v-slot:importInfoTemplateMessageBox>
        <article class="message is-info">
          <div class="message-body">
            <div class="columns is-vcentered">
              <div class="column">
                <div class="has-text-dark">
                  <strong>Before You Import...</strong>
                  <br/>
                  Ensure that GIDs are valid
                </div>
              </div>
              <div class="column is-narrow">
                <div class="has-text-dark has-text-centered is-size-7">
                  <button class="button is-outlined is-primary" :id="'download-sample-template'" v-on:click="generateTemplate()">Download the Sample Import Template</button>
                  <br/>
                </div>
              </div>
            </div>
          </div>
        </article>
      </template>

      <template v-slot:confirmImportMessageBox="{ statistics, abort, confirm, rows }">
        <ConfirmImportMessageBox v-bind:num-records="statistics['Samples'].newObjectCount"
                                 v-bind:import-type-name="'Samples'"
                                 v-bind:confirm-import-state="confirmImportState"
                                 v-on:abort="abort"
                                 v-on:confirm="confirm"
                                 class="mb-4">
          <div>
            <p class="is-size-5 mb-2"><strong>Import Summary</strong></p>
            <p>Total number of entries: {{ rows.length }}</p>
            <p>New Plate count: {{ statistics["Plates"].newObjectCount }}</p>
            <p>New Samples: {{ statistics["Samples"].newObjectCount }}</p>
          </div>
        </ConfirmImportMessageBox>
      </template>

      <template v-slot:userInput>
        <form
            class="new-form"
            novalidate="true"
        >
          <p>Please provide a name for your sample submission</p>
          <div class="columns">
            <div class="column">
              <BasicInputField
                  v-model="submission.submissionName"
                  v-bind:field-name="'Submission Name'"
                  v-bind:field-help="'The name of this submission'"
              />
            </div>
          </div>
        </form>
      </template>

      <template v-slot:importPreviewTable="previewData">
        <ExpandableTable
            v-bind:records="previewData.import"
            v-bind:loading="false"
            v-bind:pagination="previewData.pagination"
            v-on:show-error-notification="$emit('show-error-notification', $event)"
            v-bind:is-show-all-enabled="false"
        >
          <b-table-column field="sample.brAPIObject.plateName" label="PlateID" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.sample.brAPIObject.plateName }}
          </b-table-column>
          <b-table-column field="sample.brAPIObject.row" label="Row" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.sample.brAPIObject.row }}
          </b-table-column>
          <b-table-column field="sample.brAPIObject.column" label="Column" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.sample.brAPIObject.column }}
          </b-table-column>
          <b-table-column field="sample.brAPIObject.additionalInfo.organism" label="Organism" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.sample.brAPIObject.additionalInfo.organism }}
          </b-table-column>
          <b-table-column field="sample.brAPIObject.additionalInfo.species" label="Species" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.sample.brAPIObject.additionalInfo.species }}
          </b-table-column>
          <b-table-column field="sample.brAPIObject.additionalInfo.gid" label="GID" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.sample.brAPIObject.additionalInfo.gid }}
          </b-table-column>
          <b-table-column field="sample.brAPIObject.additionalInfo.germplasmName" label="Germplasm Name" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.sample.brAPIObject.additionalInfo.germplasmName }}
          </b-table-column>
          <b-table-column field="sample.brAPIObject.additionalInfo.obsUnitID" label="ObsUnitID" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.sample.brAPIObject.additionalInfo.obsUnitID }}
          </b-table-column>
          <b-table-column field="sample.brAPIObject.tissueType" label="Tissue" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.sample.brAPIObject.tissueType }}
          </b-table-column>
          <b-table-column field="sample.brAPIObject.sampleDescription" label="Comment" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.sample.brAPIObject.sampleDescription }}
          </b-table-column>
          <template v-slot:emptyMessage>
            <p class="has-text-weight-bold">
              No samples were found in this import file.
            </p>
          </template>
        </ExpandableTable>
      </template>
    </ImportTemplate>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import ProgramsBase from '@/components/program/ProgramsBase.vue';
import { DataFormEventBusHandler } from '@/components/forms/DataFormEventBusHandler';
import { mapGetters } from 'vuex';
import { Program } from '@/breeding-insight/model/Program';
import { ImportResponse } from '@/breeding-insight/model/import/ImportResponse';
import * as XLSX from 'xlsx';
import ImportTemplate from '@/views/import/ImportTemplate.vue';
import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
import ConfirmImportMessageBox from '@/components/trait/ConfirmImportMessageBox.vue';
import BasicInputField from '@/components/forms/BasicInputField.vue';

@Component({
  components: {
    BasicInputField,
    ConfirmImportMessageBox,
    ExpandableTable,
    ImportTemplate
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ImportSample extends ProgramsBase {
  private activeProgram?: Program;
  private confirmImportState: DataFormEventBusHandler = new DataFormEventBusHandler();
  private currentImport?: ImportResponse = new ImportResponse({});
  private importTemplateName = 'SampleImport';
  private submission = {
    submissionName: ''
  }

  generateTemplate() {
    let heading = [[
      'PlateID',
      'Row',
      'Column',
      'Organism',
      'Species',
      'Germplasm Name',
      'GID',
      'ObsUnitID',
      'Tissue',
      'Comment'
    ]];

    //Had to create a new workbook and then add the header
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(ws, heading);

    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    XLSX.writeFile(wb, 'sample-submission-template.xlsx');
  }

  importFinished(){}

  previewDataLoaded(dynamicColumns: String[]) {
  }
}
</script>

<style scoped>
.file-selector {
  padding-top: 30px;
}
</style>
