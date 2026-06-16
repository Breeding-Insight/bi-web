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
  <div class="genotyping">
    <h1 class="title">
      Genotyping
    </h1>
    <button
      v-if="$ability.can('create', 'Import')"
      class="button is-primary is-pulled-right has-text-weight-bold"
      v-on:click="importGenotypingFile"
    >
      <span class="icon is-small">
        <PlusCircleIcon
          size="1.5x"
          aria-hidden="true"
        />
      </span>
      <span>
        Import Genotyping File
      </span>
    </button>

    <div class="is-clearfix" />

    <ExpandableTable
      v-bind:records.sync="genotypeImports"
      v-bind:loading="loading"
      v-bind:pagination="paginationController"
      v-bind:default-sort="['data.genotypingImportDate', 'desc']"
      v-bind:search-debounce="400"
      v-bind:editable="false"
      v-bind:is-show-all-enabled="false"
      backend-filtering
      backend-pagination
      backend-sorting
      v-on:search="initSearch"
      v-on:sort="setSort"
    >
      <b-table-column
        v-slot="props"
        field="data.projectNameForSampleSubmission"
        label="Project Name"
        sortable
        searchable
        v-bind:th-attrs="(column) => ({scope:'col'})"
      >
        <router-link
          v-if="props.row.data.sampleSubmissionId"
          v-bind:to="{name: 'submission-details', params: {programId: activeProgram.id, submissionId: props.row.data.sampleSubmissionId}}"
        >
          {{ displayValue(props.row.data.projectNameForSampleSubmission) }}
        </router-link>
        <span v-if="!props.row.data.sampleSubmissionId">
          {{ displayValue(props.row.data.projectNameForSampleSubmission) }}
        </span>
      </b-table-column>
      <b-table-column
        v-slot="props"
        field="data.sampleSubmissionCreatedBy"
        label="Sample Submission Created By"
        sortable
        searchable
        v-bind:th-attrs="(column) => ({scope:'col'})"
      >
        {{ displayValue(props.row.data.sampleSubmissionCreatedBy) }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        field="data.genotypingFileName"
        label="Genotyping File Name"
        sortable
        searchable
        v-bind:th-attrs="(column) => ({scope:'col'})"
      >
        {{ displayValue(props.row.data.genotypingFileName) }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        field="data.genotypingImportDate"
        label="Genotyping Import Date"
        sortable
        searchable
        v-bind:th-attrs="(column) => ({scope:'col'})"
      >
        {{ displayValue(props.row.data.genotypingImportDate) }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        field="data.genotypingImportBy"
        label="Genotyping Imported By"
        sortable
        searchable
        v-bind:th-attrs="(column) => ({scope:'col'})"
      >
        {{ displayValue(props.row.data.genotypingImportBy) }}
      </b-table-column>

      <template v-slot:emptyMessage>
        <p class="has-text-weight-bold">
          No genotype imports were found
        </p>
      </template>
    </ExpandableTable>
  </div>
</template>

<script lang="ts">
import {Component, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import {PlusCircleIcon} from 'vue-feather-icons';
import ProgramsBase from '@/components/program/ProgramsBase.vue';
import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
import {Program} from '@/breeding-insight/model/Program';
import {PaginationController} from '@/breeding-insight/model/view_models/PaginationController';
import {GenotypeImport} from '@/breeding-insight/model/GenotypeImport';
import {GenoService} from '@/breeding-insight/service/GenoService';
import {PaginationQuery} from '@/breeding-insight/model/PaginationQuery';
import {CallStack} from '@/breeding-insight/utils/CallStack';
import {
  GenotypeImportFilters,
  GenotypeImportSort,
  GenotypeImportSortField,
  Sort,
  SortOrder
} from '@/breeding-insight/model/Sort';

@Component({
  components: {
    ExpandableTable,
    PlusCircleIcon
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class Genotyping extends ProgramsBase {
  private activeProgram?: Program;
  private loading = true;
  private genotypeImports: Array<GenotypeImport> = new Array<GenotypeImport>();
  private paginationController: PaginationController = new PaginationController();
  private genotypeImportCallStack!: CallStack;
  private filters: GenotypeImportFilters = {};
  private genotypeImportSort = new GenotypeImportSort(
      GenotypeImportSortField.GenotypingImportDate,
      SortOrder.Descending
  );
  private fieldMap: {[key: string]: GenotypeImportSortField} = {
    'data.projectNameForSampleSubmission': GenotypeImportSortField.ProjectNameForSampleSubmission,
    'data.sampleSubmissionCreatedBy': GenotypeImportSortField.SampleSubmissionCreatedBy,
    'data.genotypingFileName': GenotypeImportSortField.GenotypingFileName,
    'data.genotypingImportDate': GenotypeImportSortField.GenotypingImportDate,
    'data.genotypingImportBy': GenotypeImportSortField.GenotypingImportBy
  };

  mounted() {
    this.genotypeImportCallStack = new CallStack((filters: GenotypeImportFilters) => {
      return GenoService.fetchGenotypeImports(
          this.activeProgram!.id!,
          this.paginationController.currentCall!,
          this.genotypeImportSort,
          filters
      );
    });
    this.paginationChanged();
  }

  @Watch('paginationController', {deep: true})
  paginationChanged() {
    const currentCall = this.paginationController.currentCall;
    let paginationQuery = this.paginationController.getPaginationSelections();

    if (currentCall &&
        currentCall.pageSize !== paginationQuery.pageSize &&
        paginationQuery.page !== 1) {
      this.paginationController.updatePage(1);
      paginationQuery = this.paginationController.getPaginationSelections();
    }

    if (currentCall &&
        currentCall.page === paginationQuery.page &&
        currentCall.pageSize === paginationQuery.pageSize &&
        currentCall.showAll === paginationQuery.showAll) {
      return;
    }

    this.paginationController.setCurrentCall(paginationQuery);
    this.fetchGenotypeImports();
  }

  @Watch('filters', {deep: true})
  async fetchGenotypeImports() {
    this.loading = true;
    const {call, callId} = this.genotypeImportCallStack.makeCall(this.filters);

    try {
      const [genotypeImports, metadata] = await call;

      if (!this.genotypeImportCallStack.isCurrentCall(callId)) {
        return;
      }

      if (this.paginationController.matchesCurrentRequest(metadata.pagination)) {
        this.genotypeImports = genotypeImports;
        this.paginationController.setPaginationInfo(metadata.pagination);
      }
    } catch (e) {
      if (this.genotypeImportCallStack.isCurrentCall(callId)) {
        this.$emit('show-error-notification', 'Error while trying to fetch genotype imports');
      }
    } finally {
      if (this.genotypeImportCallStack.isCurrentCall(callId)) {
        this.loading = false;
      }
    }
  }

  setSort(field: string, order: string) {
    if (field in this.fieldMap) {
      this.genotypeImportSort = new GenotypeImportSort(this.fieldMap[field], Sort.orderAsBI(order));
      this.fetchGenotypeImports();
    }
  }

  initSearch(filters: {[key: string]: string}) {
    this.filters = Object.keys(filters).reduce((normalizedFilters: GenotypeImportFilters, field: string) => {
      if (field in this.fieldMap) {
        normalizedFilters[this.fieldMap[field]] = filters[field];
      }
      return normalizedFilters;
    }, {});
    this.paginationController.updatePage(1);
  }

  importGenotypingFile() {
    this.$router.push({
      name: 'geno-import',
      params: {
        programId: this.activeProgram!.id!
      }
    });
  }

  displayValue(value?: string): string {
    return value || '';
  }
}
</script>
