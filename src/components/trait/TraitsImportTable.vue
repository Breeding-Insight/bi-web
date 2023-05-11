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
  <section id="traitsImportTableLabel">
    <SidePanelTable
      v-if="loaded"
      v-bind:records.sync="traits"
      v-bind:editable="false"
      v-bind:pagination="traitsPagination"
      v-bind:auto-handle-close-panel-event="true"
      v-bind:side-panel-state="traitSidePanelState"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
      v-on:paginate="paginationController.updatePage($event)"
      v-on:paginate-toggle-all="paginationController.toggleShowAll(traitsPagination.totalCount.valueOf())"
      v-on:paginate-page-size="paginationController.updatePageSize(parseInt($event, 10))"
      v-on:collapse-columns="collapseColumns = true"
      v-on:uncollapse-columns="collapseColumns = false"
    >
      <!-- 
        Table row column slot specification
        data: T
      -->
      <template v-slot:columns="data">
        <TableColumn
            name="name"
            v-bind:label="'Name'"
            v-bind:sortField="importPreviewOntologySort.field"
            v-bind:sortFieldLabel="nameSortLabel"
            v-bind:sortable="true"
            v-bind:sortOrder="importPreviewOntologySort.order"
            v-on:newSortColumn="newSortColumn"
            v-on:toggleSortOrder="toggleSortOrder"
        >
            <AlertTriangleIcon
                size="1x"
                class="has-vertical-align-middle"
                v-if="data.isDup"
            >
            </AlertTriangleIcon>
          {{ data.observationVariableName }}
        </TableColumn>
        <TableColumn
            name="termType"
            v-bind:label="'Term Type'"
            v-bind:visible="!collapseColumns"
            v-bind:sortField="importPreviewOntologySort.field"
            v-bind:sortFieldLabel="termTypeSortLabel"
            v-bind:sortable="true"
            v-bind:sortOrder="importPreviewOntologySort.order"
            v-on:newSortColumn="newSortColumn"
            v-on:toggleSortOrder="toggleSortOrder"
        >
          {{ TraitStringFormatters.getTermTypeString(data.termType) }}
        </TableColumn>
        <TableColumn
            name="trait"
            v-bind:label="'Trait'"
            v-bind:visible="!collapseColumns"
            v-bind:sortField="importPreviewOntologySort.field"
            v-bind:sortFieldLabel="entityAttributeSortLabel"
            v-bind:sortable="true"
            v-bind:sortOrder="importPreviewOntologySort.order"
            v-on:newSortColumn="newSortColumn"
            v-on:toggleSortOrder="toggleSortOrder"
        >
          {{ data.entity | capitalize }} {{ data.attribute | capitalize }}
        </TableColumn>
        <TableColumn
            name="method"
            v-bind:label="'Method'"
            v-bind:visible="!collapseColumns"
            v-bind:sortField="importPreviewOntologySort.field"
            v-bind:sortFieldLabel="methodSortLabel"
            v-bind:sortable="true"
            v-bind:sortOrder="importPreviewOntologySort.order"
            v-on:newSortColumn="newSortColumn"
            v-on:toggleSortOrder="toggleSortOrder"
        >
          {{ (data.method.description ? data.method.description + " ": "") + StringFormatters.toStartCase(data.method.methodClass) }}
        </TableColumn>
        <TableColumn
            name="scaleClass"
            v-bind:label="'Scale Class'"
            v-bind:visible="!collapseColumns"
            v-bind:sortField="importPreviewOntologySort.field"
            v-bind:sortFieldLabel="scaleClassSortLabel"
            v-bind:sortable="true"
            v-bind:sortOrder="importPreviewOntologySort.order"
            v-on:newSortColumn="newSortColumn"
            v-on:toggleSortOrder="toggleSortOrder"
        >
          {{ TraitStringFormatters.getScaleTypeString(data.scale) }}
        </TableColumn>
        <TableColumn
            name="unit"
            v-bind:label="'Unit'"
            v-bind:visible="!traitSidePanelState.collapseColumns"
            v-bind:sortField="importPreviewOntologySort.field"
            v-bind:sortFieldLabel="unitSortLabel"
            v-bind:sortable="true"
            v-bind:sortOrder="importPreviewOntologySort.order"
            v-on:newSortColumn="newSortColumn"
            v-on:toggleSortOrder="toggleSortOrder"
        >
          <template v-if="data.scale.dataType==='NUMERICAL'">
            {{ data.scale.scaleName }}
          </template>
        </TableColumn>
      </template>

      <!-- 
        Side panel data slot specification
        data: T
      -->
      <template v-slot:side-panel="{tableRow}">
        <TraitDetailPanel
            v-bind:data="tableRow"
            v-bind:loading-editable="loadingTraitEditable"
            v-bind:from-import-table="isImportTable"
        />
      </template>

      <!-- 
        Table display when no data
      -->
      <template v-slot:emptyMessage>
        <EmptyTableMessage>
          <p class="has-text-weight-bold">
            No traits in file.
          </p>
          <p>
            Add traits to the file to see data here.
          </p>
        </EmptyTableMessage>
      </template>
      
    </SidePanelTable>
  </section>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {PlusCircleIcon} from 'vue-feather-icons'
  import {validationMixin} from 'vuelidate'
  import SidePanelTable from "@/components/tables/SidePanelTable.vue";
  import TraitDetailPanel from "@/components/trait/TraitDetailPanel.vue";
  import TableColumn from "@/components/tables/TableColumn.vue";
  import {Trait} from '@/breeding-insight/model/Trait'
  import { mapGetters, mapMutations } from 'vuex'
  import {Program} from "@/breeding-insight/model/Program";
  import EmptyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
  import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
  import {Pagination} from "@/breeding-insight/model/BiResponse";
  import { TraitUploadService } from '@/breeding-insight/service/TraitUploadService';
  import { Method } from '../../breeding-insight/model/Method';
  import { StringFormatters } from '@/breeding-insight/utils/StringFormatters';
  import { TraitStringFormatters } from '@/breeding-insight/utils/TraitStringFormatters';
  import {ProgramUpload} from "@/breeding-insight/model/ProgramUpload";
  import {SidePanelTableEventBusHandler} from "@/components/tables/SidePanelTableEventBus";
  import { AlertTriangleIcon } from 'vue-feather-icons';
  import {
    IMPORT_PREVIEW_ONT_NEW_SORT_COLUMN,
    IMPORT_PREVIEW_ONT_TOGGLE_SORT_ORDER
  } from "@/store/sorting/mutation-types";
  import {OntologySort, OntologySortField} from "@/breeding-insight/model/Sort";
  import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";

  @Component({
    mixins: [validationMixin],
    components: {
      TableColumn, SidePanelTable, TraitDetailPanel,
      PlusCircleIcon, EmptyTableMessage, AlertTriangleIcon
    },
    computed: {
      ...mapGetters([
        'activeProgram'
      ]),
      ...mapGetters('sorting', [
        'importPreviewOntologySort'
      ])
    },
    methods: {
      ...mapMutations('sorting', {
        newSortColumn: IMPORT_PREVIEW_ONT_NEW_SORT_COLUMN,
        toggleSortOrder: IMPORT_PREVIEW_ONT_TOGGLE_SORT_ORDER
      })
    },
    filters: {
      capitalize: function(value: string | undefined) : string | undefined {
        if (value === undefined) value = '';
        return StringFormatters.toStartCase(value);
      }
    },
    data: () => ({StringFormatters, TraitStringFormatters})
  })
export default class TraitsImportTable extends Vue {

  private activeProgram?: Program;
  private traitsPagination?: Pagination = new Pagination();
  private paginationController: PaginationController = new PaginationController();
  private traits : Trait[] = [];
  private upload?: ProgramUpload;
  private loaded = false;
  private collapseColumns = false;
  private traitSidePanelState: SidePanelTableEventBusHandler = new SidePanelTableEventBusHandler();
  private importPreviewOntologySort!: OntologySort;
  private newSortColumn!: (field: OntologySortField) => void;
  private toggleSortOrder!: () => void;

  //On import should not be editable and should not be loading editability status
  private loadingTraitEditable = false;
  private isImportTable = true;

  // table column sorting
  private nameSortLabel: string = OntologySortField.Name;
  private methodSortLabel: string = OntologySortField.MethodHandle;
  private scaleClassSortLabel: string = OntologySortField.ScaleClass;
  private unitSortLabel: string = OntologySortField.ScaleName;
  private entityAttributeSortLabel: string = OntologySortField.entityAttributeSortLabel;
  private termTypeSortLabel: string = OntologySortField.TermType;

  mounted() {
    this.updatePagination();
    this.getTraitUpload();
  }

  @Watch('paginationController', { deep: true})
  paginationChanged() {
    let currentCall = this.paginationController.currentCall
    let paginationQuery = this.paginationController.getPaginationSelections();
    if(currentCall && currentCall!.page == paginationQuery.page && currentCall!.pageSize == paginationQuery.pageSize && currentCall!.showAll == paginationQuery.showAll) {
      return;
    }
    this.updatePagination();
    this.getTraitUpload();
  }

  updatePagination() {
    let paginationQuery: PaginationQuery = this.paginationController.getPaginationSelections();
    this.paginationController.setCurrentCall(paginationQuery);
  }

  @Watch('importPreviewOntologySort', {deep: true})
  getTraitUpload() {
    TraitUploadService.getTraits(this.activeProgram!.id!, this.paginationController.currentCall, this.importPreviewOntologySort).then(([upload, metadata]) => {
      if (this.paginationController.matchesCurrentRequest(metadata.pagination)){
        this.traits = upload.data || [];
        this.traitsPagination = metadata.pagination;
        this.paginationController.setPaginationInfo(metadata.pagination);
      }

    }).catch((error) => {
      // Display error that users cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load program users');
      throw error;
    }).finally(() => {
      this.loadedData();
    });
  }

  loadedData() {
    this.loaded = true;
    this.$emit('loaded');
  }

}

</script>
