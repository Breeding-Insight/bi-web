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
  <div id="program-job-management">
    <h1 class="title">
      Jobs
    </h1>

    <button
        class="button is-primary has-text-weight-bold is-pulled-right"
        v-on:click="refresh"
        data-testid="refreshJobsBtn"
    >
        Refresh
    </button>

    <div class="is-clearfix"></div>

    <ExpandableTable
        v-bind:records.sync="jobs"
        v-bind:loading="loading"
        v-bind:pagination="pagination"
        v-bind:details="true"
        v-bind:default-sort="['data.createdAt', 'desc']"
    >
      <b-table-column field="data.statuscode" label="Status" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        <span class="tag" :class="progressTagType(props.row.data.statuscode)">
          {{ formatProgress(props.row.data.statuscode) }}
        </span>
      </b-table-column>
      <b-table-column field="data.jobType" label="Type" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.jobType}}
      </b-table-column>
      <b-table-column field="data.createdByUser.name" label="Submitted By" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.createdByUser.name}}
      </b-table-column>
      <b-table-column field="data.createdAt" label="Submitted At" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ formatDate(props.row.data.createdAt) }}
      </b-table-column>
      <b-table-column field="data.updatedAt" label="Last Updated" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ formatDate(props.row.data.updatedAt) }}
      </b-table-column>
      <b-table-column field="data.statusMessage" label="Status Message" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.statusMessage }}
      </b-table-column>

      <template v-slot:detail="{row}">
        <div class="column" v-if="row.jobDetail.jobType === 'IMPORT'">
          <div>
            <span class="has-text-weight-bold">Status Message: </span>{{ row.jobDetail.progress.message }}
          </div>
          <div>
            <span class="has-text-weight-bold">In Progress (count): </span>{{ row.jobDetail.progress.inProgress }}
          </div>
          <div>
            <span class="has-text-weight-bold">Complete (count): </span>{{ row.jobDetail.progress.finished }}
          </div>
          <div>
            <span class="has-text-weight-bold">Total (count): </span>{{ row.jobDetail.progress.total }}
          </div>
          <div>
            <span class="has-text-weight-bold">Import Template Name: </span>{{ row.jobDetail.importMappingName}}
          </div>
          <div>
            <span class="has-text-weight-bold">Uploaded By: </span>{{ row.createdByUser.name }}
          </div>
          <div>
            <span class="has-text-weight-bold">Uploaded File: </span>{{ row.jobDetail.uploadFileName }}
          </div>
        </div>
      </template>

      <template v-slot:emptyMessage>
          <p class="has-text-weight-bold">
            Nothing has been processed.
          </p>
      </template>
    </ExpandableTable>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ImportInfoTemplateMessageBox from '@/components/file-import/ImportInfoTemplateMessageBox.vue';
import ConfirmImportMessageBox from '@/components/trait/ConfirmImportMessageBox.vue';
import ImportTemplate from '@/views/import/ImportTemplate.vue';
import { AlertTriangleIcon } from 'vue-feather-icons';
import BasicInputField from '@/components/forms/BasicInputField.vue';
import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
import { ImportService } from '@/breeding-insight/service/ImportService';
import { mapGetters } from 'vuex';
import { Program } from '@/breeding-insight/model/Program';
import { Pagination } from '@/breeding-insight/model/BiResponse';
import { PaginationController } from '@/breeding-insight/model/view_models/PaginationController';
import { ImportProgress } from '@/breeding-insight/model/import/ImportProgress';
import moment from 'moment';
import { JobService } from '@/breeding-insight/service/JobService';
import { Job } from '@/breeding-insight/model/job/Job';

@Component({
  components: {
    ExpandableTable, ImportInfoTemplateMessageBox,
    ConfirmImportMessageBox, ImportTemplate,
    AlertTriangleIcon, BasicInputField
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class JobManagement extends Vue {

  private activeProgram?: Program;
  private jobs?: Job[] = [];
  private pagination: Pagination = new Pagination();
  private paginationController: PaginationController = new PaginationController();
  private loading = true;

  mounted() {
    this.getJobs();
  }

  formatDate(date: Date) {
    return moment(date).format();
  }

  formatProgress(statuscode:number) {
    if(statuscode === 202) {
      return  "In Progress";
    } else if(statuscode === 200) {
      return "Finished";
    } else {
      return "Error";
    }
  }

  progressTagType(statuscode:number) {
    if(statuscode === 202) {
      return  "is-warning";
    } else if(statuscode === 200) {
      return "is-success";
    } else {
      return "is-error";
    }
  }

  refresh() {
    this.loading = true;
    this.getJobs();
  }

  async getJobs() {
    try {
      this.jobs = await JobService.getProgramJobs(this.activeProgram!.id!);
      this.pagination.totalCount = this.jobs.length;
      this.pagination.pageSize = 10;
      this.pagination.currentPage = 1;
      this.pagination.totalPages = this.pagination.totalCount.valueOf() / this.pagination.pageSize.valueOf();
    } catch(e) {
      this.$emit('show-error-notification', 'Error while trying to fetch process statuses');
      throw e;
    } finally {
      this.loading = false;
    }
  }

}
</script>