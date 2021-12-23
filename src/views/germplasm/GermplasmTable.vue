<template>
  <section id="germplasmTable">
    <report-table
        v-bind:report="this.report"
        v-bind:config="importConfig"
        detailed
        paginated
    />
  </section>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {validationMixin} from "vuelidate";
import {mapGetters} from "vuex";
import {Trait} from "@/breeding-insight/model/Trait";
import {StringFormatters} from "@/breeding-insight/utils/StringFormatters";
import {TraitStringFormatters} from "@/breeding-insight/utils/TraitStringFormatters";
import {ReportStruct} from "@/breeding-insight/model/report/ReportStruct";
import defaultRenames from "@/config/report/ReportRenames";
import {BrAPIFormatter} from "@/breeding-insight/model/report/BrAPIFormatter";
import ReportTable from "@/components/report/ReportTable.vue";
import {Program} from "@/breeding-insight/model/Program";
import {BrAPIService, BrAPIType} from "@/breeding-insight/service/BrAPIService";
import {Germplasm} from "@/breeding-insight/brapps/reporter/model/germplasm";

@Component({
  mixins: [validationMixin],
  components: {ReportTable},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  },
  data: () => ({Trait, StringFormatters, TraitStringFormatters})
})
export default class GermplasmTable extends Vue {

  // TODO: Add backend pagination
  // TODO: Add backend sorting

  // TODO: Male GID
  // TODO: Female GID
  // TODO: Created by
  private importConfig: any = {
    names: Object.assign(defaultRenames, {
      'defaultDisplayName': 'Name',
      'breedingMethod': 'Breeding Method',
      'seedSource': 'Source',
      'pedigree': 'Pedigree',
      'importEntryNumber': 'Entry No.',
      'createdDate': 'Created Date',
      'accessionNumber': 'GID'
    }),
    display: ['accessionNumber','defaultDisplayName',
      'additionalInfo.breedingMethod', 'seedSource', 'pedigree', "additionalInfo.createdDate"],
    detailDisplay: '*',
    defaultSort: 'accessionNumber',
    defaultSortOrder: 'asc'
  }

  private activeProgram?: Program;
  private report?: ReportStruct = BrAPIFormatter.format([], this.importConfig);

  mounted() {
    this.getGermplasm();
  }

  async getGermplasm() {
    const response = await BrAPIService.get(BrAPIType.GERMPLASM, {}, this.activeProgram!.id!, 1000, 0);
    this.processData(response.result.data as Germplasm[]);
  }

  processData(data: any[]) {
    console.log(data);
    // Do special germplasm import formatting here
    this.report = BrAPIFormatter.format(data ? data : [], this.importConfig);
  }
}
</script>