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
  <div id="data_set">
    <div v-if="loading">
      <ProgressBar
          v-bind:label="'loading dataset'"
      />
    </div>
    <div v-if="!loading">
      <article
          class="message is-success"
      >
        <div class="message-body">
          <div class="columns is-multiline">
            <div class="column is-one-third">
              <div class="has-text-right">
                <b>Observation unit: </b> <span style="width: 30px;"
                                                class="is-inline-block has-text-left">{{ observationUnit }}</span><br>
                <b>Phenotypes: </b> <span style="width: 30px;" class="is-inline-block has-text-left">{{
                  phenotypesCount
                }}</span><br>
                <b>Total observations: </b> <span style="width: 30px;" class="is-inline-block has-text-left">{{
                  totalObservationsCount
                }}</span><br>
                <b>Observations with data: </b> <span style="width: 30px;" class="is-inline-block has-text-left">{{
                  observationsWithData
                }}</span><br>
                <b>Observations without data: </b> <span style="width: 30px;" class="is-inline-block has-text-left">{{
                  observationsWithoutData
                }}</span><br>
              </div>
            </div>
          </div>
        </div>
      </article>
      <ExpandableTable
          scrollable
          v-bind:records.sync="datasetTableRows"
          v-bind:loading=false
          v-bind:pagination="paginationController"
          v-bind:default-sort="['data.germplasmName', 'asc']"
          v-bind:debounce-search="400"
          v-on:show-error-notification="$emit('show-error-notification', $event)"
      >
        <b-table-column
            v-slot="props"
            field="data.germplasmName"
            label="Germplasm Name"
            sortable
            searchable
            :th-attrs="() => ({scope:'col'})"
        >
          {{ props.row.data.germplasmName }}
        </b-table-column>
        <b-table-column
            v-slot="props"
            field="data.gid"
            :custom-sort="sortGID"
            label="GID"
            sortable
            searchable
            :th-attrs="() => ({scope:'col'})"
        >
          {{ props.row.data.gid }}
        </b-table-column>
        <b-table-column
          v-slot="props"
          field="data.testOrCheck"
          label="Test(T) or Check (C)
"
          sortable
          searchable
          :th-attrs="() => ({scope:'col'})"
      >
        {{ props.row.data.testOrCheck }}
      </b-table-column>
        <b-table-column
            v-slot="props"
            field="data.env"
            label="Env"
            sortable
            searchable
            :th-attrs="() => ({scope:'col'})"
        >
          {{ props.row.data.env }}
        </b-table-column>
        <b-table-column
            v-slot="props"
            field="data.envLocation"
            label="Env Location"
            sortable
            searchable
            :th-attrs="() => ({scope:'col'})"
        >
          {{ props.row.data.envLocation }}
        </b-table-column>
        <b-table-column
            v-slot="props"
            field="data.envYear"
            label="Env Year"
            sortable
            searchable
            :th-attrs="() => ({scope:'col'})"
        >
          {{ props.row.data.envYear }}
        </b-table-column>
        <b-table-column
            v-slot="props"
            field="data.expUnitId"
            label="Exp Unit ID"
            sortable
            searchable
            :th-attrs="() => ({scope:'col'})"
        >
          {{ props.row.data.expUnitId }}
        </b-table-column>
        <b-table-column
            v-slot="props"
            field="data.expReplicate"
            label="Exp Replicate #"
            sortable
            searchable
            :th-attrs="() => ({scope:'col'})"
        >
          {{ props.row.data.expReplicate }}
        </b-table-column>
        <b-table-column
            v-slot="props"
            field="data.expBlock"
            label="Exp Block #"
            sortable
            searchable
            :th-attrs="() => ({scope:'col'})"
        >
          {{ props.row.data.expBlock }}
        </b-table-column>
        <b-table-column
            v-slot="props"
            field="data.row"
            label="Row"
            sortable
            searchable
            :th-attrs="() => ({scope:'col'})"
        >
          {{ props.row.data.row }}
        </b-table-column>
        <b-table-column
            v-slot="props"
            field="data.column"
            label="Column"
            sortable
            searchable
            :th-attrs="() => ({scope:'col'})"
        >
          {{ props.row.data.column }}
        </b-table-column>

        <b-table-column
            v-slot="props"
            field="data.treatmentFactors"
            label="Treatment Factors"
            sortable
            searchable
            :th-attrs="() => ({scope:'col'})"
        >
          {{ props.row.data.treatmentFactors }}
        </b-table-column>


        <b-table-column
            v-slot="props"
            field="data.obsUnitId"
            label="ObsUnitID"
            sortable
            searchable
            :th-attrs="() => ({scope:'col'})"
        >
          {{ props.row.data.obsUnitId }}
        </b-table-column>

        <b-table-column
            v-for="( observationVariable, index ) in this.datasetModel.observationVariables" :key="observationVariable.observationVariableName"
            v-slot="props"
            :custom-sort="(a,b,isAsc) => sortObservations(index, a, b, isAsc)"
            :custom-search="(propsRow, filterString) => filterByObservations(index, propsRow, filterString)"
            :field="observationVariable.observationVariableName"
            :label="removeUnique( observationVariable.observationVariableName )"
            sortable
            searchable
            :th-attrs="(column) => ({scope:'col'})"
            :td-attrs="cellClassIfEmpty"
            :meta="{'index': index}"
        >
            {{ props.row.data.traitValues[index] }}
        </b-table-column>
        <template v-slot:emptyMessage>
          <p class="has-text-weight-bold">
            No datasets exist.
          </p>
        </template>
      </ExpandableTable>
    </div>
  </div>
</template>


<script lang="ts">
import {Component, Prop, Watch} from 'vue-property-decorator'
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import {Result} from "@/breeding-insight/model/Result";
import {DatasetModel} from "@/breeding-insight/model/DatasetModel";
import {ExperimentService} from "@/breeding-insight/service/ExperimentService";
import {Program} from "@/breeding-insight/model/Program";
import {mapGetters} from "vuex";
import {ObservationUnit} from "@/breeding-insight/model/ObservationUnit";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import ExpandableTable from "@/components/tables/expandableTable/ExpandableTable.vue";
import {BrAPIUtils} from "@/breeding-insight/utils/BrAPIUtils";
import {DatasetTableRow} from "@/breeding-insight/model/DatasetTableRow";
import {Trial} from "@/breeding-insight/model/Trial";
import ProgressBar from '@/components/forms/ProgressBar.vue'
import {Study} from "@/breeding-insight/model/Study";
import {Metadata} from "@/breeding-insight/model/BiResponse";
import {StudyService} from "@/breeding-insight/service/StudyService";
import {BrAPIService, BrAPIType} from '@/breeding-insight/service/BrAPIService';
import {SortOrder} from "@/breeding-insight/model/Sort";

@Component({
  components: {
    ExpandableTable,
    ProgressBar
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class Dataset extends ProgramsBase {
  private activeProgram!: Program;
  private datasetModel!: DatasetModel;
  private experiment!: Trial;
  private loading = true;
  private resultDatasetId: string | undefined;
  private paginationController: PaginationController = new PaginationController();
  private datasetTableRows: DatasetTableRow[] = [];
  private unitDbIdToTraitValues: any = {};
  private envYearByStudyDbId: any = {};

  mounted() {
    this.load();
  }

  @Prop()
  private datasetId?: string;

  get experimentUUID(): string {
    return this.$route.params.experimentId;
  }

  get observationUnit(): string {
    let ou = "NA"
    if (this.experiment && this.experiment.additionalInfo && this.experiment.additionalInfo.defaultObservationLevel) {
      ou = this.experiment.additionalInfo.defaultObservationLevel;
    }
    return ou;
  }

  get phenotypesCount(): number {
    let count = 0;

    if (this.datasetModel && this.datasetModel.observationVariables) {
      count = this.datasetModel.observationVariables.length;
    }
    return count
  }

  // Total observations
  get totalObservationsCount(): string {
    let count = "0";
    if (this.datasetModel && this.datasetModel.additionalInfo) {
      count = this.datasetModel.additionalInfo.observations;
    }
    return count
  }

  // Observations with data
  get observationsWithData(): string {
    let count = "0";
    if (this.datasetModel && this.datasetModel.additionalInfo) {
      count = this.datasetModel.additionalInfo.observationsWithData;
    }
    return count
  }

  // Observations without data
  get observationsWithoutData(): string {
    let count = "0";
    if (this.datasetModel && this.datasetModel.additionalInfo) {
      count = this.datasetModel.additionalInfo.observationsWithoutData;
    }
    return count
  }

  filterByObservations(index: number, propsRow: any, input: string) {
    let obsValue = propsRow.data.traitValues[index];
    obsValue = obsValue ? obsValue : "";  //convert null or undefined to an empty string
    return obsValue.includes(input);
  }

  sortObservations(index: number, a: any, b: any, isAsc: boolean) {
    let first = a.data.traitValues[index];
    first = first ? first : "";  //convert null or undefined to an empty string
    let second = b.data.traitValues[index];
    second = second ? second : "";  //convert null or undefined to an empty string
    if (isAsc) {
      return first.localeCompare(second);
    } else {
      return second.localeCompare(first);
    }
  }

  //sort GIDs numerically
  sortGID(a: any, b: any, isAsc: boolean){
    let first :number = parseInt(a.data.gid);
    let second :number = parseInt(b.data.gid);
    if (isAsc) {
      if( first > second){ return 1; }
      else if (first < second){ return -1;}
      else return 0;
    } else {
      if( second > first ){ return 1; }
      else if ( second < first){ return -1;}
      else return 0;
    }
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

  createDatasetTableRows() {
    for (let unit of this.datasetModel.observationUnits) {
      let datasetTableRow: DatasetTableRow = new DatasetTableRow();
      datasetTableRow.germplasmName = this.removeUnique(unit.germplasmName);

      // GID
      datasetTableRow.gid = "";
      if (unit.additionalInfo) {
        datasetTableRow.gid = unit.additionalInfo.gid;
      }
      // T or C
      datasetTableRow.testOrCheck='T'; // default to 'T'
      if(unit.observationUnitPosition && unit.observationUnitPosition.entryType) {
        datasetTableRow.testOrCheck = unit.observationUnitPosition.entryType;
      }


      datasetTableRow.env = this.removeUnique(unit.studyName);
      datasetTableRow.envLocation = this.removeUnique(unit.locationName);
      datasetTableRow.expUnitId = this.removeUnique(unit.observationUnitName);
      datasetTableRow.obsUnitId = BrAPIUtils.getBreedingInsightId(unit.externalReferences, "/observationunits");
      if (unit.studyDbId) {
        datasetTableRow.envYear = this.envYearByStudyDbId[unit.studyDbId];
      }

      //Exp Replicate # and Exp Block #
      if (unit.observationUnitPosition && unit.observationUnitPosition.observationLevelRelationships) {
        for (const relationship of unit.observationUnitPosition.observationLevelRelationships) {
          if (relationship.levelName === 'rep') {
            datasetTableRow.expReplicate = relationship.levelCode;
          }
          if (relationship.levelName === 'block') {
            datasetTableRow.expBlock = relationship.levelCode;
          }
        }
      }

      // Column and Row
      if (unit.observationUnitPosition) {
        // Column
        datasetTableRow.column = "";
        if (unit.observationUnitPosition.positionCoordinateXType && unit.observationUnitPosition.positionCoordinateXType === 'GRID_COL') {
          datasetTableRow.column = unit.observationUnitPosition.positionCoordinateX;
        } else if (unit.observationUnitPosition.positionCoordinateYType && unit.observationUnitPosition.positionCoordinateYType === 'GRID_COL') {
          datasetTableRow.column = unit.observationUnitPosition.positionCoordinateY;
        }

        // Row
        datasetTableRow.row = "";
        if (unit.observationUnitPosition.positionCoordinateXType && unit.observationUnitPosition.positionCoordinateXType === 'GRID_ROW') {
          datasetTableRow.row = unit.observationUnitPosition.positionCoordinateX;
        } else if (unit.observationUnitPosition.positionCoordinateYType && unit.observationUnitPosition.positionCoordinateYType === 'GRID_ROW') {
          datasetTableRow.row = unit.observationUnitPosition.positionCoordinateY;
        }
      }

      // Treatment Factors
      datasetTableRow.treatmentFactors = "";
      if(unit.treatments && unit.treatments[0]){
        datasetTableRow.treatmentFactors = unit.treatments[0].factor;
      }

      datasetTableRow.traitValues = this.unitDbIdToTraitValues[unit.observationUnitDbId];
      this.datasetTableRows.push(datasetTableRow);
    }
  }

  async createEnvYearByStudyDbId() {
    try {
      const response: Result<Error, [Study[], Metadata]> = await StudyService.getAll(this.activeProgram!.id!, this.experiment);
      if(response.isErr()) throw response.value;
      let [studies] = response.value;

      // fetch seasons in the program
      let seasonResponse =
        await BrAPIService.get(
            BrAPIType.SEASON,
            this.activeProgram!.id!,
            { field: undefined, order: SortOrder.Ascending },
            { page: 0, pageSize: 1000 },
            {"metadata": false});

      // map season dBId to year
      if (seasonResponse.result && seasonResponse.result.data) {
        let envYearBySeasonDbId = seasonResponse.result.data.reduce((map: any, season: any) => {
          if (season.seasonDbId && season.year) {
            map[season.seasonDbId] = parseInt(season.year);
          }
          return map;
        }, {});

        // map study dBId to season year
        studies.forEach(study => {
          if (study.id && study.seasons && study.seasons.length > 0) {
            this.envYearByStudyDbId[study.id] = envYearBySeasonDbId[study.seasons[0]];
          }
        })
      }
    } catch (e: any) {

      // Display error that seasons can't be loaded
      if (e.response && e.response.statusText && e.response.status != 500) {
        this.$emit('show-error-notification', e.response.statusText);
      } else {
        this.$emit('show-error-notification', 'An unknown error has occurred while trying to load seasons.');
      }
    }
  }

  createUnitDbIdToTraitValues(): {} {
    let unitDbIdToTraitValues: any = {};
    let arrayLength: number = this.phenotypesCount;

    let units: ObservationUnit[] = this.datasetModel.observationUnits;

    // create a Hash Table with the key being each observationUnit's DbId
    // and the value being an (initially) empty array of observation values.
    for (let unit of units) {
      unitDbIdToTraitValues[unit.observationUnitDbId] = new Array<string>(arrayLength);
    }

    let variableDbIdToIndex: any = this.createvariableDbIdToIndex();

    // populate each array of observation values found in the unitDbIdToTraitValues Hash Table
    for (let observation of this.datasetModel.data) {
      // find the index (ie table column) of each observation
      // NOTE: the first observation column will have an index of 0.
      if (observation.observationVariableDbId && observation.observationUnitDbId) {
        let obsVarIndex = variableDbIdToIndex[observation.observationVariableDbId];
        let obsValue = observation.value;
        let unitDbId = observation.observationUnitDbId;
        let traitValueArray = unitDbIdToTraitValues[unitDbId];
        traitValueArray[obsVarIndex] = obsValue;
      }
    }
    return unitDbIdToTraitValues;
  }


  createvariableDbIdToIndex(): {} {
    let variableDbIdToIndex: any = {}
    for (let index = 0; index < this.datasetModel.observationVariables.length; index++) {
      let obsVarDbId = this.datasetModel.observationVariables[index].observationVariableDbId;
      if (obsVarDbId) {
        variableDbIdToIndex[obsVarDbId] = index;
      }
    }
    return variableDbIdToIndex;
  }

  cellClassIfEmpty(row: any, column: any) {
    let index = column.meta.index
    if(row.data.traitValues[index]) {
      return {};
    } else {
      return {'class': 'missing-data'};
    }
  }

  @Watch('$route')
  async load() {
    try {
      this.loading = true;

      //Set this.experiment
      let experimentResult = await ExperimentService.getSingleExperiment(this.activeProgram!.id!, this.experimentUUID, false);
      if (experimentResult.isErr()) throw experimentResult.value;
      this.experiment = experimentResult.value;

      if (this.datasetId === 'observation') {
        this.resultDatasetId = this.experiment.additionalInfo.observationDatasetId;
      } else {
        this.resultDatasetId = this.datasetId;
      }

      // Set this.datasetModel
      const response: Result<Error, DatasetModel> = await ExperimentService.getDatasetModel(this.activeProgram!.id!, this.experimentUUID, this.resultDatasetId!);
      if (response.isErr()) throw response.value;
      this.datasetModel = response.value;

      // Use this.datasetModel to initialize this.unitDbIdToTraitValues
      this.unitDbIdToTraitValues = this.createUnitDbIdToTraitValues();

      // Initialize envYearByStudyDbId
      await this.createEnvYearByStudyDbId();

      // Use this.datasetModel and this.envYearByStudyDbId to initialize this.datasetTableRows
      this.createDatasetTableRows();

      //Initialize the paginationController
      this.paginationController.totalCount = this.datasetModel.observationUnits.length;
      this.paginationController.currentPage = 1;
      this.paginationController.pageSize = 200;
      this.paginationController.totalPages = this.paginationController.totalCount.valueOf() / this.paginationController.pageSize.valueOf();
    } catch (err: any) {

      // Display error that experiment cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load data set' + err.message());
      throw err;
    } finally {
      this.loading = false;
    }
  }
}

</script>
