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
  <div class="container genotyping">
    <div class="columns is-centered">
      <div class="column">
        <h3 class="is-4 title">
          Genotyping
        </h3>
        <div class="columns">
          <div class="column is-whole has-text-right buttons">
            <button
              v-if="$ability.can('create', 'Import')"
              class="button is-primary"
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
          </div>
        </div>

        <ExpandableTable
          v-bind:records.sync="genotypeImports"
          v-bind:loading="loading"
          v-bind:pagination="paginationController"
          v-bind:default-sort="['data.genotypingImportDate', 'desc']"
          v-bind:debounce-search="400"
          v-bind:editable="false"
          hoverable
          v-on:click="navigateToSampleSubmission"
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
    </div>
  </div>
</template>

<script lang="ts">
import {Component} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import {PlusCircleIcon} from 'vue-feather-icons';
import ProgramsBase from '@/components/program/ProgramsBase.vue';
import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
import {Program} from '@/breeding-insight/model/Program';
import {PaginationController} from '@/breeding-insight/model/view_models/PaginationController';
import {GenotypeImport} from '@/breeding-insight/model/GenotypeImport';
import {GenoService} from '@/breeding-insight/service/GenoService';
import {TableRow} from '@/breeding-insight/model/view_models/TableRow';

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

  mounted() {
    this.fetchGenotypeImports();
  }

  async fetchGenotypeImports() {
    try {
      this.genotypeImports = await GenoService.fetchGenotypeImports(this.activeProgram!.id!);
    } catch (e) {
      this.$emit('show-error-notification', 'Error while trying to fetch genotype imports');
    } finally {
      this.loading = false;
    }
  }

  importGenotypingFile() {
    this.$router.push({
      name: 'geno-import',
      params: {
        programId: this.activeProgram!.id!
      }
    });
  }

  navigateToSampleSubmission(row: TableRow<GenotypeImport>) {
    if (!row.data.sampleSubmissionId) {
      return;
    }

    this.$router.push({
      name: 'submission-details',
      params: {
        programId: this.activeProgram!.id!,
        submissionId: row.data.sampleSubmissionId
      }
    });
  }

  displayValue(value?: string): string {
    return value || '';
  }
}
</script>
