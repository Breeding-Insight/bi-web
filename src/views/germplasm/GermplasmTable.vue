<template>
  <section id="germplasmTable">
    <ExpandableTable
        v-bind:records.sync="germplasm"
        v-bind:loading="this.germplasmLoading"
        v-bind:pagination="pagination"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
        v-on:paginate="paginationController.updatePage($event)"
        v-on:paginate-toggle-all="paginationController.toggleShowAll()"
        v-on:paginate-page-size="paginationController.updatePageSize($event)"
        v-on:sort="paginationController.updateSort($event)"
    >
      <b-table-column field="accessionNumber" label="GID" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.accessionNumber }}
      </b-table-column>
      <b-table-column field="defaultDisplayName" label="Name" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.defaultDisplayName }}
      </b-table-column>
      <b-table-column field="additionalInfo.breedingMethod" label="Breeding Method" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.additionalInfo.breedingMethod }}
      </b-table-column>
      <b-table-column field="seedSource" label="Source" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.seedSource }}
      </b-table-column>
      <b-table-column field="pedigree" label="Parental GIDs" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.pedigree }}
      </b-table-column>
      <b-table-column field="createdDate" label="Created Date" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.additionalInfo.createdDate }}
      </b-table-column>
      <b-table-column field="createdBy.userName" label="Created By" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.additionalInfo.createdBy.userName }}
      </b-table-column>
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
import {Germplasm} from "@/breeding-insight/brapps/reporter/model/germplasm";
import {Pagination} from "@/breeding-insight/model/BiResponse";
import ExpandableTable from "@/components/tables/expandableTable/ExpandableTable.vue";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";

@Component({
  mixins: [validationMixin],
  components: {ReportTable, ExpandableTable},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  },
  data: () => ({Trait, StringFormatters, TraitStringFormatters})
})
export default class GermplasmTable extends Vue {

  private activeProgram?: Program;
  private pagination?: Pagination = new Pagination();
  private paginationController: PaginationController = new PaginationController();
  private germplasmLoading: Boolean = false;
  private germplasm: Germplasm[] = [];

  mounted() {
    this.paginationController.pageSize = 20;
    this.getGermplasm();
  }

  @Watch('paginationController', { deep: true})
  async getGermplasm() {
    this.germplasmLoading = true;
    try {
      if (this.paginationController.showAll) {
        this.paginationController.pageSize = this.pagination.totalCount;
        this.paginationController.currentPage = 1;
        this.paginationController.showAll = false;
      }
      const response = await BrAPIService.get(BrAPIType.GERMPLASM, {}, this.activeProgram!.id!,
          this.paginationController.pageSize, this.paginationController.currentPage - 1);
      this.pagination = new Pagination(response.metadata.pagination);
      // Account for brapi 0 indexing of paging
      this.pagination.currentPage = this.pagination.currentPage.valueOf() + 1;
      this.germplasm = response.result.data;
      this.germplasmLoading = false;
    } catch (e) {
      this.$emit('show-error-notification', 'Error loading germplasm');
      this.germplasmLoading = false;
    }

  }

}
</script>