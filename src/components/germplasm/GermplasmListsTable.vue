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
  <section id="traitTableLabel">
    <ExpandableTable
        v-bind:records="germplasmLists"
        v-bind:pagination="GermplasmListsPagination"
        v-bind:auto-handle-close-panel-event="false"
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
          <template>
            {{ "Download link here"}}
          </template>
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
import {PlusCircleIcon} from 'vue-feather-icons'
import {validationMixin} from 'vuelidate';
import {Trait} from '@/breeding-insight/model/Trait'
import { mapGetters } from 'vuex'
import {Program} from "@/breeding-insight/model/Program";
import NewDataForm from '@/components/forms/NewDataForm.vue'
import BasicInputField from "@/components/forms/BasicInputField.vue";
import SidePanelTable from "@/components/tables/SidePanelTable.vue";
import TraitDetailPanel from "@/components/trait/TraitDetailPanel.vue";
import {TraitService} from "@/breeding-insight/service/TraitService";
import EmptyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
import TableColumn from "@/components/tables/TableColumn.vue";
import {Metadata, Pagination} from "@/breeding-insight/model/BiResponse";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import { StringFormatters } from '@/breeding-insight/utils/StringFormatters';
import { TraitStringFormatters } from '@/breeding-insight/utils/TraitStringFormatters';
import BaseTraitForm from "@/components/trait/forms/BaseTraitForm.vue";
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
import {ProgramService} from "@/breeding-insight/service/ProgramService";
import {MethodClass} from "@/breeding-insight/model/Method";
import {DataType, Scale} from "@/breeding-insight/model/Scale";
import {SidePanelTableEventBusHandler} from "@/components/tables/SidePanelTableEventBus";
import { DataFormEventBusHandler } from '@/components/forms/DataFormEventBusHandler';
import {email, required, integer, maxLength} from "vuelidate/lib/validators";
import {
  DEACTIVATE_ALL_NOTIFICATIONS,
} from "@/store/mutation-types";
import ExpandableTable from "@/components/tables/expandableTable/ExpandableTable.vue";

@Component({
  mixins: [validationMixin],
  components: {
    ExpandableTable,
    BaseTraitForm, NewDataForm, BasicInputField, EmptyTableMessage, TableColumn,
    WarningModal, TraitDetailPanel,
    PlusCircleIcon },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  },
  data: () => ({GermplasmLists})
})
export default class GermplasmListsTable extends Vue {

  private activeProgram?: Program;

  mounted() {
    this.getGermplasmLists();
  }

  @Watch('paginationController', { deep: true})
  getGermplasmLists() {
    /*
    let paginationQuery: PaginationQuery = PaginationController.getPaginationSelections(
        this.paginationController.currentPage, this.paginationController.pageSize, this.paginationController.showAll);
    this.paginationController.setCurrentCall(paginationQuery);

    GermplasmListsService.getAll(this.activeProgram!.id!, paginationQuery, true).then(([germplasmLists, metadata]) => {
      if (this.paginationController.matchesCurrentRequest(metadata.pagination)){
        this.germplasmLists = germplasmLists;
        this.germplasmListsPagination = metadata.pagination;
      }
    }).catch((error) => {
      // Display error that traits cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load germplasm lists');
      throw error;
    });
     */
  }

  //TODO handle download, look at template download for example but different here

}

</script>
