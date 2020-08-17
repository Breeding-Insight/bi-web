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
    <WarningModal
      v-bind:active.sync="deactivateActive"
      v-bind:msg-title="deactivateWarningTitle"
      v-on:deactivate="deactivateActive = false"
    >
      <section>
        <p class="has-text-dark">
          Program-related data referencing this trait will not be affected by this change.
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button v-on:click="modalDeleteHandler()" class="button is-danger"><strong>Yes, remove</strong></button>
          <button v-on:click="deactivateActive = false" class="button">Cancel</button>
        </div>
      </div>              
    </WarningModal>

    <SidePanelTable
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
        <TraitDetailPanel v-bind:data="data"/>
      </template>

      <template v-slot:emptyMessage>
        <EmptyTableMessage
        >
          <p class="has-text-weight-bold">
            No traits are currently defined for this program.
          </p>
          Create new traits by clicking "Import Traits".
        </EmptyTableMessage>
      </template>
    </SidePanelTable>
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
import {Pagination} from "@/breeding-insight/model/BiResponse";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import { StringFormatters } from '@/breeding-insight/utils/StringFormatters';
import { TraitStringFormatters } from '@/breeding-insight/utils/TraitStringFormatters';

@Component({
  mixins: [validationMixin],
  components: { NewDataForm, BasicInputField, SidePanelTable, EmptyTableMessage, TableColumn,
                WarningModal, TraitDetailPanel,
                PlusCircleIcon },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class TraitTable extends Vue {

  private activeProgram?: Program;
  private traits: Trait[] = [];
  private traitsPagination?: Pagination = new Pagination();
  private paginationController: PaginationController = new PaginationController();
  private deactivateActive: boolean = false;
  private deactivateWarningTitle: string = "Remove trait from Program name?";
  private traitName: string = "Program Trait";
  private collapseColumns = false;
  private StringFormatters = StringFormatters;
  private TraitStringFormatters = TraitStringFormatters;

  mounted() {
    this.getTraits();
  }

  @Watch('paginationController', { deep: true})
  getTraits() {
    let paginationQuery: PaginationQuery = PaginationController.getPaginationSelections(
      this.paginationController.currentPage, this.paginationController.pageSize, this.paginationController.showAll);
    this.paginationController.setCurrentCall(paginationQuery);

    TraitService.getAll(this.activeProgram!.id!, paginationQuery, true).then(([traits, metadata]) => {
      if (this.paginationController.matchesCurrentRequest(metadata.pagination)){
        this.traits = traits;
        this.traitsPagination = metadata.pagination;
      }
    }).catch((error) => {
      // Display error that traits cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load traits');
      throw error;
    });
  }

}

</script>
