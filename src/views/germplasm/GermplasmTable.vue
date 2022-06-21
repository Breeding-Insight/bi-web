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
        v-on:sort="paginationController.updateSort($event)"
        v-on:filters-change="searchColumn"
        v-bind:search-debounce="750"
    >
      <b-table-column field="accessionNumber" label="GID" v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        <GermplasmLink
            v-bind:germplasmUUID="GermplasmUtils.getGermplasmUUID(props.row.data.externalReferences)"
            v-bind:germplasmGID="props.row.data.accessionNumber"
        >
        </GermplasmLink>
      </b-table-column>
      <b-table-column field="defaultDisplayName" label="Name" v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        {{ props.row.data.defaultDisplayName }}
      </b-table-column>
      <b-table-column field="breedingMethod" label="Breeding Method" v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        {{ props.row.data.additionalInfo.breedingMethod }}
      </b-table-column>
      <b-table-column field="seedSource" label="Source" v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        {{ props.row.data.seedSource }}
      </b-table-column>
      <b-table-column field="femaleParentGID" label="Female Parent GID" v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        <GermplasmLink
            v-bind:germplasmUUID="Pedigree.parsePedigreeString(props.row.data.additionalInfo.pedigreeByUUID).femaleParent"
            v-bind:germplasmGID="Pedigree.parsePedigreeString(props.row.data.pedigree).femaleParent"
        > </GermplasmLink>
      </b-table-column>
      <b-table-column field="maleParentGID" label="Male Parent GID" v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        <GermplasmLink
            v-bind:germplasmUUID="Pedigree.parsePedigreeString(props.row.data.additionalInfo.pedigreeByUUID).maleParent"
            v-bind:germplasmGID="Pedigree.parsePedigreeString(props.row.data.pedigree).maleParent"
        > </GermplasmLink>
      </b-table-column>
      <b-table-column field="createdDate" label="Created Date" v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
        {{ props.row.data.additionalInfo.createdDate }}
      </b-table-column>
      <b-table-column field="createdByUserName" label="Created By" v-slot="props" :th-attrs="(column) => ({scope:'col'})" searchable>
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
import {mapGetters} from "vuex";
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

@Component({
  mixins: [validationMixin],
  components: {GermplasmLink, ReportTable, ExpandableTable},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  },
  data: () => ({Trait, StringFormatters, TraitStringFormatters, Pedigree, GermplasmUtils})
})
export default class GermplasmTable extends Vue {

  private activeProgram?: Program;
  private pagination?: Pagination = new Pagination();
  private paginationController: BackendPaginationController = new BackendPaginationController();
  private germplasmLoading: Boolean = false;
  private germplasm: Germplasm[] = [];
  private filters: any = {};

  private germplasmCallStack: CallStack;

  mounted() {
    this.germplasmCallStack = new CallStack((options) => BrAPIService.get(BrAPIType.GERMPLASM, options, this.activeProgram!.id!,
        this.paginationController.pageSize, this.paginationController.currentPage - 1));
    this.paginationController.pageSize = 20;
  }

  @Watch('paginationController', { deep: true})
  @Watch('filters', {deep: true})
  async getGermplasm() {
    this.germplasmLoading = true;
    try {
      if (this.paginationController.showAll) {
        this.paginationController.pageSize = this.pagination!.totalCount.valueOf();
        this.paginationController.currentPage = 1;
        this.paginationController.showAll = false;
      }

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

  async searchColumn(filters: any) {
    this.filters = filters;
  }
}
</script>