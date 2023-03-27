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
  <div id="germplasm-genotype">
    <div v-if="loading">
      loading genotype data
    </div>
    <div v-if="!loading && callsetOptions.length === 0">
      No genotype data exists for this germplasm
    </div>
    <div class="columns" v-if="!loading && callsetOptions.length > 0">
      <div class="column">
        <label for="callsets">Callsets: </label>
        <div class="select">
          <select name="callsets" v-model="currentCallSetId" v-on:change="switchCallset($event.target.value)">
            <option v-for="callset in callsetOptions"
                    v-bind:key="callset.callSetDbId"
                    :value="callset.callSetDbId">
              {{callset.callSetName}}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="columns metadata" v-if="!loading">
      <div class="column">
        <div v-for="metadata in currentMetadataColumns" :key="metadata.fieldAbbreviation">
          <span class="abbreviation has-text-weight-bold">{{ metadata.fieldAbbreviation }}:</span><span class="name">{{ metadata.fieldName }}</span>
        </div>
      </div>
    </div>
    <ExpandableTable
        v-bind:records.sync="currentCallSet"
        v-bind:loading="loading"
        v-bind:pagination="pagination"
        v-bind:default-sort="['variantName', 'asc']"
        v-bind:debounce-search="400"
        v-bind:details="true"
        v-if="!loading && callsetOptions.length > 0"
    >
      <b-table-column field="variantName" label="Chromosome" sortable searchable :customSearch="filterByVariant" :customSort="sortVariantName" :th-attrs="(column) => ({scope:'col'})">
        <template v-slot="props">
          {{ getVariant(props.row.data.variantDbId).referenceName }}
        </template>

        <template v-slot:searchable="props">
          <div class="select">
            <select
                v-model="props.filters[props.column.field]"
            >
              <option value=""></option>
              <option v-for="variant in variantOptions" :key="variant" :value="variant">{{ variant }}</option>
            </select>
          </div>
        </template>
      </b-table-column>
      <b-table-column field="variantPosition"  label="Position" sortable :customSearch="(row, position) => filterVariantPosition(row, position)" :customSort="sortVariantPosition" :th-attrs="(column) => ({scope:'col'})">
        <template v-slot="props">
          {{ getVariant(props.row.data.variantDbId).start }}
        </template>
<!--        TODO plan for how to filter by position -->
<!--        <template v-slot:searchable="props">-->
<!--          <MultiSelectDropdown-->
<!--              v-model="props.filters[props.column.field]"-->
<!--              v-bind:options="positionOptions"-->
<!--              v-bind:multiple="true"-->
<!--            />-->
<!--        </template>-->
      </b-table-column>
      <b-table-column label="Ref" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        <span class="tag is-success">
            {{ getVariant(props.row.data.variantDbId).referenceBases }}
        </span>
      </b-table-column>
      <b-table-column label="Alt(s)" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        <span class="tag alt-allele is-warning" v-for="alt in getVariant(props.row.data.variantDbId).alternateBases" :key="alt+'-'+props.index">
            {{ alt }}
        </span>
      </b-table-column>

      <b-table-column label="Genotype(s)" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        <span class="tag alt-allele" v-for="(allele, index) in getGenotypes(props.row.data)" :class="alleleType(allele, props.row.data.variantDbId)" :key="allele+'-'+index+'-'+props.index">
            {{ genotypeVal(allele, props.row.data.variantDbId) }}
        </span>
      </b-table-column>

      <b-table-column v-for="metadata in currentMetadataColumns" :key="metadata.fieldAbbreviation" :label="metadata.fieldAbbreviation" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.genotypeMetadata.filter(rowMetadata => rowMetadata.fieldAbbreviation === metadata.fieldAbbreviation)[0].fieldValue }}
      </b-table-column>

      <template v-slot:detail="{row}">
        <div class="column">
          <div>
            <span class="has-text-weight-bold">Reference Name: </span>{{ getVariant(row.variantDbId).referenceName }}
          </div>
          <div>
            <span class="has-text-weight-bold">Start: </span>{{ getVariant(row.variantDbId).start }}
          </div>
          <div>
            <span class="has-text-weight-bold">End: </span>{{ getVariant(row.variantDbId).end }}
          </div>
        </div>
      </template>

      <template v-slot:emptyMessage>
        <p class="has-text-weight-bold">
          No genotype has been recorded
        </p>
      </template>
    </ExpandableTable>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import GermplasmBase from '@/components/germplasm/GermplasmBase.vue';
import { Program } from '@/breeding-insight/model/Program';
import { mapGetters } from 'vuex';
import { GenoService } from '@/breeding-insight/service/GenoService';
import { GermplasmGenotype } from '@/breeding-insight/model/GermplasmGenotype';
import { Pagination } from '@/breeding-insight/model/BiResponse';
import { PaginationController } from '@/breeding-insight/model/view_models/PaginationController';
import { Call } from '@/breeding-insight/brapi/model/geno/call';
import { CallSet } from '@/breeding-insight/brapi/model/geno/callSet';
import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
import { Variant } from '@/breeding-insight/brapi/model/geno/variant';
import { TableRow } from '@/breeding-insight/model/view_models/TableRow';
import MultiSelectDropdown from '@/components/forms/MultiSelectDropdown.vue';

@Component({
  components: { ExpandableTable, MultiSelectDropdown },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class GermplasmGenotypeView extends GermplasmBase {
  private activeProgram?: Program;
  private genotypeData?: GermplasmGenotype;
  private ploidy: number = 0;
  private loading: boolean = true;
  private callsetOptions?: Array<CallSet> = [];
  private variantOptions?: Array<string> = [];
  private positionOptions?: Array<number> = [];
  private currentCallSetId?: string = "";
  private currentCallSet?: Array<Call> = []; //for displaying the calls
  private currentMetadataColumns?: Array<any> = []; //for displaying the dynamic columns
  private pagination: Pagination = new Pagination();
  private paginationController: PaginationController = new PaginationController();
  private positionOptionSelectOpen: boolean = false;

  mounted () {
    this.fetchGenotypeData();
  }

  get germplasmUUID (): string {
    return this.$route.params.germplasmId;
  }

  async switchCallset(callsetId: string, pause: boolean = true) {
    this.loading = true;
    this.currentCallSet = [];

    if(pause) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.currentCallSetId = callsetId;
    const callsByCallset: Map<string, Array<Call>> = new Map(Object.entries(this.genotypeData!.calls!));
    const callSet = callsByCallset.get(callsetId);

    const metadataCols = new Map<string, any>();
    const variantOps = new Set<string>();
    const positionOps = new Set<number>();
    let largestPloidy = 0;

    callSet!.forEach(call => {
      if(call.genotypeMetadata) {
          call.genotypeMetadata.forEach((val: any) => {
            metadataCols.set(val.fieldAbbreviation, val);
          });
      }

      if(call.genotypeValue) {
        const numGenos = call.genotypeValue.split("/").length;
        if(numGenos > largestPloidy) {
          largestPloidy = numGenos;
        }
      }
      this.ploidy = largestPloidy;

      variantOps.add(this.getVariant(call.variantDbId!).referenceName!);
      positionOps.add(this.getVariant(call.variantDbId!).start!);
    });

    this.currentMetadataColumns = Array.from(metadataCols.values());

    this.variantOptions = Array.from(variantOps).sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
    this.positionOptions = Array.from(positionOps).sort((a, b) => this.compareNumber(a, b));

    this.currentCallSet = callSet;

    this.pagination.totalCount = this.currentCallSet!.length;
    this.pagination.pageSize = 200;//this.currentCallSet!.length;
    this.pagination.currentPage = 1;
    this.pagination.totalPages = this.currentCallSet!.length/200;

    this.loading = false;
  }

  async fetchGenotypeData() {
    console.log("fetching geno data");
    try {
      this.loading = true;
      this.genotypeData = await GenoService.fetchGenotypeData(this.activeProgram!.id!, this.germplasmUUID);
      console.log("returned from fetch");
      console.log("callset data: " + JSON.stringify(this.genotypeData.callSets));
      if(this.genotypeData && this.genotypeData!.callSets) {
        console.log("parsing callsets")
        let latest: number = -1;
        let callsetId: string;
        let callsets: Map<string, CallSet> = new Map(Object.entries(this.genotypeData.callSets))
        callsets.forEach((value: CallSet, key: string) => {
          console.log("adding callset option: " + JSON.stringify(value));
          this.callsetOptions!.push(value);

          const callsetSeq = parseInt(value.callSetDbId!.split("§")[1]);
          if(callsetSeq > latest) {
            latest = callsetSeq;
            callsetId = value.callSetDbId!;
          }
        });

        console.log("callset options: " + JSON.stringify(this.callsetOptions));

        this.switchCallset(callsetId!, false);
      } else {
        this.loading = false;
      }
    } catch (e) {
      this.$log.error("An error occurred", e);
      this.loading = false;
    }
  }

  getVariant(variantDbId: string): Variant {
    return this.genotypeData!.variants![variantDbId] as Variant;
  }

  filterByVariant(row: TableRow<Call>, variantName: string) {
    return this.genotypeData!.variants![row.data.variantDbId!].referenceName === variantName;
  }

  filterVariantPosition(row: TableRow<Call>, position: Array<string>) {
    if(position && position.length > 0) {
      if(position.includes("Clear")) {
        position = [];
        return true;
      }

      return position.includes(this.genotypeData!.variants![row.data.variantDbId!].start);
    } else {
      return true;
    }
  }

  alleleType(genotypeStr: string, variantId: string) {
    const variant = this.genotypeData!.variants[variantId];
    if(genotypeStr === variant.referenceBases) {
      return 'is-success';
    } else {
      return 'is-warning';
    }
  }

  genotypeVal(genotypeStr: string, variantId: string) {
    return genotypeStr;
  }

  getGenotypes(call: Call) {
    if(call.genotypeValue && call.genotypeValue.trim().length > 0 && call.genotypeValue.trim() !== '.' ) {
      const vals = call.genotypeValue.split("/");

      if(vals.length == 1) {
        for(let i = 1; i < this.ploidy; i++) {
          vals[i] = vals[0];
        }
      }
      return vals;
    }

    return undefined;
  }

  sortVariantPosition(a: TableRow<Call>, b: TableRow<Call>, isAsc: Boolean) {
    const aPosition: number = this.genotypeData!.variants[a.data!.variantDbId!].start;
    const bPosition: number = this.genotypeData!.variants[b.data!.variantDbId!].start;

    if(isAsc) {
      return this.compareNumber(aPosition, bPosition);
    } else {
      return this.compareNumber(bPosition, aPosition);
    }
  }

  compareNumber(a: number, b: number) {
    if(a < b) {
      return -1;
    } else if (a == b) {
      return 0;
    } else {
      return 1;
    }
  }

  sortVariantName(a: TableRow<Call>, b: TableRow<Call>, isAsc: Boolean) {
      const aVarName: string = this.genotypeData!.variants[a.data!.variantDbId!].referenceName;
      const bVarName: string = this.genotypeData!.variants[b.data!.variantDbId!].referenceName;

      if(isAsc) {
        return aVarName.localeCompare(bVarName, undefined, {numeric: true});
      } else {
        return bVarName.localeCompare(aVarName, undefined, {numeric: true});
      }
  }
}
</script>