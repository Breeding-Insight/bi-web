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
<div class="columns is-multiline">
  <div class="column is-one-fifth is-flex is-justify-content-right">Description:</div>
  <div class="column is-four-fifths is-flex is-justify-content-left">{{ list.listDescription }}</div>
  <div class="column is-one-fifth is-flex is-justify-content-right">User:</div>
  <div class="column is-four-fifths is-flex is-justify-content-left">{{ list.listOwnerName }}</div>
  <div class="column is-one-fifth is-flex is-justify-content-right">Import Date:</div>
  <div class="column is-four-fifths is-flex is-justify-content-left">{{ list.dateCreated }}</div>
  <div class="column is-one-fifth is-flex is-justify-content-right">Total Entries:</div>
  <div class="column is-four-fifths is-flex is-justify-content-left">{{ list.listSize }}</div>
</div>
    <AccessionTable
        v-bind:germplasmFetch="germplasmFetch"
        v-bind:entryNumberVisible="true"
    >
    </AccessionTable>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import GermplasmBase from "@/components/germplasm/GermplasmBase.vue";
import AccessionTable from '@/components/germplasm/AccessionTable.vue';
import { GermplasmService } from '@/breeding-insight/service/GermplasmService';
import { GermplasmSort } from '@/breeding-insight/model/Sort';
import { BiResponse } from '@/breeding-insight/model/BiResponse';
import { GermplasmDAO } from '@/breeding-insight/dao/GermplasmDAO';
import { PaginationQuery } from '@/breeding-insight/model/PaginationQuery';
import { mapGetters } from 'vuex';
import { Program } from '@/breeding-insight/model/Program';
import {StringFormatters} from "@/breeding-insight/utils/StringFormatters";
import {GermplasmList} from "@/breeding-insight/model/GermplasmList";

@Component({
  components: { AccessionTable },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  },
  filters: {
    toStartCase: StringFormatters.toStartCase
  }
})
export default class Germplasm extends GermplasmBase {

  private activeProgram?: Program;
  private list?: any = null;
  private germplasmFetch: (programId: string, sort: GermplasmSort, pageSize: number, page: number) => ((filters: any) => Promise<BiResponse>) =
      () => (() => Promise.resolve(new BiResponse(null)));

  mounted() {
    this.germplasmFetch = function (programId: string, sort: GermplasmSort, pageSize: number, page: number) {
      let id = this.$route.params.listId;
      return function (filters: any) {
        return GermplasmService.getAllInList(
            programId,
            sort,
            {pageSize, page},
            {listDbId: `${id}`, ...filters})
      };
    };

    this.getListName();
  }

  async getListName() {
    const paginationQuery = new PaginationQuery(0, 20, true);
    const {result: {data: lists}} = await GermplasmDAO.getAllLists(this.activeProgram!.id!, paginationQuery);
    const matchingLists: any[] = lists.filter(list => list.listDbId === this.$route.params.listId);
    this.list = matchingLists[0];
console.log(this.list)
  }

}

</script>
