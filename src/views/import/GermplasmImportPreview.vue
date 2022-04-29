<template>
  <ExpandableTable
      v-bind:records="processPreviewData(previewData)"
      v-bind:loading="false"
      v-bind:pagination="pagination"
      v-bind:rowClasses="constructRowClasses(previewData)"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
  >
    <b-table-column field="defaultDisplayName" label="Name" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
      <AlertTriangleIcon
          size="1x"
          class="has-vertical-align-middle"
          v-if="props.row.data.state === ImportObjectState.EXISTING"
      >
      </AlertTriangleIcon>
      {{ props.row.data.brAPIObject.defaultDisplayName }}
    </b-table-column>
    <b-table-column field="breedingMethod" label="Breeding Method" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
      {{ props.row.data.brAPIObject.additionalInfo.breedingMethod }}
    </b-table-column>
    <b-table-column field="seedSource" label="Source" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
      {{ props.row.data.brAPIObject.seedSource }}
    </b-table-column>
    <b-table-column field="pedigree" label="Pedigree" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
      {{ props.row.data.brAPIObject.pedigree }}
    </b-table-column>
    <b-table-column field="femaleParentGid" label="Female Parent GID" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
      {{ props.row.data.brAPIObject.additionalInfo.femaleParentGid }}
    </b-table-column>
    <b-table-column field="maleParentGid" label="Male Parent GID" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
      {{ props.row.data.brAPIObject.additionalInfo.maleParentGid }}
    </b-table-column>
    <b-table-column field="importEntryNumber" label="Entry No." v-slot="props" :th-attrs="(column) => ({scope:'col'})">
      {{ props.row.data.brAPIObject.additionalInfo.importEntryNumber }}
    </b-table-column>
    <b-table-column field="femaleParentEntryNo" label="Female Parent Entry No." v-slot="props" :th-attrs="(column) => ({scope:'col'})">
      {{ props.row.data.brAPIObject.additionalInfo.femaleParentEntryNo }}
    </b-table-column>
    <b-table-column field="maleParentEntryNo" label="Male Parent Entry No." v-slot="props" :th-attrs="(column) => ({scope:'col'})">
      {{ props.row.data.brAPIObject.additionalInfo.maleParentEntryNo }}
    </b-table-column>
    <b-table-column field="externalUID" label="External UID" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
      {{ ExternalUID.getExternalUIDFromExternalReferences(props.row.data.brAPIObject.externalReferences, props.row.data.brAPIObject.seedSource) }}
    </b-table-column>

    <template v-slot:emptyMessage>
      <p class="has-text-weight-bold">
        No germplasm were found in this import file.
      </p>
    </template>
  </ExpandableTable>
</template>

<script lang="ts">

import {Component, Prop, Vue} from "vue-property-decorator";
import {mapGetters} from "vuex";
import {ExternalUID} from "@/breeding-insight/model/import/germplasm/ExternalUID";
import {ImportObjectState} from "@/breeding-insight/model/import/ImportObjectState";
import ExpandableTable from "@/components/tables/expandableTable/ExpandableTable.vue";
import {AlertTriangleIcon} from "vue-feather-icons";
import {Pagination} from "@/breeding-insight/model/BiResponse";

@Component({
  components: {ExpandableTable, AlertTriangleIcon},
  computed: {
    ...mapGetters([
      'activeProgram',
      'activeUser'
    ])
  },
  data: () => ({ImportObjectState, ExternalUID})
})
export default class GermplasmImportPreview extends Vue {
  @Prop()
  private previewData!: any[];
  @Prop()
  private pagination!: Pagination;

  private duplicateClassName = "is-dup";

  processPreviewData(importPreviewRows: any): any[] {
    // Do special germplasm import formatting here
    console.log(importPreviewRows);
    return importPreviewRows ? importPreviewRows.map((record:any) => record.germplasm) : [];
  }

  constructRowClasses(importPreviewRows: any): any[] {
    // Do special germplasm import formatting here
    const rowClasses: any = {};
    for (const record of this.processPreviewData(importPreviewRows)) {
      if (record.state === ImportObjectState.EXISTING) {
        rowClasses[record.id] = this.duplicateClassName;
      }
    }
    return rowClasses;
  }
}
</script>

<style scoped>

</style>