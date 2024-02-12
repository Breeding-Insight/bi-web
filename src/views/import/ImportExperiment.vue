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
        v-bind:confirm-msg="'Preview Experimental Upload'"
        v-bind:import-type-name="'Experiments & Observations'"
        v-bind:confirm-import-state="confirmImportState"
        v-bind:user-input="experimentUserInput"
        v-bind:show-proceed-warning="showProceedDialog"
        v-on="$listeners"
        v-on:finished="importFinished"
        v-on:preview-data-loaded="previewDataLoaded"
        v-on:statistics-loaded="statisticsLoaded"
    >

      <template v-slot:importInfoTemplateMessageBox>
        <ImportInfoTemplateMessageBox v-bind:import-type-name="'Experiments & Observations'"
                                      v-bind:template-url="'https://cornell.box.com/shared/static/a7im2l2cjc7uydzhyb7ck9skxsp6jmc7.xls'"
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
                                 v-bind:show-loading-on-confirm="!showProceedDialog"
                                 v-on:abort="abort"
                                 v-on:confirm="confirm"
                                 class="mb-4">
          <div>
            <p>Review your experimental data import before committing to the database.</p>
          <div class = "left-confirm-column">
            <p class="is-size-5 mb-2"><strong>Import Summary</strong></p>
            Environments: {{ statistics.Environments.newObjectCount }}
            <br>Germplasm: {{ statistics.GIDs.newObjectCount }}
            <br>Observation Units: {{ statistics.Observation_Units.newObjectCount }}
          </div>
          <div id="experiment-summary" class ="right-confirm-column">
            <p class="is-size-5 mb-2"><strong>Experiment</strong></p>
            <template v-if="rows && rows.length > 0">
              Title: {{ rows[0].trial.brAPIObject.trialName }}
              <br>Description: {{ rows[0].trial.brAPIObject.trialDescription }}
              <br>Experimental Unit: {{ rows[0].trial.brAPIObject.additionalInfo.defaultObservationLevel }}
              <br>Type: {{ rows[0].trial.brAPIObject.additionalInfo.experimentType }}
              <br>Experimental Design: Externally generated
            </template>
            <template v-if="isExisting(rows)"><br>User: {{ rows[0].trial.brAPIObject.additionalInfo.createdBy.userName }}</template>
            <template v-if="isExisting(rows)"><br>Creation Date: {{ rows[0].trial.brAPIObject.additionalInfo.createdDate | dmy}}</template>
          </div>
          </div>
        </ConfirmImportMessageBox>
      </template>

      <template v-slot:userInput>
        <!-- TODO: change to use mutated observations count when api ready -->
        <form v-if="experimentUserInput.overwrite"
            class="new-form"
            novalidate="true"
        >
        <p class="is-size-5 has-text-weight-bold mb-0">Overwrite Request</p>
        {{ repeatObservationsCount }} values detected that repeat observations already saved to the system. If you
        do not want to overwrite existing observations you will need to edit the import file.
        <BasicInputField
            class="pb-2"
            v-model="experimentUserInput.overwriteReason"
            v-bind:field-name="'Reason for overwrite:'"
            v-bind:placeholder="'Reason'"
            v-bind:show-label="true"
        />
        </form>
      </template>

      <template v-slot:importPreviewTable="previewData">


        <ExpandableTable
            v-bind:records="previewData.import"
            v-bind:loading="false"
            v-bind:pagination="previewData.pagination"
            v-on:show-error-notification="$emit('show-error-notification', $event)"
            scrollable
        >
          <!-- Germplasm Name -->
          <b-table-column field="germplasmName" label="Germplasm Name" v-slot="props" :th-attrs="(column) => ({scope:'col'})"
          :td-attrs="(row, column) => ({class: 'db-filled'})">
            {{ getField(props.row.data.germplasm, 'germplasmName') }}
          </b-table-column>
          <!-- Germplasm GID -->
          <b-table-column field="germplasmGID" label="Germplasm GID" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ getField(props.row.data.germplasm, 'accessionNumber') }}
          </b-table-column>
          <!-- Test or Check -->
          <b-table-column field="testOrCheck" label="Test (T) or Check (C)" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ getField(props.row.data.observationUnit, 'observationUnitPosition.entryType') }}
          </b-table-column>
          <!-- Env -->
          <b-table-column field="env" label="Env" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ getField(props.row.data.study, 'studyName', true) }}
          </b-table-column>
          <!-- Env Location -->
          <b-table-column field="envLocation" label="Env Location" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ getField(props.row.data.location, 'name') }}
          </b-table-column>
          <!-- Env year -->
          <b-table-column field="envYear" label="Env Year" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ getField(props.row.data.study, 'additionalInfo.envYear') }}
          </b-table-column>
          <!-- Exp Unit ID -->
          <b-table-column field="expUnitID" label="Exp Unit ID" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ getField(props.row.data.observationUnit, 'observationUnitName', true) }}
          </b-table-column>
          <!-- Exp Replicate # -->
          <b-table-column field="expRepNo" label="Exp Replicate #" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ getObservationLevelRelationships(props.row.data.observationUnit, 'rep') }}
          </b-table-column>
          <!-- Exp Block # -->
          <b-table-column field="expBlockNo" label="Exp Block #" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ getObservationLevelRelationships(props.row.data.observationUnit, 'block') }}
          </b-table-column>
          <!-- Row -->
          <b-table-column field="row" label="Row" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ getField(props.row.data.observationUnit, 'observationUnitPosition.positionCoordinateX') }}
          </b-table-column>
          <!-- Column -->
          <b-table-column field="column" label="Column" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ getField(props.row.data.observationUnit, 'observationUnitPosition.positionCoordinateY') }}
          </b-table-column>
          <!-- Treatment Factors -->
          <b-table-column field="expTreatmentFactorName" label="Treatment Factors" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ getTreatment(props.row.data.observationUnit) }}
          </b-table-column>
          <!-- Dynamic Phenotype and Timestamp Columns -->
          <b-table-column v-for="(variable, index) in phenotypeColumns"
                          v-slot="props"
                          :key="variable"
                          :label="variable"
                          :th-attrs="(column) => ({scope:'col'})"
                          :td-attrs="cellClassIfExisting"
                          :meta="{'index': index}">
            <p> {{ retrieveDynamicColVal(props.row.data.observations, variable) }}</p>
          </b-table-column>

          <template v-slot:emptyMessage>
            <p class="has-text-weight-bold">
              No experiment data found in this import file.
            </p>
          </template>
        </ExpandableTable>
      </template>

    </ImportTemplate>
  </div>
</template>

<script lang="ts">
import {Component} from 'vue-property-decorator'
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import ImportInfoTemplateMessageBox from "@/components/file-import/ImportInfoTemplateMessageBox.vue";
import ConfirmImportMessageBox from "@/components/trait/ConfirmImportMessageBox.vue";
import ImportTemplate from "@/views/import/ImportTemplate.vue";
import {DataFormEventBusHandler} from "@/components/forms/DataFormEventBusHandler";
import {ImportFormatter} from "@/breeding-insight/model/report/ImportFormatter";
import {AlertTriangleIcon} from 'vue-feather-icons';
import BasicInputField from "@/components/forms/BasicInputField.vue";
import ExpandableTable from "@/components/tables/expandableTable/ExpandableTable.vue";
import {ImportObjectState} from "@/breeding-insight/model/import/ImportObjectState";
import {ExperimentUserInput} from "@/breeding-insight/model/ExperimentUserInput";

@Component({
  components: {
    ImportInfoTemplateMessageBox, ConfirmImportMessageBox, ImportTemplate, AlertTriangleIcon, BasicInputField, ExpandableTable
  },
  filters: {
    dmy: function(dateTime: String): String {
      return dateTime.split(' ')[0];
    }
  },
  data: () => ({ImportFormatter})
})
export default class ImportExperiment extends ProgramsBase {

  private experimentImportTemplateName = 'ExperimentsTemplateMap';
  private confirmImportState: DataFormEventBusHandler = new DataFormEventBusHandler();
  private phenotypeColumns?: Array<String> = [];
  private observationIndexMap: Map<number, number> = new Map();

  private experimentUserInput: ExperimentUserInput = new ExperimentUserInput();
  private repeatObservationsCount = 10;

  get showProceedDialog() {
    return this.experimentUserInput.overwrite;
  }

  getNumNewExperimentRecords(statistics: any): number | undefined {
    return undefined;
  }

  getField(importReturnObject: any, fieldAccessor: string, isRemovingUnique: boolean=false) {
    const accessors: string[] = fieldAccessor.split('.');
    const brapiObject = importReturnObject.brAPIObject;
    let currObject = brapiObject;
    while (accessors.length > 0) {
      // Get highest accessor
      const accessor: string | undefined = accessors.shift();
      if (!accessor) return '';
      // Check if accessor exists, or is last element
      if (!currObject[accessor]) {
        return '';
      } else if (accessors.length == 0) {
        let value = currObject[accessor];
        if(isRemovingUnique){
          value = this.removeUnique(value);
        }
        return value;
      } else {
        currObject = currObject[accessor];
      }
    }
    return undefined;
  }

  getEnvYear(importReturnObject: any) {
    const years: String[] = this.getField(importReturnObject, 'seasons');
    if( years && years.length > 0 ) {
      return years[0];
    }
    return undefined;
  }

  getTreatment(importReturnObject: any){
    const treatments: any[] = this.getField(importReturnObject, 'treatments');
    if( treatments && treatments.length > 0 ) {
      const treatment = treatments[0];
      const factor = treatment["factor"];
      return factor;
    }
    return undefined;
  }

  getObservationLevelRelationships(importReturnObject: any, levelName: String) {
    const relationships: any[] = this.getField(importReturnObject, 'observationUnitPosition.observationLevelRelationships');
    if( relationships  ) {
      for(let rel of relationships){
        if (levelName == rel["levelName"]){
          return rel["levelCode"];
        }
      }
    }
    return undefined;
  }

  importFinished(){}

  previewDataLoaded(dynamicColumns: String[]) {
    this.phenotypeColumns = dynamicColumns;
    this.createObservationIndexMap();
  }

  // Map phenotypeColumn indices to brapi observation indices for use in highlighting
  createObservationIndexMap() {
    let obs_index = 0;
    // this assumes that any timestamp for an ontology immediately follows the ontology
    let is_first_obs = true;
    for (let i=0; i < this.phenotypeColumns!.length; i++) {
      if (!this.phenotypeColumns![i].startsWith('TS:')) {
        if( ! is_first_obs ){
          obs_index++;
        }
        is_first_obs = false;
      }
      this.observationIndexMap.set(i, obs_index);
    }
  }

  statisticsLoaded(statistics: any) {
    // TODO: change to appropriate fields once api is ready
    this.experimentUserInput.overwrite = statistics.Mutated_Observations.newObjectCount > 0
    this.repeatObservationsCount = statistics.Mutated_Observations.newObjectCount;
  }

  isExisting(rows: any[]) {
    return rows.length && rows[0].trial.state === ImportObjectState.EXISTING;
  }

  retrieveDynamicColVal(importReturnObject: any, column: string){
    //console.log(importReturnObject);
    if (column.startsWith('TS:')) {
      //Is timestamp
      return importReturnObject.filter((observation: { brAPIObject: { observationVariableName: string; }; }) => observation.brAPIObject.observationVariableName === column.replace(/TS:\s*/,""))[0].brAPIObject.observationTimeStamp;
    } else {
      //Is phenotype observation
      return importReturnObject.filter((observation: { brAPIObject: { observationVariableName: string; }; }) => observation.brAPIObject.observationVariableName === column)[0].brAPIObject.value
    }
  }

  cellClassIfExisting(row: any, column: any) {
    const index = column.meta.index

    if(row.data.observations[this.observationIndexMap.get(index)!].state === 'MUTATED') {
      return {'class': 'db-filled'};
    }
    return {};
  }

  /*
   * remove the '[....]' found at the end of the string
   * */
  removeUnique(str: string|undefined): string {
    if(!str){ return "";}
    str = str.trim();
    const reg = /\[[^\]]*\]$/;
    return str.replace(reg, '').trim();
  }
}
</script>