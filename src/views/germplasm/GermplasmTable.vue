<template>
  <section id="germplasmTable">
    <h1 class="title">
      All Germplasm
    </h1>
    <ExpandableTable
        v-bind:records.sync="germplasm"
        v-bind:loading="this.germplasmLoading"
        v-bind:pagination="pagination"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
        v-on:paginate="paginationController.updatePage($event)"
        v-on:paginate-toggle-all="paginationController.toggleShowAll(pagination.totalCount.valueOf())"
        v-on:paginate-page-size="paginationController.updatePageSize($event)"
        backend-sorting
        v-bind:default-sort="[buefyFieldMap[germplasmSort.field], Sort.orderAsBuefy(germplasmSort.order)]"
        v-on:sort="setSort"
        v-on:search="filters = $event"
        v-bind:search-debounce="400"
    >
      <b-table-column field="data.accessionNumber" label="GID" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        <GermplasmLink
            v-bind:germplasmUUID="GermplasmUtils.getGermplasmUUID(props.row.data.externalReferences)"
            v-bind:germplasmGID="props.row.data.accessionNumber"
        >
        </GermplasmLink>
      </b-table-column>
      <b-table-column field="data.defaultDisplayName" label="Name" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        {{ props.row.data.defaultDisplayName }}
      </b-table-column>
      <b-table-column field="data.breedingMethod" label="Breeding Method" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        {{ props.row.data.additionalInfo.breedingMethod }}
      </b-table-column>
      <b-table-column field="data.seedSource" label="Source" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        {{ props.row.data.seedSource }}
      </b-table-column>
      <b-table-column field="data.femaleParent" label="Female Parent GID" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        <GermplasmLink
            v-bind:germplasmUUID="Pedigree.parsePedigreeString(props.row.data.additionalInfo.pedigreeByUUID).femaleParent"
            v-bind:germplasmGID="Pedigree.parsePedigreeString(props.row.data.pedigree).femaleParent"
        > </GermplasmLink>
      </b-table-column>
      <b-table-column field="data.maleParent" label="Male Parent GID" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        <GermplasmLink
            v-bind:germplasmUUID="Pedigree.parsePedigreeString(props.row.data.additionalInfo.pedigreeByUUID).maleParent"
            v-bind:germplasmGID="Pedigree.parsePedigreeString(props.row.data.pedigree).maleParent"
        > </GermplasmLink>
      </b-table-column>
      <b-table-column field="data.createdDate" label="Created Date" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        {{ props.row.data.additionalInfo.createdDate }}
      </b-table-column>
      <b-table-column field="data.userName" label="Created By" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        {{ props.row.data.additionalInfo.createdBy.userName }}
      </b-table-column>
      <b-table-column v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        <router-link v-bind:to="{name: 'germplasm-details', params: {programId: activeProgram.id, germplasmId: GermplasmUtils.getGermplasmUUID(props.row.data.externalReferences)}}">
          Show Details
        </router-link>
      </b-table-column>

      <template v-slot:emptyMessage>
        <p class="has-text-weight-bold">
          No germplasm are currently defined for this program.
        </p>
        Germplasm are able to be created through the germplasm import.<br>
      </template>
    </ExpandableTable>
  </section>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import {validationMixin} from "vuelidate";
import {mapGetters, mapMutations} from "vuex";
import {Trait} from "@/breeding-insight/model/Trait";
import {StringFormatters} from "@/breeding-insight/utils/StringFormatters";
import {TraitStringFormatters} from "@/breeding-insight/utils/TraitStringFormatters";
import ReportTable from "@/components/report/ReportTable.vue";
import {Program} from "@/breeding-insight/model/Program";
import {BrAPIService, BrAPIType} from "@/breeding-insight/service/BrAPIService";
import {Germplasm} from "@/breeding-insight/brapi/model/germplasm";
import {Pagination} from "@/breeding-insight/model/BiResponse";
import ExpandableTable from "@/components/tables/expandableTable/ExpandableTable.vue";
import {BackendPaginationController} from "@/breeding-insight/model/view_models/BackendPaginationController";
import {Pedigree} from "@/breeding-insight/model/import/germplasm/Pedigree";
import GermplasmLink from '@/components/germplasm/GermplasmLink.vue'
import {GermplasmUtils} from '@/breeding-insight/utils/GermplasmUtils';
import {CallStack} from "@/breeding-insight/utils/CallStack";
import {
  GermplasmSort,
  GermplasmSortField,
  Sort
} from "@/breeding-insight/model/Sort";
import {UPDATE_GERMPLASM_SORT} from "@/store/sorting/mutation-types";

@Component({
  mixins: [validationMixin],
  components: {GermplasmLink, ReportTable, ExpandableTable},
  computed: {
    ...mapGetters([
      'activeProgram'
    ]),
    ...mapGetters('sorting',
        [
          'germplasmSort'
      ])
  },
  methods: {
    ...mapMutations('sorting', {
      updateSort: UPDATE_GERMPLASM_SORT
    })
  },
  data: () => ({Trait, StringFormatters, TraitStringFormatters, Pedigree, GermplasmUtils, Sort})
})
export default class GermplasmTable extends Vue {

  private activeProgram?: Program;
  private pagination?: Pagination = new Pagination();
  private paginationController: BackendPaginationController = new BackendPaginationController();
  private germplasmLoading: Boolean = false;
  private germplasm: Germplasm[] = [];
  private filters: any = {};

  private germplasmCallStack: CallStack;

  private germplasmSort!: GermplasmSort;
  private updateSort!: (sort: GermplasmSort) => void;
  private fieldMap: any = {
    'data.accessionNumber': GermplasmSortField.AccessionNumber,
    'data.defaultDisplayName' : GermplasmSortField.DefaultDisplayName,
    'data.breedingMethod': GermplasmSortField.BreedingMethod,
    'data.seedSource': GermplasmSortField.SeedSource,
    'data.femaleParent': GermplasmSortField.FemaleParent,
    'data.maleParent': GermplasmSortField.MaleParent,
    'data.createdDate': GermplasmSortField.CreatedDate,
    'data.userName': GermplasmSortField.UserName,
  };
  private buefyFieldMap: any = Object.keys(this.fieldMap)
      .reduce((obj, key) => Object.assign({}, obj, { [this.fieldMap[key]]: key }), {});

  mounted() {
    this.germplasmCallStack = new CallStack((options) => BrAPIService.get(BrAPIType.GERMPLASM, this.activeProgram!.id!, this.germplasmSort,
        { pageSize: this.paginationController.pageSize, page: this.paginationController.currentPage - 1 }));
    this.paginationController.pageSize = 20;
  }

  @Watch('paginationController', { deep: true})
  @Watch('filters', {deep: true})
  async getGermplasm() {
    this.germplasmLoading = true;
    try {

      // Only process the most recent call
      const {call, callId} = this.germplasmCallStack.makeCall(this.filters);
      const response = await call;
      if (!this.germplasmCallStack.isCurrentCall(callId)) return;

      this.pagination = new Pagination(response.metadata.pagination);
      // Account for brapi 0 indexing of paging
      this.pagination.currentPage = this.pagination.currentPage.valueOf() + 1;
      this.germplasm = response.result.data;
      this.germplasmLoading = false;
    } catch (e) {
      this.$log.error(e);
      this.$emit('show-error-notification', 'Error loading germplasm');
      this.germplasmLoading = false;
    }

  }

  setSort(field: string, order: string) {
    if (field in this.fieldMap) {
      this.updateSort(new GermplasmSort(this.fieldMap[field], Sort.orderAsBI(order)));
      this.getGermplasm();
    }
  }

}
</script>