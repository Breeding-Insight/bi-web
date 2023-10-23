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
  <div class="submission-details">
    <router-link v-bind:to="{name: 'sample-management', params: {programId: activeProgram.id}}">
      &lt; Sample Management
    </router-link>
    <div class="mb-4" />
    <h1 class="title">
      {{submission.projectName}}
    </h1>


    <div v-if="!submissionLoading && submission !== undefined">

      <div class="columns is-multiline is-align-items-stretch mt-4">
        <article class="column ">
          <section>
            <ul style="list-style-type: none;">
              <li><b>Uploaded By: </b> {{ userName }}</li>
              <li><b>Creation Date: </b> {{ createdDate }}</li>
            </ul>
          </section>
        </article>
        <article class="column is-narrow">
          <ActionMenu v-bind:is-primary="true"
                      v-bind:id="'manage-submission-dropdown-button'"
                      v-bind:button-text="'Actions'"
                      v-bind:action-menu-items=actions
                      v-on:import-file="importFile()"
                      v-on:download-file="downloadFile()"
                      v-on:submit="submitSample()"
          />
        </article>
      </div>

    </div>
    <section>
      <nav class="tabs is-boxed">
        <ul>
          <li :class="activeTab=='details' ? 'is-active' :''"><a v-on:click="activeTab = 'details'">Submission Details</a></li>
          <li :class="activeTab=='plates' ? 'is-active' :''"><a v-on:click="activeTab = 'plates'">Plate Details</a></li>
        </ul>
      </nav>
    </section>
    <div class="tab-content ml-1">
      <template v-if="activeTab == 'plates'">
        <b-tabs vertical :animated="false" :type="'is-boxed'">
          <template v-for="plate in submission.plates">
              <b-tab-item :label="plate.plateName" :key="plate.plateName">
                <article class="message is-success">
                  <div class="message-body">
                    Click on a well to see more details, including sample name and germplasm name
                  </div>
                </article>
                <b-table :data="plate.layout" :narrowed="true" class="plate-layout">
                  <b-table-column v-slot="props" cell-class="plate-row-header">
                    {{ String.fromCharCode(65 + props.index) }}
                  </b-table-column>
                  <b-table-column v-for="colIdx in 12" v-slot="props" :key="colIdx" :label="(colIdx).toString()" header-class="plate-column-header" :td-attrs="cellClassIfBlank">
                    <b-tooltip v-if="props.row[colIdx-1] !== undefined" position="is-top" type="is-white" multilined :auto-close="['outside']" dashed :triggers="['click']" :size="'is-large'" class="sample-tooltip">
                      <span>{{ props.row[colIdx - 1].additionalInfo.gid }}</span>
                      <template v-slot:content>
                        <div class="columns pb-0 mb-0">
                          <div class="column is-narrow mr-1">Sample Name:</div>
                          <div class="column is-narrow"><span>{{ props.row[colIdx - 1].sampleName }}__{{ props.row[colIdx - 1].plateName }}_{{ props.row[colIdx - 1].row }}{{ props.row[colIdx - 1].column }}</span></div>
                        </div>
                        <div class="columns pb-0 mb-0">
                          <div class="column is-narrow mr-1">Germplasm Name:</div>
                          <div class="column is-narrow"><span>{{ props.row[colIdx - 1].sampleName }}</span></div>
                        </div>
                        <div class="columns">
                          <div class="column is-narrow mr-1">GID:</div>
                          <div class="column is-narrow"><span>{{ props.row[colIdx - 1].additionalInfo.gid }}</span></div>
                        </div>
                      </template>
                    </b-tooltip>
                    <span v-if="props.row[colIdx-1] === undefined">EMPTY</span>
                  </b-table-column>
                </b-table>
              </b-tab-item>
          </template>
        </b-tabs>
      </template>
      <template v-if="activeTab == 'details'">
        <ExpandableTable
            v-bind:records.sync="submission.samples"
            v-bind:loading="false"
            v-bind:pagination="paginationController"
            v-on:show-error-notification="$emit('show-error-notification', $event)"
            v-bind:is-show-all-enabled="false"
        >
          <b-table-column field="data.plateName" label="PlateID" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.plateName }}
          </b-table-column>
          <b-table-column field="data.sampleName" label="Sample Name" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.sampleName }}__{{props.row.data.plateName}}_{{props.row.data.row}}{{props.row.data.column}}
          </b-table-column>
          <b-table-column field="data.row" label="Row" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.row }}
          </b-table-column>
          <b-table-column field="data.column" label="Column" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.column }}
          </b-table-column>
          <b-table-column field="data.additionalInfo.organism" label="Organism" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.additionalInfo.organism }}
          </b-table-column>
          <b-table-column field="data.additionalInfo.species" label="Species" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.additionalInfo.species }}
          </b-table-column>
          <b-table-column field="data.additionalInfo.gid" label="GID" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            <GermplasmLink
                v-bind:germplasmUUID="'abc-123'"
                v-bind:germplasmGID="props.row.data.additionalInfo.gid"
            />
          </b-table-column>
          <b-table-column field="data.sampleName" label="Germplasm Name" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.additionalInfo.germplasmName || props.row.data.sampleName }}
          </b-table-column>
          <b-table-column field="data.additionalInfo.obsUnitID" label="ObsUnitID" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.additionalInfo.obsUnitID }}
          </b-table-column>
          <b-table-column field="data.tissueType" label="Tissue" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.tissueType }}
          </b-table-column>
          <b-table-column field="data.sampleDescription" label="Comment" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.sampleDescription }}
          </b-table-column>
          <template v-slot:emptyMessage>
            <p class="has-text-weight-bold">
              No samples were found in this import file.
            </p>
          </template>
        </ExpandableTable>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Watch} from "vue-property-decorator";
import {mapGetters} from "vuex";
import {PlusCircleIcon} from 'vue-feather-icons'
import {Program} from "@/breeding-insight/model/Program";
import {Result} from "@/breeding-insight/model/Result";
import {ExperimentService} from "@/breeding-insight/service/ExperimentService";
import ClickOutside from 'vue-click-outside';
import {Trial} from "@/breeding-insight/model/Trial";
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import ActionMenu from "@/components/layouts/menus/ActionMenu.vue";
import {ActionMenuItem} from "@/breeding-insight/model/ActionMenuItem";
import ExperimentObservationsDownloadModal from "@/components/experiments/ExperimentObservationsDownloadModal.vue";
import GermplasmLink from '@/components/germplasm/GermplasmLink.vue';
import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
import { PaginationController } from '@/breeding-insight/model/view_models/PaginationController';
import { PaginationQuery } from '@/breeding-insight/model/PaginationQuery';

@Component({
  components: {
    ExpandableTable,
    GermplasmLink,
    PlusCircleIcon,
    ExperimentObservationsDownloadModal,
    ActionMenu
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  },
  directives: {
    ClickOutside
  }
})
export default class SubmissionDetails extends ProgramsBase {
  private activeProgram: Program;
  private activeTab = 'details';
  private submissionLoading: boolean = false;
  private downloadModalActive: boolean = false;
  private paginationController: PaginationController = new PaginationController();

  private actions: ActionMenuItem[] = [
      new ActionMenuItem('submission-import-file', 'import-file', 'Import file'),
      new ActionMenuItem('submission-download-file', 'download-file', 'Generate and Download DArT file'),
    new ActionMenuItem('submission-submit', 'submit', 'Submit to DArT')
  ];

  mounted () {
    this.paginationController.pageSize = 200;
    this.paginationController.totalCount = this.submission.samples.length;
    this.paginationController.currentPage = 1;
    this.paginationController.totalPages = this.paginationController.totalCount.valueOf() / this.paginationController.pageSize.valueOf();

    let samplesByPlate = new Map<String, Array<any>>();
    this.submission.samples.forEach(sample => {
      let plateSamples = samplesByPlate.get(sample.plateName) || new Array<any>();
      plateSamples.push(sample);
      samplesByPlate.set(sample.plateName, plateSamples);
    });

    this.submission.plates.forEach(plate => {
      let plateSamples = samplesByPlate.get(plate.plateName);
      let plateLayout = Array.from(Array(8), () => new Array(12));
      plateSamples.forEach(sample => {
        plateLayout[sample.row.charCodeAt(0)-'A'.charCodeAt(0)][sample.column-1] = sample;
      });
      plate.layout = plateLayout;
    })
  }

  @Watch('paginationController', { deep: true})
  paginationChanged() {
    let currentCall = this.paginationController.currentCall
    let paginationQuery = this.paginationController.getPaginationSelections();
    if(currentCall && currentCall!.page == paginationQuery.page && currentCall!.pageSize == paginationQuery.pageSize && currentCall!.showAll == paginationQuery.showAll) {
      return;
    }
    this.updatePagination();
  }

  updatePagination() {
    let paginationQuery: PaginationQuery = this.paginationController.getPaginationSelections();
    this.paginationController.setCurrentCall(paginationQuery);
  }

  get userName(): string {
    if( !this.submission.additionalInfo ){return '';}
    if( !this.submission.additionalInfo.createdBy){return '';}
    return this.submission.additionalInfo.createdBy.userName;
  }
  get createdDate(): string {
    if( !this.submission.additionalInfo ){return '';}
    return this.submission.additionalInfo.createdDate;
  }

  private importFile() {
    this.$router.push({
      name: 'sample-import',
      params: {
        programId: this.activeProgram!.id!
      },
    });
  }

  private downloadFile() {
    this.downloadModalActive = true;
  }

  private submitSample() {
    console.log("submitting to DArT");
}

  cellClassIfBlank(row: any, column: any) {
    let index = parseInt(column.label)-1;
    if(row[index] === undefined) {
      return {'class': 'blank-well'};
    } else {
      return {};
    }
  }

  // @Watch('$route')
  // async getExperiment () {
  //   this.submissionLoading = true;
  //   try {
  //     const response: Result<Error, Trial> = await ExperimentService.getSingleExperiment(this.activeProgram!.id!, this.experimentUUID, true);
  //     if (response.isErr()) {
  //       throw response.value;
  //     }
  //     this.submission = response.value;
  //   } catch (err) {
  //     // Display error that experiment cannot be loaded
  //     this.$emit('show-error-notification', 'Error while trying to load experiment');
  //     throw err;
  //   } finally {
  //     this.submissionLoading = false;
  //   }
  // }

  private submission = {
    additionalInfo: {
      createdBy: {
        userName: 'Rebecca Cubitt'
      },
      createdDate: '2023-10-09'
    },
    projectName: 'SPotatoP1-10-2023',
    "plates": [
      {
        "plateName": "Y_1",
        "plateFormat": "PLATE_96",
        "additionalInfo": {
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          }
        },
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          }
        ]
      },
      {
        "plateName": "Y_2",
        "plateFormat": "PLATE_96",
        "additionalInfo": {
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          }
        },
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          }
        ]
      }
    ],
    "samples": [
      {
        "row": "A",
        "column": 1,
        "plateName": "Y_1",
        "sampleName": "X1_33642_W6_B4",
        "tissueType": "leaf",
        "germplasmDbId": "4daa59b3-c4c2-4911-9f71-68d5e39ebef4",
        "additionalInfo": {
          "gid": "4",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "611befa4-f782-428c-9d77-22e85749aafc"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "bfb76cab-3d02-45ff-853d-b77e4d755ac7",
            "referenceId": "bfb76cab-3d02-45ff-853d-b77e4d755ac7",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "b74fa178-3edc-431a-a7d5-bc5ee2133aab"
      },
      {
        "row": "B",
        "column": 1,
        "plateName": "Y_1",
        "sampleName": "X1_33642_W6_B4",
        "tissueType": "leaf",
        "germplasmDbId": "4daa59b3-c4c2-4911-9f71-68d5e39ebef4",
        "additionalInfo": {
          "gid": "4",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "611befa4-f782-428c-9d77-22e85749aafc"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "bfb76cab-3d02-45ff-853d-b77e4d755ac7",
            "referenceId": "bfb76cab-3d02-45ff-853d-b77e4d755ac7",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "b74fa178-3edc-431a-a7d5-bc5ee2133aab"
      },
      {
        "row": "C",
        "column": 1,
        "plateName": "Y_1",
        "sampleName": "X1_33642_W6_B4",
        "tissueType": "leaf",
        "germplasmDbId": "4daa59b3-c4c2-4911-9f71-68d5e39ebef4",
        "additionalInfo": {
          "gid": "4",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "611befa4-f782-428c-9d77-22e85749aafc"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "bfb76cab-3d02-45ff-853d-b77e4d755ac7",
            "referenceId": "bfb76cab-3d02-45ff-853d-b77e4d755ac7",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "b74fa178-3edc-431a-a7d5-bc5ee2133aab"
      },
      {
        "row": "D",
        "column": 1,
        "plateName": "Y_1",
        "sampleName": "X1_33642_W6_B4",
        "tissueType": "leaf",
        "germplasmDbId": "4daa59b3-c4c2-4911-9f71-68d5e39ebef4",
        "additionalInfo": {
          "gid": "4",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "611befa4-f782-428c-9d77-22e85749aafc"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "bfb76cab-3d02-45ff-853d-b77e4d755ac7",
            "referenceId": "bfb76cab-3d02-45ff-853d-b77e4d755ac7",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "b74fa178-3edc-431a-a7d5-bc5ee2133aab"
      },
      {
        "row": "E",
        "column": 1,
        "plateName": "Y_1",
        "sampleName": "X1_33642_W6_P1",
        "tissueType": "leaf",
        "germplasmDbId": "9613cbf4-9b2c-4221-9f7e-b33fff064e3a",
        "additionalInfo": {
          "gid": "1",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "0b5422f0-ef86-4959-8484-b6488d2afa9e"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "781c212e-cb9f-4bed-a49d-6fd6e140374a",
            "referenceId": "781c212e-cb9f-4bed-a49d-6fd6e140374a",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "55744ac3-897e-4b71-91f6-fefce1bc71b8"
      },
      {
        "row": "F",
        "column": 1,
        "plateName": "Y_1",
        "sampleName": "X1_33642_W6_P1",
        "tissueType": "leaf",
        "germplasmDbId": "9613cbf4-9b2c-4221-9f7e-b33fff064e3a",
        "additionalInfo": {
          "gid": "1",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "0b5422f0-ef86-4959-8484-b6488d2afa9e"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "781c212e-cb9f-4bed-a49d-6fd6e140374a",
            "referenceId": "781c212e-cb9f-4bed-a49d-6fd6e140374a",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "55744ac3-897e-4b71-91f6-fefce1bc71b8"
      },
      {
        "row": "G",
        "column": 1,
        "plateName": "Y_1",
        "sampleName": "X1_33642_W6_P1",
        "tissueType": "leaf",
        "germplasmDbId": "9613cbf4-9b2c-4221-9f7e-b33fff064e3a",
        "additionalInfo": {
          "gid": "1",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "0b5422f0-ef86-4959-8484-b6488d2afa9e"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "781c212e-cb9f-4bed-a49d-6fd6e140374a",
            "referenceId": "781c212e-cb9f-4bed-a49d-6fd6e140374a",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "55744ac3-897e-4b71-91f6-fefce1bc71b8"
      },
      {
        "row": "H",
        "column": 1,
        "plateName": "Y_1",
        "sampleName": "X1_33642_W6_P1",
        "tissueType": "leaf",
        "germplasmDbId": "9613cbf4-9b2c-4221-9f7e-b33fff064e3a",
        "additionalInfo": {
          "gid": "1",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "0b5422f0-ef86-4959-8484-b6488d2afa9e"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "781c212e-cb9f-4bed-a49d-6fd6e140374a",
            "referenceId": "781c212e-cb9f-4bed-a49d-6fd6e140374a",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "55744ac3-897e-4b71-91f6-fefce1bc71b8"
      },
      {
        "row": "A",
        "column": 2,
        "plateName": "Y_1",
        "sampleName": "X1_33642_W6_P2",
        "tissueType": "leaf",
        "germplasmDbId": "19cfe44b-544d-46a9-a643-37a883f21bf5",
        "additionalInfo": {
          "gid": "2",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "b2a81912-d31c-45a2-a58d-197632d02d08"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "760792e5-fc37-4495-a2ec-ac2fc85e18ff",
            "referenceId": "760792e5-fc37-4495-a2ec-ac2fc85e18ff",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "a3335ebf-4dc4-4eab-98ea-8680e989c03d"
      },
      {
        "row": "B",
        "column": 2,
        "plateName": "Y_1",
        "sampleName": "X1_33642_W6_P2",
        "tissueType": "leaf",
        "germplasmDbId": "19cfe44b-544d-46a9-a643-37a883f21bf5",
        "additionalInfo": {
          "gid": "2",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "b2a81912-d31c-45a2-a58d-197632d02d08"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "760792e5-fc37-4495-a2ec-ac2fc85e18ff",
            "referenceId": "760792e5-fc37-4495-a2ec-ac2fc85e18ff",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "a3335ebf-4dc4-4eab-98ea-8680e989c03d"
      },
      {
        "row": "C",
        "column": 2,
        "plateName": "Y_1",
        "sampleName": "X1_33642_W6_P2",
        "tissueType": "leaf",
        "germplasmDbId": "19cfe44b-544d-46a9-a643-37a883f21bf5",
        "additionalInfo": {
          "gid": "2",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "b2a81912-d31c-45a2-a58d-197632d02d08"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "760792e5-fc37-4495-a2ec-ac2fc85e18ff",
            "referenceId": "760792e5-fc37-4495-a2ec-ac2fc85e18ff",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "a3335ebf-4dc4-4eab-98ea-8680e989c03d"
      },
      {
        "row": "D",
        "column": 2,
        "plateName": "Y_1",
        "sampleName": "X1_33642_W6_P2",
        "tissueType": "leaf",
        "germplasmDbId": "19cfe44b-544d-46a9-a643-37a883f21bf5",
        "additionalInfo": {
          "gid": "2",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "b2a81912-d31c-45a2-a58d-197632d02d08"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "760792e5-fc37-4495-a2ec-ac2fc85e18ff",
            "referenceId": "760792e5-fc37-4495-a2ec-ac2fc85e18ff",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "a3335ebf-4dc4-4eab-98ea-8680e989c03d"
      },
      {
        "row": "E",
        "column": 2,
        "plateName": "Y_1",
        "sampleName": "X1_33642_W6_P3",
        "tissueType": "leaf",
        "germplasmDbId": "93bb5da0-f8db-4dd3-ab70-c3bcf728b658",
        "additionalInfo": {
          "gid": "3",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "1d04e8f1-afcd-4c89-ba17-e9f6550dd0ef"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "69375af3-ebee-4297-879b-7a6cf44f7676",
            "referenceId": "69375af3-ebee-4297-879b-7a6cf44f7676",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "ff9fa700-9ccc-4b47-91ba-7461fa558320"
      },
      {
        "row": "F",
        "column": 2,
        "plateName": "Y_1",
        "sampleName": "X1_33642_W6_P3",
        "tissueType": "leaf",
        "germplasmDbId": "93bb5da0-f8db-4dd3-ab70-c3bcf728b658",
        "additionalInfo": {
          "gid": "3",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "1d04e8f1-afcd-4c89-ba17-e9f6550dd0ef"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "69375af3-ebee-4297-879b-7a6cf44f7676",
            "referenceId": "69375af3-ebee-4297-879b-7a6cf44f7676",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "ff9fa700-9ccc-4b47-91ba-7461fa558320"
      },
      {
        "row": "G",
        "column": 2,
        "plateName": "Y_1",
        "sampleName": "X1_33642_W6_P3",
        "tissueType": "leaf",
        "germplasmDbId": "93bb5da0-f8db-4dd3-ab70-c3bcf728b658",
        "additionalInfo": {
          "gid": "3",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "1d04e8f1-afcd-4c89-ba17-e9f6550dd0ef"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "69375af3-ebee-4297-879b-7a6cf44f7676",
            "referenceId": "69375af3-ebee-4297-879b-7a6cf44f7676",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "ff9fa700-9ccc-4b47-91ba-7461fa558320"
      },
      {
        "row": "H",
        "column": 2,
        "plateName": "Y_1",
        "sampleName": "X1_33642_W6_P3",
        "tissueType": "leaf",
        "germplasmDbId": "93bb5da0-f8db-4dd3-ab70-c3bcf728b658",
        "additionalInfo": {
          "gid": "3",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "1d04e8f1-afcd-4c89-ba17-e9f6550dd0ef"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "69375af3-ebee-4297-879b-7a6cf44f7676",
            "referenceId": "69375af3-ebee-4297-879b-7a6cf44f7676",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "ff9fa700-9ccc-4b47-91ba-7461fa558320"
      },
      {
        "row": "A",
        "column": 5,
        "plateName": "Y_2",
        "sampleName": "X1_33642_W6_B4",
        "tissueType": "leaf",
        "germplasmDbId": "4daa59b3-c4c2-4911-9f71-68d5e39ebef4",
        "additionalInfo": {
          "gid": "4",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "611befa4-f782-428c-9d77-22e85749aafc"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "bfb76cab-3d02-45ff-853d-b77e4d755ac7",
            "referenceId": "bfb76cab-3d02-45ff-853d-b77e4d755ac7",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "b74fa178-3edc-431a-a7d5-bc5ee2133aab"
      },
      {
        "row": "B",
        "column": 5,
        "plateName": "Y_2",
        "sampleName": "X1_33642_W6_B4",
        "tissueType": "leaf",
        "germplasmDbId": "4daa59b3-c4c2-4911-9f71-68d5e39ebef4",
        "additionalInfo": {
          "gid": "4",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "611befa4-f782-428c-9d77-22e85749aafc"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "bfb76cab-3d02-45ff-853d-b77e4d755ac7",
            "referenceId": "bfb76cab-3d02-45ff-853d-b77e4d755ac7",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "b74fa178-3edc-431a-a7d5-bc5ee2133aab"
      },
      {
        "row": "C",
        "column": 5,
        "plateName": "Y_2",
        "sampleName": "X1_33642_W6_B4",
        "tissueType": "leaf",
        "germplasmDbId": "4daa59b3-c4c2-4911-9f71-68d5e39ebef4",
        "additionalInfo": {
          "gid": "4",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "611befa4-f782-428c-9d77-22e85749aafc"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "bfb76cab-3d02-45ff-853d-b77e4d755ac7",
            "referenceId": "bfb76cab-3d02-45ff-853d-b77e4d755ac7",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "b74fa178-3edc-431a-a7d5-bc5ee2133aab"
      },
      {
        "row": "D",
        "column": 5,
        "plateName": "Y_2",
        "sampleName": "X1_33642_W6_B4",
        "tissueType": "leaf",
        "germplasmDbId": "4daa59b3-c4c2-4911-9f71-68d5e39ebef4",
        "additionalInfo": {
          "gid": "4",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "611befa4-f782-428c-9d77-22e85749aafc"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "bfb76cab-3d02-45ff-853d-b77e4d755ac7",
            "referenceId": "bfb76cab-3d02-45ff-853d-b77e4d755ac7",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "b74fa178-3edc-431a-a7d5-bc5ee2133aab"
      },
      {
        "row": "E",
        "column": 5,
        "plateName": "Y_2",
        "sampleName": "X1_33642_W6_P1",
        "tissueType": "leaf",
        "germplasmDbId": "9613cbf4-9b2c-4221-9f7e-b33fff064e3a",
        "additionalInfo": {
          "gid": "1",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "0b5422f0-ef86-4959-8484-b6488d2afa9e"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "781c212e-cb9f-4bed-a49d-6fd6e140374a",
            "referenceId": "781c212e-cb9f-4bed-a49d-6fd6e140374a",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "55744ac3-897e-4b71-91f6-fefce1bc71b8"
      },
      {
        "row": "F",
        "column": 5,
        "plateName": "Y_2",
        "sampleName": "X1_33642_W6_P1",
        "tissueType": "leaf",
        "germplasmDbId": "9613cbf4-9b2c-4221-9f7e-b33fff064e3a",
        "additionalInfo": {
          "gid": "1",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "0b5422f0-ef86-4959-8484-b6488d2afa9e"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "781c212e-cb9f-4bed-a49d-6fd6e140374a",
            "referenceId": "781c212e-cb9f-4bed-a49d-6fd6e140374a",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "55744ac3-897e-4b71-91f6-fefce1bc71b8"
      },
      {
        "row": "G",
        "column": 5,
        "plateName": "Y_2",
        "sampleName": "X1_33642_W6_P1",
        "tissueType": "leaf",
        "germplasmDbId": "9613cbf4-9b2c-4221-9f7e-b33fff064e3a",
        "additionalInfo": {
          "gid": "1",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "0b5422f0-ef86-4959-8484-b6488d2afa9e"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "781c212e-cb9f-4bed-a49d-6fd6e140374a",
            "referenceId": "781c212e-cb9f-4bed-a49d-6fd6e140374a",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "55744ac3-897e-4b71-91f6-fefce1bc71b8"
      },
      {
        "row": "H",
        "column": 5,
        "plateName": "Y_2",
        "sampleName": "X1_33642_W6_P1",
        "tissueType": "leaf",
        "germplasmDbId": "9613cbf4-9b2c-4221-9f7e-b33fff064e3a",
        "additionalInfo": {
          "gid": "1",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "0b5422f0-ef86-4959-8484-b6488d2afa9e"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "781c212e-cb9f-4bed-a49d-6fd6e140374a",
            "referenceId": "781c212e-cb9f-4bed-a49d-6fd6e140374a",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "55744ac3-897e-4b71-91f6-fefce1bc71b8"
      },
      {
        "row": "A",
        "column": 6,
        "plateName": "Y_2",
        "sampleName": "X1_33642_W6_P2",
        "tissueType": "leaf",
        "germplasmDbId": "19cfe44b-544d-46a9-a643-37a883f21bf5",
        "additionalInfo": {
          "gid": "2",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "b2a81912-d31c-45a2-a58d-197632d02d08"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "760792e5-fc37-4495-a2ec-ac2fc85e18ff",
            "referenceId": "760792e5-fc37-4495-a2ec-ac2fc85e18ff",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "a3335ebf-4dc4-4eab-98ea-8680e989c03d"
      },
      {
        "row": "B",
        "column": 6,
        "plateName": "Y_2",
        "sampleName": "X1_33642_W6_P2",
        "tissueType": "leaf",
        "germplasmDbId": "19cfe44b-544d-46a9-a643-37a883f21bf5",
        "additionalInfo": {
          "gid": "2",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "b2a81912-d31c-45a2-a58d-197632d02d08"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "760792e5-fc37-4495-a2ec-ac2fc85e18ff",
            "referenceId": "760792e5-fc37-4495-a2ec-ac2fc85e18ff",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "a3335ebf-4dc4-4eab-98ea-8680e989c03d"
      },
      {
        "row": "C",
        "column": 6,
        "plateName": "Y_2",
        "sampleName": "X1_33642_W6_P2",
        "tissueType": "leaf",
        "germplasmDbId": "19cfe44b-544d-46a9-a643-37a883f21bf5",
        "additionalInfo": {
          "gid": "2",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "b2a81912-d31c-45a2-a58d-197632d02d08"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "760792e5-fc37-4495-a2ec-ac2fc85e18ff",
            "referenceId": "760792e5-fc37-4495-a2ec-ac2fc85e18ff",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "a3335ebf-4dc4-4eab-98ea-8680e989c03d"
      },
      {
        "row": "D",
        "column": 6,
        "plateName": "Y_2",
        "sampleName": "X1_33642_W6_P2",
        "tissueType": "leaf",
        "germplasmDbId": "19cfe44b-544d-46a9-a643-37a883f21bf5",
        "additionalInfo": {
          "gid": "2",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "b2a81912-d31c-45a2-a58d-197632d02d08"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "760792e5-fc37-4495-a2ec-ac2fc85e18ff",
            "referenceId": "760792e5-fc37-4495-a2ec-ac2fc85e18ff",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "a3335ebf-4dc4-4eab-98ea-8680e989c03d"
      },
      {
        "row": "E",
        "column": 6,
        "plateName": "Y_2",
        "sampleName": "X1_33642_W6_P3",
        "tissueType": "leaf",
        "germplasmDbId": "93bb5da0-f8db-4dd3-ab70-c3bcf728b658",
        "additionalInfo": {
          "gid": "3",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "1d04e8f1-afcd-4c89-ba17-e9f6550dd0ef"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "69375af3-ebee-4297-879b-7a6cf44f7676",
            "referenceId": "69375af3-ebee-4297-879b-7a6cf44f7676",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "ff9fa700-9ccc-4b47-91ba-7461fa558320"
      },
      {
        "row": "F",
        "column": 6,
        "plateName": "Y_2",
        "sampleName": "X1_33642_W6_P3",
        "tissueType": "leaf",
        "germplasmDbId": "93bb5da0-f8db-4dd3-ab70-c3bcf728b658",
        "additionalInfo": {
          "gid": "3",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "1d04e8f1-afcd-4c89-ba17-e9f6550dd0ef"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "69375af3-ebee-4297-879b-7a6cf44f7676",
            "referenceId": "69375af3-ebee-4297-879b-7a6cf44f7676",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "ff9fa700-9ccc-4b47-91ba-7461fa558320"
      },
      {
        "row": "G",
        "column": 6,
        "plateName": "Y_2",
        "sampleName": "X1_33642_W6_P3",
        "tissueType": "leaf",
        "germplasmDbId": "93bb5da0-f8db-4dd3-ab70-c3bcf728b658",
        "additionalInfo": {
          "gid": "3",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "1d04e8f1-afcd-4c89-ba17-e9f6550dd0ef"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "69375af3-ebee-4297-879b-7a6cf44f7676",
            "referenceId": "69375af3-ebee-4297-879b-7a6cf44f7676",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "ff9fa700-9ccc-4b47-91ba-7461fa558320"
      },
      {
        "row": "H",
        "column": 6,
        "plateName": "Y_2",
        "sampleName": "X1_33642_W6_P3",
        "tissueType": "leaf",
        "germplasmDbId": "93bb5da0-f8db-4dd3-ab70-c3bcf728b658",
        "additionalInfo": {
          "gid": "3",
          "species": "Medicago sativa",
          "organism": "Alfalfa",
          "createdBy": {
            "userId": "55e268e9-cc02-44e6-ad1e-d99ea9770830",
            "userName": "BI-DEV Admin"
          },
          "obsUnitID": "1d04e8f1-afcd-4c89-ba17-e9f6550dd0ef"
        },
        "sampleDescription": "Cutlivar Panels for Yield study_ Pooled",
        "externalReferences": [
          {
            "referenceId": "b0fddf2e-3951-4f89-8502-ef3243a9a9b8",
            "referenceSource": "breedinginsight.org/programs"
          },
          {
            "referenceID": "69375af3-ebee-4297-879b-7a6cf44f7676",
            "referenceId": "69375af3-ebee-4297-879b-7a6cf44f7676",
            "referenceSource": "breedinginsight.org"
          }
        ],
        "observationUnitDbId": "ff9fa700-9ccc-4b47-91ba-7461fa558320"
      }
    ]
  };
}
</script>