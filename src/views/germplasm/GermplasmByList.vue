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
  <div class="germplasm">
    <router-link
        v-bind:to="{name: 'germplasm-lists', params: {programId: activeProgram.id}}"
    >
      <a>&lt; Germplasm Lists</a>
    </router-link>
    <h1 class="title">
      {{ list.listName | toStartCase }}
    </h1>
<div class="columns">
  <div class="column is-10">
    <div class="columns is-multiline">
      <div class="column germplasm-list-meta-field"><b>Description:</b></div>
      <div class="column germplasm-list-meta-data">{{ list.listDescription }}</div>
      <div class="column germplasm-list-meta-field"><b>User:</b></div>
      <div class="column germplasm-list-meta-data">{{ list.listOwnerName }}</div>
      <div class="column germplasm-list-meta-field"><b>Import Date:</b></div>
      <div class="column germplasm-list-meta-data">{{ list.dateCreated | toYMD }}</div>
      <div class="column germplasm-list-meta-field"><b>Total Entries:</b></div>
      <div class="column germplasm-list-meta-data">{{ list.listSize }}</div>
    </div>
  </div>
  <div class="column is-2">
    <div class="columns is-multiline">
      <div class="column is-full"></div>
      <div class="column is-full"></div>
      <div class="column is-full"></div>
      <div class="column is-full has-text-centered buttons">
        <GermplasmDownloadButton
            v-bind:modal-title="`Download ${list.listName}`"
            modal-subtitle="File Format"
            v-bind:listDbId="list.listDbId"
        >
          <button class="button is-primary has-text-weight-bold">
            <strong>Download</strong>
          </button>
        </GermplasmDownloadButton>
      </div>
    </div>
  </div>
</div>
    <GermplasmTable
        v-bind:germplasmFetch="germplasmFetch"
        entryNumberVisible="true"
    >
    </GermplasmTable>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import GermplasmBase from "@/components/germplasm/GermplasmBase.vue";
import GermplasmTable from '@/components/germplasm/GermplasmTable.vue';
import { GermplasmService } from '@/breeding-insight/service/GermplasmService';
import { GermplasmSort } from '@/breeding-insight/model/Sort';
import { BiResponse } from '@/breeding-insight/model/BiResponse';
import { GermplasmDAO } from '@/breeding-insight/dao/GermplasmDAO';
import { PaginationQuery } from '@/breeding-insight/model/PaginationQuery';
import { mapGetters } from 'vuex';
import { Program } from '@/breeding-insight/model/Program';
import {StringFormatters} from "@/breeding-insight/utils/StringFormatters";
import GermplasmDownloadButton from '@/components/germplasm/GermplasmDownloadButton';

@Component({
  components: { GermplasmTable, GermplasmDownloadButton },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  },
  filters: {
    toStartCase: StringFormatters.toStartCase,
    toYMD: (date) => date.split('T')[0]
  }
})
export default class GermplasmByList extends GermplasmBase {

  private activeProgram?: Program;
  private list: any = null;

  // Set the method used to populate the germplasm table
  private germplasmFetch: (programId: string, sort: GermplasmSort, pageSize: number, page: number) => ((filters: any) => Promise<BiResponse>) =
      function (programId: string, sort: GermplasmSort, pageSize: number, page: number) {
        let id = this.$route.params.listId;
        return function (filters: any) {
          return GermplasmService.getAllInList(
              programId,
              sort,
              {pageSize, page},
              {listDbId: `${id}`, ...filters})
        };
      };

  mounted() {
    this.getList();
  }

  async getList() {
    const paginationQuery = new PaginationQuery(0, 200, true);
    const {result: {data: lists}} = await GermplasmDAO.getAllLists(this.activeProgram!.id!, paginationQuery);
    const matchingLists: any[] = lists.filter(list => list.listDbId === this.$route.params.listId);
    this.list = matchingLists[0];
  }
}
</script>
