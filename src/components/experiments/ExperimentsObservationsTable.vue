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
  <section id="experimentsObservationsTableLabel">

    <ExperimentObservationsDownloadModal
        v-bind:experiment="downloadExperiment"
        v-bind:modal-title="downloadModalTitle"
        v-bind:trial-id="downloadTrialId"
        v-bind:active="downloadModalActive"
        v-on:show-error-notification ="$emit('show-error-notification', $event)"
        v-on:deactivate="downloadModalActive = false"
    />

    <div class="is-clearfix"></div>

    <ExpandableTable
      v-bind:records.sync="experiments"
      v-bind:loading="this.experimentsLoading"
      v-bind:pagination="paginationController"
      backend-sorting
      backend-filtering
      v-bind:default-sort="[fieldMap['createdDate'], 'DESC']"
      v-bind:search-debounce="400"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
      v-on:sort="setSort"
      v-on:search="initSearch"
    >
      <b-table-column label="Title" field="name" cell-class="fixed-width-wrapped" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        <router-link v-bind:to="{name: 'experiment-details', params: {programId: activeProgram.id, experimentId: BrAPIUtils.getBreedingInsightId(props.row.data.externalReferences,'/trials')}}">
          {{ props.row.data.trialName }}
        </router-link>

      </b-table-column>
      <b-table-column label="Status" field="active" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" >
        {{ getStatus(props.row.data.active) }}
      </b-table-column>
      <b-table-column label="Date Created" field="createdDate" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        {{ props.row.data.additionalInfo.createdDate }}
      </b-table-column>
      <b-table-column label="Created By" field="createdBy" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        {{ props.row.data.additionalInfo.createdBy.userName }}
      </b-table-column>
      <b-table-column label="Datasets" cell-class="fixed-width-wrapped" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        <template v-for="dataset in props.row.data.additionalInfo.datasets">
          <span v-bind:key="dataset" class="tag is-info is-normal mr-1">{{ dataset.name }}</span>
        </template>
      </b-table-column>
      <b-table-column field="data.listDbId" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        <a href="javascript:void(0)" v-on:click="openDownloadModal(props.row.data)">Download</a>
      </b-table-column>

      <template v-slot:emptyMessage>
        <p class="has-text-weight-bold">
          No experiments and observations are currently defined for this program.
        </p>
      </template>
    </ExpandableTable>
  </section>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {validationMixin} from 'vuelidate';
import {mapGetters, mapMutations} from 'vuex'
import {Program} from "@/breeding-insight/model/Program";
import EmptyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
import TableColumn from "@/components/tables/TableColumn.vue";
import {BiResponse} from "@/breeding-insight/model/BiResponse";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {Trial} from '@/breeding-insight/model/Trial'
import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
import {CallStack} from "@/breeding-insight/utils/CallStack";
import {
  ExperimentSort,
  Sort,
  ExperimentSortField
} from "@/breeding-insight/model/Sort";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import {UPDATE_EXPERIMENT_SORT} from "@/store/sorting/mutation-types";
import {BrAPIUtils} from "@/breeding-insight/utils/BrAPIUtils";
import ExperimentObservationsDownloadModal from "@/components/experiments/ExperimentObservationsDownloadModal.vue";

@Component({
  mixins: [validationMixin],
  components: {ExperimentObservationsDownloadModal, ExpandableTable, EmptyTableMessage, TableColumn},
  computed: {
    ...mapGetters([
      'activeProgram'
    ]),
    ...mapGetters('sorting',
        [
          'experimentSort'
        ])
  },
  methods: {
    ...mapMutations('sorting', {
      updateSort: UPDATE_EXPERIMENT_SORT
    })
  },
  data: () => ({Sort, BrAPIUtils})
})
export default class ExperimentsObservationsTable extends Vue {

  @Prop()
  experimentsFetch!: (programId: string, sort: ExperimentSort, paginationController: PaginationController) => (filters: any) => Promise<BiResponse>;

  private activeProgram?: Program;
  private experiments: Trial[] = [];

  private experimentsLoading = true;

  private paginationController: PaginationController = new PaginationController();

  private filters: any = {};
  private experimentCallStack?: CallStack;

  private experimentSort!: ExperimentSort;
  private updateSort!: (sort: ExperimentSort) => void;
  private fieldMap: any = {
    'name': ExperimentSortField.Name,
    'active': ExperimentSortField.Active,
    'createdDate': ExperimentSortField.CreatedDate,
    'createdBy': ExperimentSortField.CreatedBy
  };

  private downloadModalActive: boolean = false;
  private downloadExperiment?: Trial = new Trial();
  private downloadModalTitle?: string = 'undefined';
  private downloadTrialId?: string = 'undefined';

  mounted() {
    this.experimentCallStack = new CallStack(this.experimentsFetch(
        this.activeProgram!.id!,
        this.experimentSort,
        this.paginationController
    ));

    this.paginationController.pageSize = 20;
  }

  @Watch('paginationController', { deep: true})
  paginationChanged() {
    let currentCall = this.paginationController.currentCall
    let paginationQuery = this.paginationController.getPaginationSelections();
    if(currentCall && currentCall!.page == paginationQuery.page && currentCall!.pageSize == paginationQuery.pageSize && currentCall!.showAll == paginationQuery.showAll) {
      return;
    }
    this.updatePagination();
    this.getExperiments();
  }

  updatePagination() {
    let paginationQuery: PaginationQuery = this.paginationController.getPaginationSelections();
    this.paginationController.setCurrentCall(paginationQuery);
  }

  @Watch('filters', {deep: true})
  async getExperiments() {
    try {
      const {call, callId} = this.experimentCallStack.makeCall(this.filters);

      const response = await call;
      if (!this.experimentCallStack.isCurrentCall(callId))
        return;
      this.paginationController.setPaginationInfo(response.metadata.pagination);
      // Account for brapi 0 indexing of paging
      this.paginationController.currentPage = this.paginationController.currentPage.valueOf() + 1;
      this.experiments = response.result.data;
      this.experimentsLoading = false;

    } catch (err) {
      // Display error that experiments cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load experiments');
    } finally {
      this.experimentsLoading=false;
    }
  }

  getStatus(active: boolean){
    if (active) {
      return "active";
    } else {
      return "archived";
    }
  }

  openDownloadModal(experiment: Trial) {
    this.downloadModalActive = true;
    this.downloadExperiment = experiment;
    this.downloadModalTitle = "Download " + experiment.trialName;
    this.downloadTrialId = BrAPIUtils.getBreedingInsightId(experiment.externalReferences!, '/trials');
  }

  setSort(field: string, order: string) {
    if (field in this.fieldMap) {
      this.updateSort(new ExperimentSort(this.fieldMap[field], Sort.orderAsBI(order)));
      this.getExperiments();
    }
  }

  initSearch(filters: any) {
    this.filters = filters;

    // When filtering the list, set a page to the first page
    this.paginationController.updatePage(1);
  }
}

</script>
