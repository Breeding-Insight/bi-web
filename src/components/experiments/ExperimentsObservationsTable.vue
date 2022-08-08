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
        v-bind:pagination="experimentsPagination"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
        v-on:paginate="paginationController.updatePage($event)"
        v-on:paginate-toggle-all="paginationController.toggleShowAll()"
        v-on:paginate-page-size="paginationController.updatePageSize($event)"
    >
      <b-table-column label="Title" cell-class="fixed-width-wrapped" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
          {{ props.row.data.trialName }}
      </b-table-column>
      <b-table-column label="Status" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
          {{ getStatus(props.row.data.active) }}
      </b-table-column>
      <b-table-column label="Date Created" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
          {{  }}
      </b-table-column>
      <b-table-column label="Created By" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{  }}
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
import { mapGetters } from 'vuex'
import {Program} from "@/breeding-insight/model/Program";
import {TrialService} from "@/breeding-insight/service/TrialService";
import EmptyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
import TableColumn from "@/components/tables/TableColumn.vue";
import {Metadata, Pagination} from "@/breeding-insight/model/BiResponse";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {Trial} from '@/breeding-insight/model/Trial'
import {Result, Err, Success, ResultGenerator } from "@/breeding-insight/model/Result";
import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
import {FileType} from "@/breeding-insight/model/FileType";
import SelectModal from "@/components/modals/SelectModal.vue";

@Component({
  mixins: [validationMixin],
  components: { ExpandableTable, EmptyTableMessage, TableColumn, SelectModal},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ExperimentsObservationsTable extends Vue {

  private activeProgram?: Program;
  private experiments: Trial[] = [];
  private experimentsPagination?: Pagination = new Pagination();
  private programName: string = "Program Name";

  private experimentsLoading = true;

  private paginationController: PaginationController = new PaginationController();

  private experimentDownloadTitle = 'Download Experiment';
  private experimentDownloadSubtitle = 'File Format';
  private modalActive: boolean = false;
  //private fileExtension: string;
  //private selectedExperimentDbId: string;
  private fileOptions = Object.values(FileType);

  mounted() {
    this.getExperiments();
  }

  @Watch('paginationController', { deep: true})
  async getExperiments() {
    let paginationQuery: PaginationQuery = PaginationController.getPaginationSelections(
        this.paginationController.currentPage,
        this.paginationController.pageSize,
        this.paginationController.showAll);

    this.paginationController.setCurrentCall(paginationQuery);

    try {
      const response: Result<Error, [Trial[], Metadata]> = await TrialService.getAll(this.activeProgram!.id!, paginationQuery);
      if(response.isErr()) throw response.value;
      let [experiments, metadata] = response.value;

      if (this.paginationController.matchesCurrentRequest(metadata.pagination)) {
        this.experiments = experiments;
        this.experimentsPagination = metadata.pagination;
      }
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

  getStatus(active){
    if (active) {
      return "active";
    } else {
      return "archived";
    }
  }

}

</script>
