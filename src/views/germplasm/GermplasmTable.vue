<template>
  <section id="germplasmTable">
    <AccessionTable>
      v-bind:germplasmFetch="germplasmFetch"
    </AccessionTable>
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
import {Pagination, BiResponse} from "@/breeding-insight/model/BiResponse";
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
import AccessionTable from "@/components/germplasm/AccessionTable.vue";

@Component({
  mixins: [validationMixin],
  components: {AccessionTable, GermplasmLink, ReportTable, ExpandableTable},
  computed: {
    ...mapGetters([
      'activeProgram'
    ]),
  },
  data: () => ({Trait, StringFormatters, TraitStringFormatters, Pedigree, GermplasmUtils, Sort})
})
export default class GermplasmTable extends Vue {

  private activeProgram?: Program;
  private germplasmFetch: (programId: string, sort: GermplasmSort, pageSize: number, page: number) => ((filters: any) => Promise<BiResponse>) =
      () => (() => Promise.resolve(new BiResponse(null)));

  mounted() {
    // Set the method used to populate the germplasm table
    this.germplasmFetch = function (programId: string, sort: GermplasmSort, pageSize: number, page: number) {
      let id = this.$route.params.listId;
      return function (filters: any) {
        return BrAPIService.get<GermplasmSortField>(
            BrAPIType.GERMPLASM,
            programId,
            sort,
            { pageSize, page },
            filters)
      };
    };
  }
}
</script>
