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
  <div class="pending-imports">
    <h1 class="title">
      Pending Imports
    </h1>
    <div class="columns has-text-right mb-0 buttons">
      <div class="column">
        <button
            v-if="$ability.can('curate', 'Import')"
            class="button mx-2 is-primary is-pulled-right is-light has-text-weight-bold"
            :disabled="selectedImports.length === 0"
            v-on:click="curateSelectedImports"
        >
        <span class="icon is-small">
          <EyeIcon
              size="1.5x"
              aria-hidden="true"/>
        </span>
          <span>
          Curate Selected
        </span>
        </button>
      </div>
    </div>
    <ExpandableTable
        v-bind:records.sync="pendingImports"
        v-bind:loading="loading"
        v-bind:pagination="pagination"
        checkable
        :checkbox-position="'left'"
        :checkbox-type="'is-primary'"
        :checked-rows.sync="selectedImports"
        v-bind:default-sort="['data.createdAt', 'desc']"
    >
      <b-table-column field="experiment" label="Experiment" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.experiment.name }}
      </b-table-column>
      <b-table-column field="environment" label="Environment" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.environment.name }}
      </b-table-column>
      <b-table-column field="createdBy" label="Uploaded By" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.createdByUser.name}}
      </b-table-column>
      <b-table-column field="createdAt" label="Uploaded At" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ formatDate(props.row.data.createdAt) }}
      </b-table-column>
      <b-table-column field="detailsLink" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        <router-link v-bind:to="{name: 'curate-pending-imports', params: {programId: activeProgram.id, importIds: JSON.stringify([props.row.data.importId])}}">
          Curate
        </router-link>
      </b-table-column>

      <template v-slot:emptyMessage>
        <p class="has-text-weight-bold">
          Nothing is pending
        </p>
      </template>
    </ExpandableTable>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import ProgramsBase from '@/components/program/ProgramsBase.vue';
import { Pagination } from '@/breeding-insight/model/BiResponse';
import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
import moment from 'moment';
import {EyeIcon} from 'vue-feather-icons'
import { ImportResponse } from '@/breeding-insight/model/import/ImportResponse';

@Component({
  components: {
    ExpandableTable,
    EyeIcon
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ExperimentsAndObservations extends ProgramsBase {

  private activeProgram?: Program;
  private loading = true;
  private pendingImports: ImportResponse[] = [];
  private selectedImports: any[] = [];
  private pagination: Pagination = new Pagination();

  mounted() {
    this.getPendingImports();
  }

  async getPendingImports() {
    try {
      const imports: any[] = [];

      imports.push({
        importId: 'abc-123',
        experiment: {name: "Potato"},
        environment: {name: "Salad"},
        createdAt: '2022-12-15T13:49:03',
        createdByUser: {name: "John Doe"}
      });
      imports.push({
        importId: 'abc-456',
        experiment: {name: "Potato"},
        environment: {name: "Soup"},
        createdAt: '2022-12-16T13:49:03',
        createdByUser: {name: "Phil Collins"}
      });
      imports.push({
        importId: 'abc-789',
        experiment: {name: "Macaroni"},
        environment: {name: "Salad"},
        createdAt: '2022-12-15T15:00:03',
        createdByUser: {name: "Jane Doe"}
      });

      this.pendingImports = imports;

      this.pagination.totalCount = this.pendingImports.length;
      this.pagination.pageSize = 10;
      this.pagination.currentPage = 1;
      this.pagination.totalPages = this.pagination.totalCount.valueOf() / this.pagination.pageSize.valueOf();
    } catch(e) {
      this.$emit('show-error-notification', 'Error while trying to fetch pending imports');
      throw e;
    } finally {
      this.loading = false;
    }
  }

  formatDate(date: Date) {
    return moment(date).format();
  }

  curateSelectedImports() {
    this.$router.push({
      name: 'curate-pending-imports',
      params: {
        programId: this.activeProgram!.id!,
        importIds: JSON.stringify(this.selectedImports!.map(value => value.importId))
      },
    });

  }
}
</script>
