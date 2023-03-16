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

    <div class="is-clearfix"></div>

    <ExpandableTable
        v-bind:records.sync="experiments"
        v-bind:loading="this.experimentsLoading"
        v-bind:pagination="paginationController"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
        backend-sorting
        backend-filtering
        v-bind:default-sort="[fieldMap['name'], 'ASC']"
        v-on:sort="setSort"
        v-on:search="initSearch"
        v-bind:search-debounce="400"
    >
      <b-table-column label="Title" field="name" cell-class="fixed-width-wrapped" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
          {{ props.row.data.trialName }}
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
          <span v-bind:key="dataset" class="tag is-info is-normal mr-1">{{ dataset }}</span>
        </template>
      </b-table-column>
      <b-table-column  field="data.listDbId" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        <a href="#" v-on:click="activateExtensionSelect(props.row.data.listDbId)">
          Download
        </a>
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
import {FileType} from "@/breeding-insight/model/FileType";
import SelectModal from "@/components/modals/SelectModal.vue";
import {CallStack} from "@/breeding-insight/utils/CallStack";
import {
  ExperimentSort,
  Sort,
  ExperimentSortField
} from "@/breeding-insight/model/Sort";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import {UPDATE_EXPERIMENT_SORT} from "@/store/sorting/mutation-types";

@Component({
  mixins: [validationMixin],
  components: {ExpandableTable, EmptyTableMessage, TableColumn, SelectModal},
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
  data: () => ({Sort})
})
export default class ExperimentsObservationsTable extends Vue {

  @Prop()
  experimentsFetch!: (programId: string, sort: ExperimentSort, paginationController: PaginationController) => (filters: any) => Promise<BiResponse>;

  private activeProgram?: Program;
  private experiments: Trial[] = [];
  private programName: string = "Program Name";

  private experimentsLoading = true;

  private paginationController: PaginationController = new PaginationController();

  private experimentDownloadTitle = 'Download Experiment';
  private experimentDownloadSubtitle = 'File Format';
  private modalActive: boolean = false;
  //private fileExtension: string;
  //private selectedExperimentDbId: string;
  private fileOptions = Object.values(FileType);
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

  mounted() {
    this.experimentCallStack = new CallStack(this.experimentsFetch(
        this.activeProgram!.id!,
        this.experimentSort,
        this.paginationController
    ));

    this.paginationController.pageSize = 20;
  }

  @Watch('paginationController', { deep: true})
  @Watch('filters', {deep: true})
  async getExperiments() {
    let currentCall = this.paginationController.currentCall
    let paginationQuery: PaginationQuery = this.paginationController.getPaginationSelections();
    if(currentCall && currentCall!.page == paginationQuery.page && currentCall!.pageSize == paginationQuery.pageSize && currentCall!.showAll == paginationQuery.showAll) {
      return;
    }

    this.paginationController.setCurrentCall(paginationQuery);

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

  activateExtensionSelect(experimentDbId: string){
    this.modalActive = true;
    this.selectedExperimentDbId = experimentDbId;
  }

  cancelDownload(){
    this.modalActive = false;
    this.selectedExperimentDbId = "";
    this.fileExtension = "";
  }

  setFileExtension(value){
    this.fileExtension = value;
  }

  getStatus(active: boolean){
    if (active) {
      return "active";
    } else {
      return "archived";
    }
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
