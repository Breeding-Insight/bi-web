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
  <div class="germplasm-lists">
    <GermplasmListsTable
        v-on:show-success-notification="$emit('show-success-notification', $event)"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
        v-bind:germplasm-list-fetch="germplasmListFetch"
    >
    </GermplasmListsTable>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import GermplasmListsTable from "@/components/germplasm/GermplasmListsTable.vue";
import {GermplasmListSort, GermplasmListSortField} from "@/breeding-insight/model/Sort";
import {BackendPaginationController} from "@/breeding-insight/model/view_models/BackendPaginationController";
import {BiResponse} from "@/breeding-insight/model/BiResponse";
import {BrAPIService, BrAPIType} from "@/breeding-insight/service/BrAPIService";
@Component({
  components: {
    GermplasmListsTable
  }
})
export default class GermplasmLists extends ProgramsBase {

  private germplasmListFetch: (programId: string, sort: GermplasmListSort, paginationController: BackendPaginationController) => ((filters: any) => Promise<BiResponse>) =
      function (programId: string, sort: GermplasmListSort, paginationController: BackendPaginationController) {
        return function (filters: any) {
          filters.type='germplasm';
          return BrAPIService.get<GermplasmListSortField>(
              BrAPIType.LIST,
              programId,
              sort,
              { pageSize: paginationController.pageSize, page: paginationController.currentPage - 1 },
              filters)
        };
      };
}

</script>