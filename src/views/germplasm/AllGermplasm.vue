<template>
  <section id="germplasmTable">
    <GermplasmTable
      v-bind:germplasmFetch="germplasmFetch"
      >
    </GermplasmTable>
  </section>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {validationMixin} from "vuelidate";
import {mapGetters} from "vuex";
import {Trait} from "@/breeding-insight/model/Trait";
import {StringFormatters} from "@/breeding-insight/utils/StringFormatters";
import {TraitStringFormatters} from "@/breeding-insight/utils/TraitStringFormatters";
import ReportTable from "@/components/report/ReportTable.vue";
import {Program} from "@/breeding-insight/model/Program";
import {BrAPIService, BrAPIType} from "@/breeding-insight/service/BrAPIService";
import {BiResponse} from "@/breeding-insight/model/BiResponse";
import ExpandableTable from "@/components/tables/expandableTable/ExpandableTable.vue";
import {Pedigree} from "@/breeding-insight/model/import/germplasm/Pedigree";
import GermplasmLink from '@/components/germplasm/GermplasmLink.vue'
import {GermplasmUtils} from '@/breeding-insight/utils/GermplasmUtils';
import {
  GermplasmSort,
  GermplasmSortField,
  Sort
} from "@/breeding-insight/model/Sort";
import GermplasmTable from "@/components/germplasm/GermplasmTable.vue";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";

@Component({
  mixins: [validationMixin],
  components: {GermplasmTable, GermplasmLink, ReportTable, ExpandableTable},
  computed: {
    ...mapGetters([
      'activeProgram'
    ]),
  },
  data: () => ({Trait, StringFormatters, TraitStringFormatters, Pedigree, GermplasmUtils, Sort})
})
export default class AllGermplasm extends Vue {

  private activeProgram?: Program;

  // Set the method used to populate the germplasm table
  private germplasmFetch: (programId: string, sort: GermplasmSort, paginationController: PaginationController) => ((filters: any) => Promise<BiResponse>) =
      function (programId: string, sort: GermplasmSort, paginationController: PaginationController) {
        return function (filters: any) {
          return BrAPIService.get<GermplasmSortField>(
              BrAPIType.GERMPLASM,
              programId,
              sort,
              { pageSize: paginationController.pageSize, page: paginationController.currentPage - 1 },
              filters)
        };
      };
}
</script>
