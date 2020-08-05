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
  <section id="traitsImportTableLabel">
    <SidePanelTable
      v-if="loaded"
      v-bind:records.sync="traits"
      v-bind:editable="false"
      v-bind:pagination="traitsPagination"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
      v-on:paginate="paginationController.updatePage($event)"
      v-on:paginate-toggle-all="paginationController.toggleShowAll()"
      v-on:paginate-page-size="paginationController.updatePageSize($event)"
      v-on:collapse-columns="collapseColumns = true"
      v-on:uncollapse-columns="collapseColumns = false"
    >
    
      <!-- 
        Table row column slot specification
        data: T
      -->
      <template v-slot:columns="data">
        <TableColumn name="name" v-bind:label="'Name'">
          {{ data.traitName }}
        </TableColumn>
        <TableColumn name="level" v-bind:label="'Level'" v-bind:visible="!collapseColumns">
          {{ data.programObservationLevel.name }}
        </TableColumn>
        <TableColumn name="method" v-bind:label="'Method'" v-bind:visible="!collapseColumns">
          {{ StringFormatters.toStartCase(data.method.methodClass) }}
        </TableColumn>
        <TableColumn name="scale" v-bind:label="'Scale'" v-bind:visible="!collapseColumns">
          {{ TraitStringFormatters.getScaleTypeString(data.scale) }}
        </TableColumn>
      </template>

      <!-- 
        Side panel data slot specification
        data: T
      -->
      <template v-slot:side-panel="data">
        <trait-detail-panel v-bind:data="data"/>
      </template>

      <!-- 
        Table display when no data
      -->
      <template v-slot:emptyMessage>
        <EmptyTableMessage>
          <p class="has-text-weight-bold">
            No traits in file.
          </p>
          <p>
            Add traits to the file to see data here.
          </p>
        </EmptyTableMessage>
      </template>
      
    </SidePanelTable>
  </section>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {PlusCircleIcon} from 'vue-feather-icons'
  import {validationMixin} from 'vuelidate'
  import SidePanelTable from "@/components/tables/SidePanelTable.vue";
  import TraitDetailPanel from "@/components/tables/TraitDetailPanel.vue";
  import TableColumn from "@/components/tables/TableColumn.vue";
  import {Trait} from '@/breeding-insight/model/Trait'
  import { mapGetters } from 'vuex'
  import {Program} from "@/breeding-insight/model/Program";
  import EmptyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
  import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
  import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
  import {Pagination} from "@/breeding-insight/model/BiResponse";
  import { TraitUploadService } from '@/breeding-insight/service/TraitUploadService';
  import { Method } from '../../breeding-insight/model/Method';
  import { StringFormatters } from '@/breeding-insight/utils/StringFormatters';
  import { TraitStringFormatters } from '@/breeding-insight/utils/TraitStringFormatters';
  
@Component({
  mixins: [validationMixin],
  components: { TableColumn, SidePanelTable, TraitDetailPanel,
                PlusCircleIcon, EmptyTableMessage
              },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class TraitsImportTable extends Vue {

  private traitImportTableHeaders: string[] = ['Name', 'Level', 'Method', 'Scale'];
  private activeProgram?: Program;
  private traitsPagination?: Pagination = new Pagination();
  private paginationController: PaginationController = new PaginationController();
  private traits : Trait[] = [];
  private loaded = false;
  private collapseColumns = false;

  private StringFormatters = StringFormatters;
  private TraitStringFormatters = TraitStringFormatters;

  mounted() {
    this.getTraitUpload();
  }

  @Watch('paginationController', { deep: true})
  getTraitUpload() {

    let paginationQuery: PaginationQuery = PaginationController.getPaginationSelections(
      this.paginationController.currentPage, this.paginationController.pageSize, this.paginationController.showAll);
    this.paginationController.setCurrentCall(paginationQuery);

    TraitUploadService.getTraits(this.activeProgram!.id!, paginationQuery).then(([traits, metadata]) => {
      if (this.paginationController.matchesCurrentRequest(metadata.pagination)){
        this.traits = traits;
        this.traitsPagination = metadata.pagination;
      }

    }).catch((error) => {
      // Display error that users cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load program users');
      throw error;
    }).finally(() => {
      this.loadedData();
    });
  }

  loadedData() {
    this.loaded = true;
    this.$emit('loaded');
  }

}

</script>