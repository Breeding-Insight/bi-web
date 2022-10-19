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
    <h1 class="title">
      View Germplasm List
    </h1>
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

@Component({
  components: { AccessionTable },
})
export default class Germplasm extends GermplasmBase {

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
  }

}

</script>
