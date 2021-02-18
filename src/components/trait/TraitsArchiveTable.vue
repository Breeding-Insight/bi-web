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
        v-bind:data-form-state="newTraitFormState"
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

    <ArchiveSidePanelTable
      :records="paginatedArchivedTraits"
      :pagination="archivePagination"
      :namespace="namespace"
      :auto-handle-close-panel-event="false"
      :side-panel-state="traitSidePanelState"
      @:show-error-notification="$emit('show-error-notification', $event)"
    >

      <!-- 
        Table row column slot specification
        data: T
      -->
      <template #columns="data">
        <TableColumn name="name" :label="'Name'">
          <b-button
              size="is-small"
              class="archive-tag">
            Archived
          </b-button>
          {{ data.traitName }}
        </TableColumn>
        <TableColumn name="level" :label="'Level'" :visible="!traitSidePanelState.collapseColumns">
          {{ data.programObservationLevel.name }}
        </TableColumn>
        <TableColumn name="method" :label="'Method'" :visible="!traitSidePanelState.collapseColumns">
          {{ StringFormatters.toStartCase(data.method.methodClass) }}
        </TableColumn>
        <TableColumn name="scale" :label="'Scale'" :visible="!traitSidePanelState.collapseColumns">
          {{ TraitStringFormatters.getScaleTypeString(data.scale) }}
        </TableColumn>        
      </template>

      <!-- 
        Side panel data slot specification
        data: T
      -->
      <template #side-panel="{tableRow}">
        <TraitDetailPanel
          :data="traitSidePanelState.openedRow"
          :observation-level-options="observationLevelOptions"
          :edit-active="traitSidePanelState.editActive"
          :editable="true"
          :edit-form-state="traitSidePanelState.dataFormState"
          @:activate-edit="activateEdit($event)"
          @:deactivate-edit="traitSidePanelState.bus.$emit(traitSidePanelState.closePanelEvent)"
          @:trait-change="editTrait = Trait.assign({...$event})"
          @:submit="updateTrait"
        />
      </template>

      <template v-slot:emptyMessage>
        <EmptyTableMessage
            :button-view-toggle="!newTraitActive"
            :button-text="'New Trait'"
            @:newClick="activateNewTraitForm"
        >
          <p class="has-text-weight-bold">
            No traits are currently archived for this program.
          </p>
          Archive a trait by first navigating to "Trait List" then clicking "Show Details" and finally "Archive".
        </EmptyTableMessage>
      </template>
    </ArchiveSidePanelTable>
  </section>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import WarningModal from '@/components/modals/WarningModal.vue'
import {PlusCircleIcon} from 'vue-feather-icons'
import {validationMixin} from 'vuelidate';
import {Trait} from '@/breeding-insight/model/Trait'
import {mapMutations, mapGetters, mapState, mapActions} from 'vuex'
import {Program} from "@/breeding-insight/model/Program";
import NewDataForm from '@/components/forms/NewDataForm.vue'
import BasicInputField from "@/components/forms/BasicInputField.vue";
import ArchiveSidePanelTable from "@/components/tables/ArchiveSidePanelTable.vue";
import TraitDetailPanel from "@/components/trait/TraitDetailPanel.vue";
import {TraitService} from "@/breeding-insight/service/TraitService";
import EmptyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
import TableColumn from "@/components/tables/TableColumn.vue";
import {Metadata, Pagination} from "@/breeding-insight/model/BiResponse";
import { StringFormatters } from '@/breeding-insight/utils/StringFormatters';
import { TraitStringFormatters } from '@/breeding-insight/utils/TraitStringFormatters';
import BaseTraitForm from "@/components/trait/forms/BaseTraitForm.vue";
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
import {ProgramService} from "@/breeding-insight/service/ProgramService";
import {MethodClass} from "@/breeding-insight/model/Method";
import {DataType, Scale} from "@/breeding-insight/model/Scale";
import {SidePanelTableEventBusHandler} from "@/components/tables/SidePanelTableEventBus";
import { DataFormEventBusHandler } from '@/components/forms/DataFormEventBusHandler';
import {TOGGLE_SHOW_ALL, UPDATE_PAGE, UPDATE_PAGE_SIZE} from "@/store/pagination/mutation-types";

  @Component({
  mixins: [validationMixin],
  components: {
    BaseTraitForm, NewDataForm, BasicInputField, ArchiveSidePanelTable, EmptyTableMessage, TableColumn,
                WarningModal, TraitDetailPanel,
                PlusCircleIcon },
  computed: {
    ...mapGetters([
      'activeProgram'
    ]),
    ...mapGetters('traits/archive',[
        'archivePagination'
    ]),
    ...mapState('traits/archive', {
      paginatedArchivedTraits: state => state.paginatedTraits,
      paginationController: state => state.pagination
    })
  },
  methods: {
    ...mapMutations('traits/archive/pagination',[
        UPDATE_PAGE,
        UPDATE_PAGE_SIZE,
        TOGGLE_SHOW_ALL
    ]),
    ...mapActions('traits/archive', [
      'getAllArchivedTraits',
      'getArchivedTraits'
    ])
  },
  data: () => ({Trait, StringFormatters, TraitStringFormatters})
})
export default class TraitsArchiveTable extends Vue {

  private activeProgram?: Program;
  private traits: Trait[] = [];
  private methodClassOptions: string[] = Object.values(MethodClass);
  private observationLevelOptions?: string[];
  private scaleClassOptions: string[] = Object.values(DataType);
  private editTrait?: Trait;
  private originalTrait?: Trait;
  private newTrait: Trait = new Trait();
  private namespace: string = 'traits/archive/pagination/';

  // New trait form
  private newTraitActive: boolean = false;
  private validationHandler: ValidationError = new ValidationError();
  private newTraitFormState: DataFormEventBusHandler = new DataFormEventBusHandler();

  // Side panel table
  private traitSidePanelState: SidePanelTableEventBusHandler = new SidePanelTableEventBusHandler();

  // Edit form
  private editValidationHandler: ValidationError = new ValidationError();

  // Archive trait
  private deactivateActive: boolean = false;

  mounted() {
    this.getArchivedTraits();
    this.getObservationLevels();

    // Events
    this.traitSidePanelState.bus.$on(this.traitSidePanelState.requestClosePanelEvent, (showWarningEvent: Function, confirmCloseEvent: Function) => {
      if (this.editTrait && !this.editTrait.equals(this.originalTrait)) {
        showWarningEvent();
      } else {
        confirmCloseEvent();
      }
    });
    this.traitSidePanelState.bus.$on(this.traitSidePanelState.confirmCloseEditEvent, () => {
      this.clearSelectedRow();
    });
  }
  @Watch('paginationController.pageSize')
  onPageSizeChange() {
    this.getArchivedTraits();
  }
  @Watch('paginationController.currentPage')
  onPageChange() {
      this.getArchivedTraits();
  }
  @Watch('paginationController.showAll')
  onShowAllChange() {
      this.getArchivedTraits();
  }

  activateEdit(editTrait: Trait) {
    this.traitSidePanelState.bus.$emit(this.traitSidePanelState.activateEditEvent);
    this.originalTrait = Trait.assign({...editTrait} as Trait);
    this.editTrait = Trait.assign({...editTrait} as Trait);
  }

  activateNewTraitForm() {
    this.traitSidePanelState.bus.$emit(this.traitSidePanelState.closePanelEvent, () => { this.newTraitActive = true; });
  }

  clearSelectedRow() {
    this.editTrait = undefined;
    this.originalTrait = undefined;
  }

  async saveTrait() {
    try {
      this.validationHandler = new ValidationError();
      await TraitService.createTraits(this.activeProgram!.id!, [this.newTrait]);
      this.$emit('show-success-notification', 'Trait creation successful.');
      this.getTraits();
      await this.getObservationLevels();
      this.newTrait = new Trait();
      this.newTraitActive = false;
    } catch (error) {
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
    } finally {
      this.newTraitFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
    }
  }

  async updateTrait() {
    try {
      this.editValidationHandler = new ValidationError();
      const [data] = await TraitService.updateTraits(this.activeProgram!.id!, [this.editTrait!]) as [Trait[], Metadata];

      // Temporary: Only update the given trait.
      // TODO: Select all traits and find the edited trait within results to keep row open
      if (data.length > 0){
        const traitInd = this.traits.findIndex(trait => trait.id === data[0].id);
        const traitCopy = [...this.traits];
        if (traitInd >= 0) {
          traitCopy[traitInd] = {...data[0]} as Trait;
        }
        this.traits = traitCopy;
      }

      this.traitSidePanelState.bus.$emit(this.traitSidePanelState.successEditEvent, data[0]);
      this.clearSelectedRow();
      await this.getObservationLevels();
      this.$emit('show-success-notification', 'Trait edit successful.');
    } catch (error) {
      if (error instanceof ValidationError) {
        this.editValidationHandler = error;
        this.$emit('show-error-notification', `Error updating trait. ${this.editValidationHandler.condenseErrorsSingleRow()}`);
      } else {
        this.$emit('show-error-notification', 'Error updating trait.');
      }
    } finally {
      this.traitSidePanelState.dataFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
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
