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
  <div class="container sample-mgmt">
    <div class="columns is-centered">
      <div class="column">
        <h3 class="is-4 title">Sample Management</h3>
        <div class="columns">
          <div class="column is-whole has-text-right buttons">
            <button
                v-if="$ability.can('create', 'Import')"
                class="button is-primary"
                v-on:click="$router.push({name: 'sample-import', params: {programId: activeProgram.id}})"
            >
              <span class="icon is-small">
                <PlusCircleIcon
                    size="1.5x"
                    aria-hidden="true"
                />
              </span>
                    <span>
                Import Sample Submission
              </span>
            </button>
          </div>
        </div>


        <ExpandableTable
            v-bind:records.sync="submissions"
            v-bind:loading="loading"
            v-bind:pagination="paginationController"
            v-bind:default-sort="['data.createdAt', 'desc']"
            v-bind:debounce-search="400"
            v-bind:editable="false"
        >

          <b-table-column field="data.name" label="Project Name" sortable searchable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            <router-link v-bind:to="{name: 'submission-details', params: {programId: activeProgram.id, submissionId: props.row.data.id}}">
              {{ props.row.data.name }}
            </router-link>
          </b-table-column>
          <b-table-column field="data.createdAt" label="Created Date" sortable searchable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.createdAt }}
          </b-table-column>
          <b-table-column field="data.createdByUser.name" label="Created By" sortable searchable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.createdByUser.name }}
          </b-table-column>
          <b-table-column field="data.submitted" label="Submission Status" sortable searchable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            <span
                v-if="props.row.data.vendorStatus"
                class="tag"
                :class="statusTagType()"
            >
            {{ props.row.data.submitted ? "SUBMITTED" : "NOT SUBMITTED" }}
            </span>
          </b-table-column>
          <b-table-column field="data.submittedDate" label="Submitted Date" sortable searchable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.submittedDate }}
          </b-table-column>
          <b-table-column field="data.vendorOrderId" label="Vendor Order ID" sortable searchable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.vendorOrderId }}
          </b-table-column>
          <b-table-column field="data.vendorStatus" label="Vendor Status" sortable searchable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            <span
                v-if="props.row.data.vendorStatus"
                class="tag"
                :class="statusTagType(props.row.data.vendorStatus)"
            >
            {{ props.row.data.vendorStatus }}
            </span>
          </b-table-column>
          <b-table-column field="buttons" label="" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            <router-link v-bind:to="{name: 'submission-details', params: {programId: activeProgram.id, submissionId: props.row.data.id}}">
              Details
            </router-link>
          </b-table-column>

          <template v-slot:emptyMessage>
            <p class="has-text-weight-bold">
              No samples have been submitted
            </p>
          </template>
        </ExpandableTable>
      </div>
    </div>
    <GenericModal
        v-bind:active.sync="showGenerateFileModal"
        v-bind:msg-title="'Generate Sample Management File'"
        v-on:deactivate="closeModal()"
        v-bind:modalClass="'generate-sample-file'"
    >
      <h2>Visible!</h2>
      <template v-slot:footer>
        <button class="button is-success" v-on:click="closeModal()">Generate</button>
        <button class="button" v-on:click="closeModal()">Cancel</button>
      </template>
    </GenericModal>
  </div>
</template>

<script lang="ts">

import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from "vuex";
import { Program } from '@/breeding-insight/model/Program';
import * as api from "@/util/api";
import moment from 'moment';
import BasicSelectField from '@/components/forms/BasicSelectField.vue';
import NewDataForm from '@/components/forms/NewDataForm.vue';
import BasicInputField from '@/components/forms/BasicInputField.vue';
import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
import { PaginationController } from '@/breeding-insight/model/view_models/PaginationController';
import GenericModal from '@/components/modals/GenericModal.vue';
import * as XLSX from 'xlsx';
import {PlusCircleIcon} from 'vue-feather-icons'
import {SampleSubmission} from "@/breeding-insight/model/SampleSubmission";
import {SampleSubmissionService} from "@/breeding-insight/service/SampleSubmissionService";

@Component({
  components: { GenericModal, ExpandableTable, BasicInputField, NewDataForm, BasicSelectField, PlusCircleIcon },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class SampleManagement extends Vue {

  private activeProgram?: Program;
  private loading = true;
  private submissions: Array<SampleSubmission> = new Array<SampleSubmission>();
  private paginationController: PaginationController = new PaginationController();
  private showGenerateFileModal = false;

  mounted() {
    this.fetchSubmissions();
  }

  async fetchSubmissions() {
    try {
      this.submissions = await SampleSubmissionService.getProgramSampleSubmissions(this.activeProgram!.id!);
    } catch (e) {
      console.log(e);
      this.$emit('show-error-notification', "Error while trying to fetch submissions");
    } finally {
      this.loading = false;
    }
  }

  openModal() {
    this.showGenerateFileModal = true;
  }

  closeModal() {
    this.showGenerateFileModal = false;
  }

  statusTagType(status?:string) {
    if(status === "COMPLETED") {
      return "is-success";
    } else if(status === "REGISTERED" || status === "RECEIVED" ) {
      return "is-info";
    } else if(status === "INPROGRESS") {
      return "is-warning";
    } else if(status === "REJECTED") {
      return "is-danger"
    }
    return "is-light";
  }


}
</script>