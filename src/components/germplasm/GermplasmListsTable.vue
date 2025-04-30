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
  <section id="germplasmListTableLabel">
    <ExpandableTable
      v-bind:records.sync="germplasmLists"
      v-bind:loading="this.germplasmListsLoading"
      v-bind:pagination="paginationController"
      backend-sorting
      backend-filtering
      v-bind:default-sort="[fieldMap['dateCreated'], 'Desc']"
      v-on:sort="setSort"
      v-on:search="initSearch"
      v-bind:search-debounce="400"
    >
      <b-table-column field="name" label="Name" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        {{ props.row.data.listName}}
      </b-table-column>
      <b-table-column field="description" label="Description" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        {{ props.row.data.listDescription }}
      </b-table-column>
      <b-table-column field="size" label="Total Entries" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        {{ props.row.data.listSize }}
      </b-table-column>
      <b-table-column field="dateCreated" label="Created Date" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        {{ formatDate(props.row.data.dateCreated) }}
      </b-table-column>
      <b-table-column field="ownerName" label="Created By" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        {{ props.row.data.listOwnerName }}
      </b-table-column>
      <b-table-column  field="data.listDbId" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        <router-link v-bind:to="{name: 'germplasm-by-list', params: {programId: activeProgram.id, listId: props.row.data.listDbId}}">
          Details
        </router-link>
        <GermplasmDownloadButton
          v-bind:modal-title="`Download ${props.row.data.listName}`"
          fieldset-legend="File Format"
          v-bind:listDbId="props.row.data.listDbId"
        >
          Download
        </GermplasmDownloadButton>
      </b-table-column>

      <template v-slot:emptyMessage>
        <EmptyTableMessage>
          <p class="has-text-weight-bold">
            Germplasm lists not yet specified or no matching lists found.
          </p>
        </EmptyTableMessage>
      </template>
    </ExpandableTable>
  </section>
</template>

<script lang="ts">
import {Component, Vue, Watch, Prop} from 'vue-property-decorator'
import {DownloadIcon} from 'vue-feather-icons'
import {validationMixin} from 'vuelidate';
import { mapGetters, mapMutations } from 'vuex'
import {Program} from "@/breeding-insight/model/Program";
import BasicInputField from "@/components/forms/BasicInputField.vue";
import EmptyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
import TableColumn from "@/components/tables/TableColumn.vue";
import {BiResponse} from "@/breeding-insight/model/BiResponse";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import BaseTraitForm from "@/components/trait/forms/BaseTraitForm.vue";
import {GermplasmList} from "@/breeding-insight/model/GermplasmList";
import {GermplasmService} from "@/breeding-insight/service/GermplasmService";
import ExpandableTable from "@/components/tables/expandableTable/ExpandableTable.vue";
import moment from "moment";
import {FileTypeOption} from "@/breeding-insight/model/FileTypeOption";
import GermplasmDownloadButton from '@/components/germplasm/GermplasmDownloadButton.vue';
import {UPDATE_GERMPLASM_LIST_SORT} from "@/store/sorting/mutation-types";
import {CallStack} from "@/breeding-insight/utils/CallStack";
import {
  GermplasmListSort,
  Sort,
  GermplasmListSortField, GermplasmSort
} from "@/breeding-insight/model/Sort";
import {UPDATE_EXPERIMENT_SORT} from "@/store/sorting/mutation-types";
import { PaginationQuery } from '@/breeding-insight/model/PaginationQuery';
import {BaseFilter} from "@/breeding-insight/model/BaseFilter";
import {MOMENT_BRAPI_DATE_FORMAT} from "@/breeding-insight/utils/BrAPIDateTime";

@Component({
  mixins: [validationMixin],
  components: {
    ExpandableTable,
    BaseTraitForm, BasicInputField, EmptyTableMessage, TableColumn,
    DownloadIcon, GermplasmDownloadButton },
  computed: {
    ...mapGetters([
      'activeProgram'
    ]),
    ...mapGetters('sorting',
      [
        'germplasmListSort'
      ])
  },
  methods: {
    ...mapMutations('sorting', {
      updateSort: UPDATE_GERMPLASM_LIST_SORT
    })
  },
  data: () => ({Sort})
})
export default class GermplasmListsTable extends Vue {

  @Prop()
  germplasmListFetch!: (programId: string, sort: GermplasmListSort, paginationController: PaginationController) => (filters: any) => Promise<BiResponse>;

  private activeProgram?: Program;
  private paginationController: PaginationController = new PaginationController();
  private germplasmLists: GermplasmList[] = [];
  private germplasmListsLoading = true;

  private germplasmListDownloadTitle = 'Download Germplasm List';
  private germplasmListDownloadSubtitle = 'File Format';
  private modalActive: boolean = false;
  private fileOptions = Object.values(FileTypeOption);

  private germplasmListSort!: GermplasmListSort;
  private filters: BaseFilter = new BaseFilter();
  private germplasmListCallStack?: CallStack;

  private updateSort!: (sort: GermplasmListSort) => void;
  private fieldMap: any = {
    'name': GermplasmListSortField.Name,
    'description': GermplasmListSortField.Description,
    'size': GermplasmListSortField.TotalEntries,
    'dateCreated': GermplasmListSortField.CreatedDate,
    'ownerName': GermplasmListSortField.CreatedBy
  };

  initSearch(filter: any) {

    // Merge, overriding any properties of this.filters that exist in filter.
    this.filters = {...this.filters, ...filter};

    // When filtering the list, set the page to the first page.
    this.paginationController.updatePage(1);
  }

  mounted() {
    this.germplasmListCallStack = new CallStack(this.germplasmListFetch(
        this.activeProgram!.id!,
        this.germplasmListSort,
        this.paginationController
    ));
    this.paginationChanged();
  }

  @Watch('paginationController', { deep: true})
  paginationChanged() {
    let currentCall = this.paginationController.currentCall
    let paginationQuery = this.paginationController.getPaginationSelections();
    if(currentCall && currentCall!.page == paginationQuery.page && currentCall!.pageSize == paginationQuery.pageSize && currentCall!.showAll == paginationQuery.showAll) {
      return;
    }
    this.updatePagination();
    this.getGermplasmLists();
  }

  updatePagination() {
    let paginationQuery: PaginationQuery = this.paginationController.getPaginationSelections();
    this.paginationController.setCurrentCall(paginationQuery);
  }

  @Watch('filters', {deep: true})
  async getGermplasmLists() {
    this.germplasmListsLoading = true;
    try {
      const {call, callId} = this.germplasmListCallStack.makeCall(this.filters);
      const response = await call;
      if (!this.germplasmListCallStack.isCurrentCall(callId))
        return;
      this.paginationController.setPaginationInfo(response.metadata.pagination);
      // Account for brapi 0 indexing of paging
      this.paginationController.currentPage = this.paginationController.currentPage.valueOf() + 1;
      this.germplasmLists = response.result.data;
      this.germplasmListsLoading = false;
    } catch (err) {
      this.$emit('show-error-notification', 'Error while trying to load germplasm lists');
    } finally {
      this.germplasmListsLoading = false;
    }
  }

  formatDate(date: Date) {
    return moment(date).format(MOMENT_BRAPI_DATE_FORMAT);
  }

  setSort(field: string, order: string) {
    if (field in this.fieldMap) {
      this.updateSort(new GermplasmListSort(this.fieldMap[field], Sort.orderAsBI(order)));
      this.getGermplasmLists();
    }
  }
}
</script>
