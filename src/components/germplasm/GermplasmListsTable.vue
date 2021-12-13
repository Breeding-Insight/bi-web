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
  <section id="germplasmListTableLabel">
    <ExpandableTable
        v-bind:records="germplasmLists"
        v-bind:pagination="germplasmListsPagination"
        v-on:paginate="paginationController.updatePage($event)"
        v-on:paginate-toggle-all="paginationController.toggleShowAll()"
        v-on:paginate-page-size="paginationController.updatePageSize($event)"
    >
      <template v-slot:columns="data">
        <TableColumn name="name" v-bind:label="'Name'">
          {{ data.name }}
        </TableColumn>
        <TableColumn name="description" v-bind:label="'Description'">
          {{ data.traitDescription }}
        </TableColumn>
        <TableColumn name="totalEntries" v-bind:label="'Total Entries'">
          {{ data.totalEntries }}
        </TableColumn>
        <TableColumn name="dateCreated" v-bind:label="'Date Created'">
          {{ data.creationdate }}
        </TableColumn>
        <TableColumn name="user" v-bind:label="'User'">
          {{ data.user }}
        </TableColumn>
        <TableColumn name="download" v-bind:label="''">
          <a href="#">Download</a>
        </TableColumn>
      </template>

      <template v-slot:emptyMessage>
        <EmptyTableMessage>
          <p class="has-text-weight-bold">
            Germplasm lists not yet specified.
          </p>
        </EmptyTableMessage>
      </template>
    </ExpandableTable>
  </section>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import WarningModal from '@/components/modals/WarningModal.vue'
import {DownloadIcon} from 'vue-feather-icons'
import {validationMixin} from 'vuelidate';
import { mapGetters } from 'vuex'
import {Program} from "@/breeding-insight/model/Program";
import BasicInputField from "@/components/forms/BasicInputField.vue";
import EmptyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
import TableColumn from "@/components/tables/TableColumn.vue";
import {Metadata, Pagination} from "@/breeding-insight/model/BiResponse";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import BaseTraitForm from "@/components/trait/forms/BaseTraitForm.vue";
import {GermplasmList} from "@/breeding-insight/model/GermplasmList";
import {GermplasmService} from "@/breeding-insight/service/GermplasmService";
import {
  DEACTIVATE_ALL_NOTIFICATIONS,
} from "@/store/mutation-types";
import ExpandableTable from "@/components/tables/expandableTable/ExpandableTable.vue";

@Component({
  mixins: [validationMixin],
  components: {
    ExpandableTable,
    BaseTraitForm, BasicInputField, EmptyTableMessage, TableColumn,
    WarningModal, DownloadIcon },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class GermplasmListsTable extends Vue {

  private activeProgram?: Program;
  private germplasmListsPagination?: Pagination = new Pagination();
  private paginationController: PaginationController = new PaginationController();
  private germplasmLists: GermplasmList[] = ["hello"];

  mounted() {
    this.getGermplasmLists();
  }

  @Watch('paginationController', { deep: true})
  getGermplasmLists() {
    let paginationQuery: PaginationQuery = PaginationController.getPaginationSelections(
        this.paginationController.currentPage, this.paginationController.pageSize, this.paginationController.showAll);
    this.paginationController.setCurrentCall(paginationQuery);

    GermplasmService.getAll(this.activeProgram!.id!, paginationQuery).then(([germplasmLists, metadata]) => {
      this.germplasmLists = [];
      if (this.paginationController.matchesCurrentRequest(metadata.pagination)){
        this.germplasmLists = germplasmLists;
        this.germplasmListsPagination = metadata.pagination;
      }
    }).catch((error) => {
      // Display error that germplasm lists cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load germplasm lists');
      throw error;
    });
  }
}

</script>
