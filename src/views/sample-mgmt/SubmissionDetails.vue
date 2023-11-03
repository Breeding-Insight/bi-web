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
    <div class="mb-4"/>
    <template v-if="submissionLoading">
      <div class="loading-indicator"></div>
    </template>
    <template v-if="!submissionLoading">
      <h1 class="title">
        {{ submission.name }}
      </h1>

      <div class="columns is-multiline is-align-items-stretch mt-4">
        <article class="column">
          <section>
            <ul class="list-no-style">
              <li><b>Uploaded By: </b> {{ submission.createdByUser.name }}</li>
              <li><b>Upload Date: </b> {{ submission.createdAt }}</li>
            </ul>
            <ul class="list-no-style">
              <li><b>Submission Status: </b>{{ getSubmissionStatus() }}</li>
              <template v-if="submission.submitted">
                <li><b>Submitted By: </b>{{ submission.submittedByUser.name }}</li>
                <li><b>Submission Date: </b> {{ submission.submittedDate }}</li>
              </template>
            </ul>
          </section>
        </article>
        <article class="column">
          <ul class="list-no-style" v-if="submission.vendorOrderId">
            <li><b>Vendor Order ID: </b>{{ submission.vendorOrderId }}</li>
            <li><b>Vendor Order Status: </b>{{ submission.vendorStatus }}</li>
            <li><b>Last Status Check: </b>{{ submission.vendorStatusLastCheck }}</li>
          </ul>
        </article>
        <article class="column is-narrow">
          <ActionMenu v-bind:is-primary="true"
                      v-bind:id="'manage-submission-dropdown-button'"
                      v-bind:button-text="'Manage Submission'"
                      v-bind:action-menu-items=actions
                      v-on:import-file="importFile()"
                      v-on:download-file="exportDArTFile()"
                      v-on:download-lookup-file="exportLookupFile()"
                      v-on:submit="startOrderSubmission()"
                      v-on:manual-update-status="startManualUpdate()"
                      v-on:check-status="checkVendorStatus()"
          />
        </article>
      </div>

      <section>
        <nav class="tabs is-boxed">
          <ul>
            <li :class="activeTab=='details' ? 'is-active' :''"><a v-on:click="activeTab = 'details'">Submission
              Details</a></li>
            <li :class="activeTab=='plates' ? 'is-active' :''"><a v-on:click="activeTab = 'plates'">Plate Details</a>
            </li>
            <li :class="activeTab=='forms' ? 'is-active' :''" v-if="submission.shipmentForms"><a
                v-on:click="activeTab = 'forms'">Shipment Forms</a></li>
          </ul>
        </nav>
      </section>
      <div class="tab-content">
        <template v-if="activeTab == 'plates'">
          <template v-if="submissionDetailsLoading">
            <div class="loading-indicator"></div>
          </template>
          <b-tabs vertical :animated="false" :type="'is-boxed'" v-if="!submissionDetailsLoading">
            <template v-for="plate in submission.plates">
              <b-tab-item :label="plate.plateName" :key="plate.plateName">
                <div class="columns is-vcentered">
                  <div class="column">
                    <article class="message is-success">
                      <div class="message-body">
<!--                        TODO figure out why this text on the same line causes the DIV to be too wide and move below the tabs-->
                        Click on a well to see more details, including sample name and germplasm name.<br>To download the plate layout, click the "Download" button to the right.
                      </div>
                    </article>
                  </div>
                  <div class="column is-narrow">
                    <button class="button is-primary is-outlined is-small" v-on:click="downloadPlate(plate)">Download</button>
                    <button class="button is-primary is-outlined is-small ml-1" v-on:click="downloadPlate()">Download All</button>
                  </div>
                </div>
                <b-table :data="plate.layout" :narrowed="true" class="plate-layout">
                  <b-table-column v-slot="props" cell-class="plate-row-header">
                    {{ String.fromCharCode(65 + props.index) }}
                  </b-table-column>
                  <b-table-column v-for="colIdx in 12" v-slot="props" :key="colIdx" :label="(colIdx).toString()"
                                  header-class="plate-column-header" :td-attrs="cellClassIfBlank">
                    <b-tooltip v-if="props.row[colIdx-1] !== undefined" position="is-top" type="is-white" multilined
                               :auto-close="['outside']" dashed :triggers="['click']" :size="'is-large'"
                               class="sample-tooltip">
                      <span class="is-clickable">{{ props.row[colIdx - 1].additionalInfo.gid }}</span>
                      <template v-slot:content>
                        <div class="columns pb-0 mb-0">
                          <div class="column is-narrow mr-1">Sample Name:</div>
                          <div class="column is-narrow"><span>{{ props.row[colIdx - 1].sampleName }}</span></div>
                        </div>
                        <div class="columns pb-0 mb-0">
                          <div class="column is-narrow mr-1">Germplasm Name:</div>
                          <div class="column is-narrow"><span>{{
                              props.row[colIdx - 1].additionalInfo.germplasmName
                            }}</span></div>
                        </div>
                        <div class="columns">
                          <div class="column is-narrow mr-1">GID:</div>
                          <div class="column is-narrow"><span>{{ props.row[colIdx - 1].additionalInfo.gid }}</span>
                          </div>
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
          <template v-if="submissionDetailsLoading">
            <div class="loading-indicator"></div>
          </template>
          <ExpandableTable
              v-if="!submissionDetailsLoading"
              v-bind:records.sync="submission.samples"
              v-bind:loading="submissionDetailsLoading"
              v-bind:pagination="paginationController"
              v-on:show-error-notification="$emit('show-error-notification', $event)"
              v-bind:is-show-all-enabled="false"
              sort-multiple
              :sort-multiple-data="[{field:'data.plateName', order:'asc'}, {field:'data.row', order:'asc'}, {field:'data.column', order:'asc'}]"
          >
            <b-table-column field="data.additionalInfo.germplasmName" label="Germplasm Name" v-slot="props" searchable
                            :th-attrs="(column) => ({scope:'col'})">
              {{ props.row.data.additionalInfo.germplasmName || props.row.data.sampleName }}
            </b-table-column>
            <b-table-column field="data.additionalInfo.gid" label="GID" v-slot="props" searchable
                            :th-attrs="(column) => ({scope:'col'})">
              <GermplasmLink
                  v-bind:germplasmGID="props.row.data.additionalInfo.gid"
              />
            </b-table-column>
            <b-table-column field="data.plateName" label="PlateID" sortable searchable :custom-search="filterByPlate"
                            :custom-sort="sortPlates"
                            :th-attrs="(column) => ({scope:'col'})">
              <template v-slot="props">
                {{ props.row.data.plateName }}
              </template>
              <template v-slot:searchable="props">
                <div class="select">
                  <select
                      v-model="props.filters[props.column.field]"
                  >
                    <option value=""/>
                    <option
                        v-for="cat in submission.plates"
                        :key="cat.plateDbId"
                        :value="cat.plateName"
                    >
                      {{ cat.plateName }}
                    </option>
                  </select>
                </div>
              </template>
            </b-table-column>
            <b-table-column field="data.sampleName" label="Sample Name" v-slot="props"
                            :th-attrs="(column) => ({scope:'col'})">
              {{ props.row.data.sampleName }}
            </b-table-column>
            <b-table-column field="data.row" label="Row" v-slot="props" sortable
                            :th-attrs="(column) => ({scope:'col'})">
              {{ props.row.data.row }}
            </b-table-column>
            <b-table-column field="data.column" label="Column" v-slot="props" sortable
                            :th-attrs="(column) => ({scope:'col'})">
              {{ props.row.data.column }}
            </b-table-column>
            <b-table-column field="data.additionalInfo.organism" label="Organism" v-slot="props"
                            :th-attrs="(column) => ({scope:'col'})">
              {{ props.row.data.additionalInfo.organism }}
            </b-table-column>
            <b-table-column field="data.additionalInfo.species" label="Species" v-slot="props"
                            :th-attrs="(column) => ({scope:'col'})">
              {{ props.row.data.additionalInfo.species }}
            </b-table-column>
            <b-table-column field="data.tissueType" label="Tissue" v-slot="props"
                            :th-attrs="(column) => ({scope:'col'})">
              {{ props.row.data.tissueType }}
            </b-table-column>
            <b-table-column field="data.sampleDescription" label="Comment" v-slot="props"
                            :th-attrs="(column) => ({scope:'col'})">
              {{ props.row.data.sampleDescription }}
            </b-table-column>
            <b-table-column field="data.additionalInfo.obsUnitID" label="ObsUnitID" v-slot="props"
                            :th-attrs="(column) => ({scope:'col'})">
              {{ props.row.data.additionalInfo.obsUnitID }}
            </b-table-column>
            <template v-slot:emptyMessage>
              <p class="has-text-weight-bold">
                No samples were found in this import file.
              </p>
            </template>
          </ExpandableTable>
        </template>
        <template v-if="activeTab == 'forms'">
          <article class="message is-success">
            <div class="message-body">
              Forms are supplied by the vendor. Please review each form.
            </div>
          </article>
          <div class="columns">
            <div class="column">
              <ul>
                <template v-for="(form, index) in submission.shipmentForms">
                  <li :key="index">
                    <div class="shipment-form pb-4">
                      <div><strong>Form: </strong><span>{{ form.fileName }}</span></div>
                      <div><strong>Description: </strong><span>{{ form.fileDescription }}</span></div>
                      <div><strong>Download Link: </strong><a :href="form.fileURL">{{ form.fileURL }}</a></div>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </template>
      </div>
    </template>
    <GenericModal
        v-bind:active.sync="showSubmitModal"
        v-bind:msg-title="'Submitting to DArT'"
        v-bind:escapeDeactivates="!submissionStarted || submissionComplete"
        v-bind:allowOutsideClick="!submissionStarted || submissionComplete"
        v-bind:showCloseButton="!submissionStarted || submissionComplete"
        v-on:deactivate="showSubmitModal = false"
    >
      <template v-if="!submissionStarted">
        <h2>Are you sure?</h2>
      </template>
      <template v-if="submissionStarted && !submissionComplete">
        <div class="loading-indicator"></div>
      </template>
      <template v-if="submissionComplete && !submissionError">
        <h2>Submitted Successfully!</h2>
        <div><strong>Order ID: </strong>{{ submission.vendorOrderId }}</div>
      </template>
      <template v-if="submissionComplete && submissionError">
        <h2>Submission Failed</h2>
      </template>
      <template v-slot:footer>
        <div class="columns">
          <div class="column is-whole has-text-centered buttons">
            <template v-if="submissionComplete">
              <button class="button is-success" v-on:click="showSubmitModal = false">Done</button>
            </template>
            <template v-if="!submissionStarted">
              <button class="button is-success" v-on:click="submitOrder()">Submit</button>
              <button class="button" v-on:click="showSubmitModal = false">Cancel</button>
            </template>
          </div>
        </div>
      </template>
    </GenericModal>
    <GenericModal
        v-bind:active.sync="vendorCheckStarted"
        v-bind:msg-title="'Checking Order Status'"
        v-bind:escapeDeactivates="false"
        v-bind:allowOutsideClick="false"
        v-bind:showCloseButton="false"
        v-on:deactivate="vendorCheckStarted = false"
    >
      <div class="loading-indicator"></div>
      <template v-slot:footer>
        <div class="columns">
          <div class="column is-whole has-text-centered buttons">
            <button class="button" v-on:click="vendorCheckStarted = false">Cancel</button>
          </div>
        </div>
      </template>
    </GenericModal>
    <GenericModal
        v-bind:active.sync="showUpdateModal"
        v-bind:msg-title="'Update Submission'"
        v-bind:escapeDeactivates="!updateStarted"
        v-bind:allowOutsideClick="!updateStarted"
        v-bind:showCloseButton="!updateStarted"
        v-on:deactivate="showUpdateModal = false"
    >
      <div class="columns is-vcentered">
        <div class="column is-narrow"><label>Status: </label></div>
        <div class="column">
          <div class="select">
            <select v-model="statusEdit">
              <option value="NOT SUBMITTED">NOT SUBMITTED</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <div class="columns">
          <div class="column is-whole has-text-centered buttons">
            <button class="button is-success" v-on:click="updateSubmission()" :class="updateStarted ? 'is-loading' : ''"
                    :disabled="updateStarted">Save
            </button>
            <button class="button" v-on:click="showUpdateModal = false" v-if="!updateStarted">Cancel</button>
          </div>
        </div>
      </template>
    </GenericModal>
  </div>
</template>

<script lang="ts">
import {Component, Watch} from "vue-property-decorator";
import {mapGetters} from "vuex";
import {PlusCircleIcon} from 'vue-feather-icons'
import {Program} from "@/breeding-insight/model/Program";
import {Result} from "@/breeding-insight/model/Result";
import ClickOutside from 'vue-click-outside';
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import ActionMenu from "@/components/layouts/menus/ActionMenu.vue";
import {ActionMenuItem} from "@/breeding-insight/model/ActionMenuItem";
import ExperimentObservationsDownloadModal from "@/components/experiments/ExperimentObservationsDownloadModal.vue";
import GermplasmLink from '@/components/germplasm/GermplasmLink.vue';
import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
import {PaginationController} from '@/breeding-insight/model/view_models/PaginationController';
import {PaginationQuery} from '@/breeding-insight/model/PaginationQuery';
import {SampleSubmission} from "@/breeding-insight/model/SampleSubmission";
import {SampleSubmissionService} from "@/breeding-insight/service/SampleSubmissionService";
import {TableRow} from "@/breeding-insight/model/view_models/TableRow";
import {Sample} from "@/breeding-insight/brapi/model/geno/sample";
import GenericModal from "@/components/modals/GenericModal.vue";
import {VendorOrderSubmission} from "@/breeding-insight/brapi/model/geno/vendorOrderSubmission";
import {VendorOrderStatusResponseResult} from "@/breeding-insight/brapi/model/geno/vendorOrderStatusResponseResult";
import StatusEnum = VendorOrderStatusResponseResult.StatusEnum;
import {Plate} from "@/breeding-insight/brapi/model/geno/plate";
import * as XLSX from "xlsx";
import {WorkBook, WorkSheet} from "xlsx";

@Component({
  components: {
    GenericModal,
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
  private submissionLoading: boolean = true;
  private submissionDetailsLoading: boolean = true;
  private downloadModalActive: boolean = false;
  private paginationController: PaginationController = new PaginationController();
  private submission?: SampleSubmission;
  private germNameOptions?: Array<String> = [];
  private gidOptions?: Array<String> = [];
  private showSubmitModal = false;
  private submissionComplete = false;
  private submissionStarted = false;
  private submissionError?: string;
  private vendorCheckStarted = false;
  private showUpdateModal = false;
  private updateStarted = false;
  private statusEdit?: string = 'NOT SUBMITTED';

  private collator = new Intl.Collator('en', {numeric: true, sensitivity: 'base'});

  private actions: ActionMenuItem[] = [];

  mounted() {
    this.getSubmission();
    this.getSubmissionDetails();
  }

  get submissionId(): string {
    return this.$route.params.submissionId;
  }

  async getSubmission(showLoading: boolean = true) {
    this.submissionLoading = showLoading;

    try {
      const response: Result<Error, SampleSubmission> = await SampleSubmissionService.getSubmission(this.activeProgram!.id!, this.submissionId);
      if (response.isErr()) {
        throw response.value;
      }
      this.submission = response.value;

      this.updateActionsMenu();
    } catch (e) {
      this.$emit('show-error-notification', 'Error while trying to load submission details');
      throw e;
    } finally {
      this.submissionLoading = false;
    }
  }

  private updateActionsMenu() {
    let actionsMenuItems = [];

    if (this.$ability.can('create', 'Import')) {
      actionsMenuItems.push(new ActionMenuItem('submission-import-file', 'import-file', 'Import file'));
    }

    actionsMenuItems.push(new ActionMenuItem('submission-download-file', 'download-file', 'Generate and Download DArT file'));
    actionsMenuItems.push(new ActionMenuItem('submission-download-lookup-file', 'download-lookup-file', 'Download Lookup file'));

    if (this.$ability.can('submit', 'Submission') && !this.submission!.vendorOrderId) {
      actionsMenuItems.push(new ActionMenuItem('submission-manual-update-status', 'manual-update-status', 'Manually Update Status'));
    }

    if(process.env.VUE_APP_BRAPI_VENDOR_SUBMISSION_ENABLED === 'true') {
      if (this.$ability.can('submit', 'Submission') && !this.submission!.vendorOrderId && !this.submission!.submitted) {
        actionsMenuItems.push(new ActionMenuItem('submission-submit', 'submit', 'Submit to DArT'));
      } else if (this.submission!.submitted && this.submission!.vendorOrderId && this.submission!.vendorStatus !== StatusEnum.Completed.toUpperCase()) {
        actionsMenuItems.push(new ActionMenuItem('submission-check-status', 'check-status', 'Check Vendor Status'));
      }
    }

    this.actions = actionsMenuItems;
  }

  async getSubmissionDetails() {
    this.submissionDetailsLoading = true;

    try {
      const response: Result<Error, SampleSubmission> = await SampleSubmissionService.getSubmissionDetails(this.activeProgram!.id!, this.submissionId);
      if (response.isErr()) {
        throw response.value;
      }
      let details = response.value;

      let samplesByPlate = new Map<String, Array<any>>();
      let uniqueGermplasm = new Set<String>();
      let uniqueGIDs = new Set<String>();
      details!.samples!.forEach(sample => {
        let plateSamples = samplesByPlate.get(sample.plateName) || new Array<any>();
        plateSamples.push(sample);
        samplesByPlate.set(sample.plateName, plateSamples);
        uniqueGermplasm.add(sample.additionalInfo.germplasmName);
        uniqueGIDs.add(sample.additionalInfo.gid);
      });

      details!.plates!.forEach(plate => {
        let plateSamples = samplesByPlate.get(plate.plateName);
        let plateLayout = Array.from(Array(8), () => new Array(12));
        plateSamples.forEach(sample => {
          plateLayout[sample.row.charCodeAt(0) - 'A'.charCodeAt(0)][sample.column - 1] = sample;
        });
        plate.layout = plateLayout;
      });


      this.submission!.plates = details!.plates!.sort((a, b) => this.collator.compare(a!.plateName, b!.plateName));
      this.germNameOptions = Array.from(uniqueGermplasm).sort(this.collator.compare);
      this.gidOptions = Array.from(uniqueGIDs).sort(this.collator.compare);
      this.submission!.samples = details!.samples;

      this.paginationController.pageSize = 200;
      this.paginationController.totalCount = this.submission!.samples!.length;
      this.paginationController.currentPage = 1;
      this.paginationController.totalPages = this.paginationController.totalCount.valueOf() / this.paginationController.pageSize.valueOf();

    } catch (e) {
      this.$emit('show-error-notification', 'Error while trying to load submission details');
      throw e;
    } finally {
      this.submissionDetailsLoading = false;
    }
  }

  @Watch('paginationController', {deep: true})
  paginationChanged() {
    let currentCall = this.paginationController.currentCall
    let paginationQuery = this.paginationController.getPaginationSelections();
    if (currentCall && currentCall!.page == paginationQuery.page && currentCall!.pageSize == paginationQuery.pageSize && currentCall!.showAll == paginationQuery.showAll) {
      return;
    }
    this.updatePagination();
  }

  updatePagination() {
    let paginationQuery: PaginationQuery = this.paginationController.getPaginationSelections();
    this.paginationController.setCurrentCall(paginationQuery);
  }

  get userName(): string {
    if (!this.submission.additionalInfo) {
      return '';
    }
    if (!this.submission.additionalInfo.createdBy) {
      return '';
    }
    return this.submission.additionalInfo.createdBy.userName;
  }

  get createdDate(): string {
    if (!this.submission.additionalInfo) {
      return '';
    }
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

  private exportDArTFile() {
    if (this.activeProgram) {
      window.open(process.env.VUE_APP_BI_API_ROOT
          + '/v1/programs/'
          + this.activeProgram.id
          + '/submissions/'
          + this.submissionId
          + '/dart',
          '_blank');
    }
  }

  private exportLookupFile() {
    if (this.activeProgram) {
      window.open(process.env.VUE_APP_BI_API_ROOT
          + '/v1/programs/'
          + this.activeProgram.id
          + '/submissions/'
          + this.submissionId
          + '/lookup',
          '_blank');
    }
  }

  private startOrderSubmission() {
    this.showSubmitModal = true;
    this.submissionComplete = false;
    this.submissionStarted = false;
  }

  private async submitOrder() {
    this.submissionStarted = true;
    this.submissionComplete = false;
    try {
      const response: Result<Error, VendorOrderSubmission> = await SampleSubmissionService.submitToDArT(this.activeProgram!.id!, this.submissionId);
      if (response.isErr()) {
        throw response.value;
      }
      // let orderResponse = response.value;
      // this.submission!.vendorOrderId = orderResponse.orderId;
      await this.getSubmission(false);
    } catch (e) {
      // this.$emit('show-error-notification', 'Error while trying to submit sample order');
      this.submissionError = e;
    } finally {
      this.submissionComplete = true;
    }
  }

  private async checkVendorStatus() {
    this.vendorCheckStarted = true;
    try {
      const response: Result<Error, SampleSubmission> = await SampleSubmissionService.checkVendorStatus(this.activeProgram!.id!, this.submissionId);
      if (response.isErr()) {
        throw response.value;
      }
      await this.getSubmission(false);
    } catch (e) {
      this.$emit('show-error-notification', 'Error while trying to check order status');
    } finally {
      this.vendorCheckStarted = false;
    }
  }

  private startManualUpdate() {
    if (this.submission!.submitted && this.submission!.vendorStatus) {
      this.statusEdit = this.submission!.vendorStatus;
    } else if (this.submission!.submitted) {
      this.statusEdit = "SUBMITTED";
    } else {
      this.statusEdit = "NOT SUBMITTED";
    }

    this.showUpdateModal = true;
  }

  private async updateSubmission() {
    this.updateStarted = true;
    try {
      const response: Result<Error, SampleSubmission> = await SampleSubmissionService.updateSubmissionStatus(this.activeProgram!.id!, this.submissionId, this.statusEdit!);
      if (response.isErr()) {
        throw response.value;
      }
      await this.getSubmission(false);
    } catch (e) {
      this.$emit('show-error-notification', 'Error while trying to update status');
    } finally {
      this.updateStarted = false;
      this.showUpdateModal = false;
    }
  }

  cellClassIfBlank(row: any, column: any) {
    let index = parseInt(column.label) - 1;
    if (row[index] === undefined) {
      return {'class': 'blank-well'};
    } else {
      return {};
    }
  }

  getSubmissionStatus() {
    if (this.submission!.submitted) {
      if (!this.submission!.vendorOrderId && this.submission!.vendorStatus) {
        return this.submission!.vendorStatus;
      } else {
        return "SUBMITTED";
      }
    } else {
      return "NOT SUBMITTED";
    }
  }

  downloadPlate(plate?: Plate) {
    if(plate) {
      this.downloadIndividualPlate(plate);
    } else {
      const wb = XLSX.utils.book_new();
      for(let i = 0; i < this.submission.plates.length; i++) {
        this.createPlateSheet(this.submission.plates[i], wb);
      }
      XLSX.writeFile(wb, this.submission!.name + '_all_plate_export.xlsx');
    }
  }

  downloadIndividualPlate(plate: Plate) {
    const wb = XLSX.utils.book_new();

    this.createPlateSheet(plate, wb);

    XLSX.writeFile(wb, this.submission!.name + "_"+plate.plateName+'_plate_export.xlsx');
  }

  createPlateSheet(plate: Plate, wb:WorkBook) {
    const plate_ws: XLSX.WorkSheet = XLSX.utils.book_new();
    let plateData = [[
      'Submission',
      this.submission!.name
    ],[
      'Plate',
      plate.plateName
    ],[],[],['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']];

    for(let i = 0; i < plate.layout.length; i++) {
      plateData.push([String.fromCharCode(65 + i)].concat(plate.layout[i].map((sample:Sample) => `${sample!.additionalInfo!.germplasmName} [GID-${sample!.additionalInfo!.gid}]`)));
    }

    XLSX.utils.sheet_add_aoa(plate_ws, plateData);
    XLSX.utils.book_append_sheet(wb, plate_ws, plate.plateName);
  }

  filterByPlate(row: TableRow<Sample>, input: string) {
    return row.data.plateName === input;
  }

  filterByGID(row: TableRow<Sample>, input: string) {
    return row.data.additionalInfo.gid === input;
  }

  filterByGermplasmName(row: TableRow<Sample>, input: string) {
    return row.data.additionalInfo.germplasmName === input;
  }

  sortPlates(a: TableRow<Sample>, b: TableRow<Sample>, isAsc: boolean) {
    if (isAsc) {
      return a.data.plateName.localeCompare(b.data.plateName, undefined, {numeric: true, sensitivity: 'base'});
    } else {
      return b.data.plateName.localeCompare(a.data.plateName, undefined, {numeric: true, sensitivity: 'base'});
    }
  }
}
</script>