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
      v-bind:msg-title="'Remove trait from Program name?'"
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

    <div class="columns has-text-right mb-0">
      <div class="column">
        <button
            data-testid="newDataForm"
            v-show="!newTraitActive & traits.length > 0"
            class="button is-primary has-text-weight-bold"
            v-on:click="activateNewTraitForm"
        >
        <span class="icon is-small">
          <PlusCircleIcon
              size="1.5x"
              aria-hidden="true"
          />
        </span>
          <span>
          New Trait
        </span>
        </button>
      </div>
    </div>

    <NewDataForm
        v-if="newTraitActive"
        v-bind:new-record.sync="newTrait"
        v-bind:save-btn-active="newFormBtnActive"
        v-on:submit="saveTrait"
        v-on:cancel="cancelNewTrait"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
      <template v-slot="validations">
        <BaseTraitForm
            v-on:trait-change="newTrait = $event"
            v-bind:trait="newTrait"
            v-bind:scale-options="scaleClassOptions"
            v-bind:method-options="methodClassOptions"
            v-bind:program-observation-levels="observationLevelOptions"
            v-bind:validation-handler="validationHandler"
        ></BaseTraitForm>
      </template>
    </NewDataForm>

    <SidePanelTable
      v-bind:records="traits"
      v-bind:pagination="traitsPagination"
      v-bind:auto-handle-close-panel-event="false"
      v-bind:side-panel-state="traitSidePanelState"
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
      <template v-slot:side-panel="{tableRow}">
        <TraitDetailPanel
          v-bind:data="tableRow"
          v-bind:observation-level-options="observationLevelOptions"
          v-bind:edit-active="traitSidePanelState.editActive"
          v-bind:edit-btn-active="editFormBtnActive"
          v-bind:editable="true"
          v-on:activate-edit="activateEdit($event)"
          v-on:deactivate-edit="deactivateEdit"
          v-on:trait-change="editTrait = Trait.assign({...$event})"
          v-on:submit="updateTrait"
        />
      </template>

      <template v-slot:emptyMessage>
        <EmptyTableMessage
            v-bind:button-view-toggle="!newTraitActive"
            v-bind:button-text="'New Trait'"
            v-on:newClick="activateNewTraitForm"
        >
          <p class="has-text-weight-bold">
            No traits are currently defined for this program.
          </p>
          Create new traits by clicking "New Trait" or navigating to "Import Traits".
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
import {EventStore} from "@/util/EventStore";

  @Component({
  mixins: [validationMixin],
  components: {
    BaseTraitForm, NewDataForm, BasicInputField, SidePanelTable, EmptyTableMessage, TableColumn,
                WarningModal, TraitDetailPanel,
                PlusCircleIcon },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  },
  data: () => ({Trait, StringFormatters, TraitStringFormatters})
})
export default class TraitTable extends Vue {

  private activeProgram?: Program;
  private traits: Trait[] = [];
  private methodClassOptions: string[] = Object.values(MethodClass);
  private observationLevelOptions?: string[];
  private scaleClassOptions: string[] = Object.values(DataType);
  private editTrait?: Trait;
  private originalTrait?: Trait;
  private newTrait: Trait = new Trait();

  // New trait form
  private newTraitActive: boolean = false;
  private newFormBtnActive: boolean = true;
  private validationHandler: ValidationError = new ValidationError();

  // Side panel table
  private traitSidePanelState: SidePanelTableEventBusHandler = new SidePanelTableEventBusHandler();
  private eventStore: EventStore = new EventStore();

  // Edit form
  private editFormBtnActive: boolean = true;
  private editValidationHandler: ValidationError = new ValidationError();

  // Archive trait
  private deactivateActive: boolean = false;

  // TODO: Remove these and put in side table event bus
  private traitsPagination?: Pagination = new Pagination();
  private paginationController: PaginationController = new PaginationController();
  private collapseColumns = false;


  created() {
    // TODO: Can we make a continue function instead of calling specific function?
    this.traitSidePanelState.bus.$on(this.traitSidePanelState.requestClosePanelEvent, () => {
      this.closePanel();
    });
    this.traitSidePanelState.bus.$on(this.traitSidePanelState.confirmCloseEditEvent, () => {
      if (this.eventStore.hasEvent()) {
        this.eventStore.pop()!.execute();
      }
    });
    this.traitSidePanelState.bus.$on(this.traitSidePanelState.cancelCloseEditEvent, () => {
      this.eventStore.clear();
    });
  }

  mounted() {
    this.getTraits();
    this.getObservationLevels();
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

  //TODO: Can we get these into a generic table state manager
  activateEdit(editTrait: Trait) {
    this.traitSidePanelState.bus.$emit(this.traitSidePanelState.activateEditEvent);
    this.originalTrait = Trait.assign({...editTrait} as Trait);
    this.editTrait = Trait.assign({...editTrait} as Trait);
  }

  deactivateEdit() {
    if (this.editTrait) {
      this.traitSidePanelState.bus.$emit(this.traitSidePanelState.deactivateEditEvent, !this.editTrait.equals(this.originalTrait));
    }
  }

  activateNewTraitForm() {
    this.eventStore.addEvent(() => { this.newTraitActive = true; });
    this.closePanel();
  }

  closePanel() {
    if (this.editTrait) {
      this.traitSidePanelState.bus.$emit(this.traitSidePanelState.deactivateEditEvent, !this.editTrait.equals(this.originalTrait));
    } else {
      this.traitSidePanelState.bus.$emit(this.traitSidePanelState.deactivateEditEvent,false);
    }
  }

  async saveTrait() {
    try {
      this.newFormBtnActive = false;
      this.validationHandler = new ValidationError();
      await TraitService.createTraits(this.activeProgram!.id!, [this.newTrait]);
      this.$emit('show-success-notification', 'Trait creation successful.');
      this.getTraits();
      await this.getObservationLevels();
      this.newTrait = new Trait();
      this.newTraitActive = false;
    } catch (error) {
      this.newFormBtnActive = true;
      if (error instanceof ValidationError) {
        this.validationHandler = error;

        // Set up overrides for error messages
        let deletions: string[] = [];
        //TODO: Move this into the class perhaps
        if (!this.newTrait.scale!.dataType) {
          // Remove scale name error
          deletions.push('scale.scaleName');
        } else if (Scale.dataTypeEquals(this.newTrait.scale!.dataType!, DataType.Numerical)) {
          // Rename scale name to unit
          this.validationHandler.overrideMessage(0, 'scale.scaleName', 'Missing unit', 400);
        } else if (Scale.dataTypeEquals(this.newTrait.scale!.dataType!, DataType.Duration)) {
          // Rename scale name to unit of time
          this.validationHandler.overrideMessage(0, 'scale.scaleName', 'Missing unit of time', 400);
        }

        this.$emit('show-error-notification', `Error creating trait. ${this.validationHandler.condenseErrorsSingleRow(deletions)}`);
      } else {
        this.$emit('show-error-notification', 'Error creating trait.');
      }
    }
  }

  //TODO: Mock the trait dao to return the updated trait
  async updateTrait() {
    try {
      this.editFormBtnActive = false;
      this.editValidationHandler = new ValidationError();
      const [data] = await TraitService.updateTraits(this.activeProgram!.id!, [this.editTrait!]) as [Trait[], Metadata];
      console.log(data);
      this.$emit('show-success-notification', 'Trait edit successful.');

      // Only update the given trait.
      if (data.length > 0){
        const traitInd = this.traits.findIndex(trait => trait.id === data[0].id);
        const traitCopy = [...this.traits];
        if (traitInd) {
          traitCopy[traitInd] = {...data[0]} as Trait;
        }
        this.traits = traitCopy;
      }

      await this.getObservationLevels();
      //TODO: Detail panel should stay open
      this.traitSidePanelState.bus.$emit(this.traitSidePanelState.deactivateEditEvent, false);
    } catch (error) {
      console.log(error);
      if (error instanceof ValidationError) {
        this.editValidationHandler = error;
        this.$emit('show-error-notification', `Error updating trait. ${this.editValidationHandler.condenseErrorsSingleRow()}`);
      } else {
        this.$emit('show-error-notification', 'Error updating trait.');
      }
    }
  }

  cancelNewTrait() {
    this.newTrait = new Trait();
    this.validationHandler = new ValidationError();
    this.newTraitActive = false;
  }

  async getObservationLevels() {
    try {
      const response = await ProgramService.getObservationLevels(this.activeProgram!.id!);
      if (response) {
        const [observationLevels, metadata] = response;
        this.observationLevelOptions = observationLevels.map(value => value.name!);
        return;
      }
    } catch (error) {
      this.$emit('show-error-notification', 'Unable to retrieve observation levels');
    }
    this.$emit('show-error-notification', 'Unable to retrieve observation levels');
  }

}

</script>
