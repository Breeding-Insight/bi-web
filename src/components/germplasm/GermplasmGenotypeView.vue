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
    <div v-if="loadingCallsets">
      loading genotype data
    </div>
    <div v-if="!loadingCallsets && callsetOptions.length === 0">
      No genotype data exists for this germplasm
    </div>
    <div class="columns" v-if="!loadingCallsets && callsetOptions.length > 0">
      <div class="column">
        <label for="callsets">Callsets: </label>
        <div class="select">
          <select id="callsets" name="callsets" v-model="currentCallSetId" v-on:change="switchCallset($event.target.value)">
            <option v-for="callset in callsetOptions"
                    v-bind:key="callset.callSetDbId"
                    :value="callset.callSetDbId">
              {{callset.callSetName}}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="columns metadata" v-if="callsEnabled && currentMetadataColumns.length > 0">
      <div class="column">
        <div v-for="metadata in currentMetadataColumns" :key="metadata.fieldAbbreviation">
          <span class="abbreviation has-text-weight-bold">{{ metadata.fieldAbbreviation }}:</span><span class="name">{{ metadata.fieldName }}</span>
        </div>
      </div>
    </div>
    <!-- Calls are paged on the server; sorting and filtering would only apply to the current page, so they are not offered -->
    <ExpandableTable
        v-bind:records.sync="currentCalls"
        v-bind:loading="loadingCalls"
        v-bind:pagination="paginationController"
        v-bind:details="true"
        v-bind:is-show-all-enabled="false"
        backend-pagination
        v-if="!loadingCallsets && callsEnabled && callsetOptions.length > 0"
    >
      <b-table-column label="Chromosome" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ getVariant(props.row.data.variantDbId).referenceName }}
      </b-table-column>
      <b-table-column label="Position" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ getVariant(props.row.data.variantDbId).start }}
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
            {{ allele }}
        </span>
      </b-table-column>

      <b-table-column v-for="metadata in currentMetadataColumns" :key="metadata.fieldAbbreviation" :label="metadata.fieldAbbreviation" v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ metadataValue(props.row.data, metadata.fieldAbbreviation) }}
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
import { Component, Watch } from 'vue-property-decorator';
import GermplasmBase from '@/components/germplasm/GermplasmBase.vue';
import { Program } from '@/breeding-insight/model/Program';
import { mapGetters } from 'vuex';
import { GenoService } from '@/breeding-insight/service/GenoService';
import { PaginationController } from '@/breeding-insight/model/view_models/PaginationController';
import { PaginationQuery } from '@/breeding-insight/model/PaginationQuery';
import { Call } from '@/breeding-insight/brapi/model/geno/call';
import { CallSet } from '@/breeding-insight/brapi/model/geno/callSet';
import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
import { Variant } from '@/breeding-insight/brapi/model/geno/variant';

@Component({
  components: { ExpandableTable },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class GermplasmGenotypeView extends GermplasmBase {
  private activeProgram?: Program;
  private ploidy: number = 0;
  private loadingCallsets: boolean = true;
  private loadingCalls: boolean = false;
  private callsEnabled: boolean = false;
  private callsetOptions: Array<CallSet> = [];
  private currentCallSetId: string = "";
  private currentCalls: Array<Call> = [];
  private currentVariants: {[variantDbId: string]: Variant} = {};
  private currentMetadataColumns: Array<any> = []; //for displaying the dynamic columns
  private paginationController: PaginationController = new PaginationController();
  private callsRequestId: number = 0;

  mounted () {
    this.fetchGenotypeData();
  }

  get germplasmUUID (): string {
    return this.$route.params.germplasmId;
  }

  async fetchGenotypeData() {
    try {
      this.loadingCallsets = true;
      const genotypeData = await GenoService.fetchGenotypeData(this.activeProgram!.id!, this.germplasmUUID);
      this.callsEnabled = !!genotypeData.callsEnabled;
      this.callsetOptions = genotypeData.callSets ? Object.values(genotypeData.callSets) as Array<CallSet> : [];

      // default to the most recently imported callset
      let latest: number = -1;
      let latestCallsetId: string = "";
      this.callsetOptions.forEach((callset: CallSet) => {
        const callsetSeq = parseInt(callset.callSetDbId!.split("§")[1]);
        if(callsetSeq > latest) {
          latest = callsetSeq;
          latestCallsetId = callset.callSetDbId!;
        }
      });

      this.loadingCallsets = false;
      if(latestCallsetId) {
        this.switchCallset(latestCallsetId);
      }
    } catch (e) {
      this.$log.error("An error occurred", e);
      this.$emit('show-error-notification', 'Error while trying to load genotype data');
      this.loadingCallsets = false;
    }
  }

  switchCallset(callsetId: string) {
    this.currentCallSetId = callsetId;
    this.currentCalls = [];
    this.currentVariants = {};
    this.currentMetadataColumns = [];

    // force a fetch of the first page even if the pagination selections are unchanged
    this.paginationController.currentCall = undefined;
    this.paginationController.updatePage(1);
    this.paginationChanged();
  }

  @Watch('paginationController', {deep: true})
  paginationChanged() {
    if(!this.callsEnabled || !this.currentCallSetId) {
      return;
    }

    const currentCall = this.paginationController.currentCall;
    let paginationQuery = this.paginationController.getPaginationSelections();

    if (currentCall &&
        currentCall.pageSize !== paginationQuery.pageSize &&
        paginationQuery.page !== 1) {
      this.paginationController.updatePage(1);
      paginationQuery = this.paginationController.getPaginationSelections();
    }

    if (currentCall &&
        currentCall.page === paginationQuery.page &&
        currentCall.pageSize === paginationQuery.pageSize) {
      return;
    }

    this.paginationController.setCurrentCall(paginationQuery);
    this.fetchCallsPage();
  }

  async fetchCallsPage() {
    const requestId = ++this.callsRequestId;
    this.loadingCalls = true;

    try {
      const [callsPage, metadata] = await GenoService.fetchGenotypeCalls(
          this.activeProgram!.id!,
          this.germplasmUUID,
          this.currentCallSetId,
          this.paginationController.currentCall!
      );

      // ignore responses for a page or callset that is no longer selected
      if(requestId !== this.callsRequestId) {
        return;
      }

      const calls = callsPage.calls || [];
      this.currentVariants = callsPage.variants || {};
      this.updateCallColumns(calls);
      this.currentCalls = calls;
      // the server may cap pageSize, so record the page actually returned to keep the watcher from refetching
      this.paginationController.setPaginationInfo(metadata.pagination);
      this.paginationController.setCurrentCall(new PaginationQuery(metadata.pagination.currentPage, metadata.pagination.pageSize, false));
    } catch (e) {
      if(requestId === this.callsRequestId) {
        this.$log.error("An error occurred", e);
        this.$emit('show-error-notification', 'Error while trying to load genotype calls');
      }
    } finally {
      if(requestId === this.callsRequestId) {
        this.loadingCalls = false;
      }
    }
  }

  updateCallColumns(calls: Array<Call>) {
    const metadataCols = new Map<string, any>();
    let largestPloidy = 0;

    calls.forEach(call => {
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
    });

    this.currentMetadataColumns = Array.from(metadataCols.values());
    this.ploidy = largestPloidy;
  }

  getVariant(variantDbId: string): Variant {
    return this.currentVariants[variantDbId] || ({} as Variant);
  }

  metadataValue(call: Call, fieldAbbreviation: string) {
    const metadata = (call.genotypeMetadata || []).find((rowMetadata: any) => rowMetadata.fieldAbbreviation === fieldAbbreviation);
    return metadata ? metadata.fieldValue : '';
  }

  alleleType(genotypeStr: string, variantId: string) {
    if(genotypeStr === this.getVariant(variantId).referenceBases) {
      return 'is-success';
    } else {
      return 'is-warning';
    }
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
}
</script>
