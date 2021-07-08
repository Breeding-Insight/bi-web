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
          <button
            class="button is-danger"
            v-on:click="modalDeleteHandler"
          >
            <strong>Yes, {{ focusTrait.active ? 'archive' : 'restore' }}</strong>
          </button>
          <button
            class="button"
            v-on:click="deactivateActive = false"
          >
            Cancel
          </button>
        </div>
      </div>              
    </WarningModal>

    <div class="columns has-text-right mb-0">
      <div class="column">
        <button
            v-if="$ability.can('create', 'Trait')"
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
        v-bind:row-validations="traitValidations"
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
            v-bind:tags="tagOptions"
            v-bind:client-validations="validations"
            v-bind:validation-handler="validationHandler"
        ></BaseTraitForm>
      </template>
    </NewDataForm>

    <SidePanelTable
      ref="sidePanelTable"
      v-bind:records="traits"
      v-bind:pagination="traitsPagination"
      v-bind:auto-handle-close-panel-event="false"
      v-bind:side-panel-state="traitSidePanelState"
      v-on:paginate="paginationController.updatePage($event)"
      v-on:paginate-toggle-all="paginationController.toggleShowAll()"
      v-on:paginate-page-size="paginationController.updatePageSize($event)"
    >

      <!-- 
        Table row column slot specification
        data: T
      -->
      <template v-slot:columns="data">
        <TableColumn name="name" v-bind:label="'Name'">
          <b-button
              size="is-small"
              class="archive-tag"
              v-if="!data.active && data.active !== undefined">
            Archived
          </b-button>
          {{ data.traitName }}
        </TableColumn>
        <TableColumn name="level" v-bind:label="'Level'" v-bind:visible="!traitSidePanelState.collapseColumns">
          {{ data.programObservationLevel.name }}
        </TableColumn>
        <TableColumn name="method" v-bind:label="'Method'" v-bind:visible="!traitSidePanelState.collapseColumns">
          {{ StringFormatters.toStartCase(data.method.methodClass) }}
        </TableColumn>
        <TableColumn name="scale" v-bind:label="'Scale'" v-bind:visible="!traitSidePanelState.collapseColumns">
          {{ TraitStringFormatters.getScaleTypeString(data.scale) }}
        </TableColumn>        
      </template>

      <!-- 
        Side panel data slot specification
        data: T
      -->
      <template v-slot:side-panel="{tableRow}">
        <TraitDetailPanel
          v-bind:data="traitSidePanelState.openedRow"
          v-bind:tags="tagOptions"
          v-bind:observation-level-options="observationLevelOptions"
          v-bind:edit-active="traitSidePanelState.editActive"
          v-bind:editable="$ability.can('update', 'Trait') && currentTraitEditable"
          v-bind:loading-editable="loadingTraitEditable"
          v-bind:edit-form-state="traitSidePanelState.dataFormState"
          v-bind:client-validations="traitValidations"
          v-bind:validation-handler="editValidationHandler"
          v-bind:archivable="$ability.can('archive', 'Trait')"
          v-on:activate-edit="activateEdit($event)"
          v-on:deactivate-edit="traitSidePanelState.bus.$emit(traitSidePanelState.closePanelEvent)"
          v-on:trait-change="editTrait = Trait.assign({...$event})"
          v-on:submit="updateTrait"
          v-on:archive="activateArchive($event)"
          v-on:restore="activateArchive($event)"
          v-on:show-error-notification="$emit('show-error-notification', $event)"
        />
      </template>

      <template v-slot:emptyMessage>
        <EmptyTableMessage
            v-bind:button-view-toggle="!newTraitActive"
            v-bind:button-text="'New Trait'"
            v-on:newClick="activateNewTraitForm"
            v-bind:create-enabled="$ability.can('create', 'Trait')"
        >
          <p class="has-text-weight-bold">
            No traits are currently defined for this program.
          </p>
          <p v-if="$ability.can('create', 'Trait')">
            Create new traits by clicking "New Trait" or navigating to "Import Traits".
          </p>
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
import { DataFormEventBusHandler } from '@/components/forms/DataFormEventBusHandler';
import {email, required, integer} from "vuelidate/lib/validators";

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
  private tagOptions?: string[];
  private scaleClassOptions: string[] = Object.values(DataType);
  private editTrait?: Trait;
  private originalTrait?: Trait;
  private newTrait: Trait = new Trait();
  private currentTraitEditable = false;
  private loadingTraitEditable = true;

  // New trait form
  private newTraitActive: boolean = false;
  private validationHandler: ValidationError = new ValidationError();
  private newTraitFormState: DataFormEventBusHandler = new DataFormEventBusHandler();

  // Side panel table
  private traitSidePanelState: SidePanelTableEventBusHandler = new SidePanelTableEventBusHandler();

  // Edit form
  private editValidationHandler: ValidationError = new ValidationError();

  // Archive trait
  private focusTrait: Trait = new Trait();
  private deactivateWarningTitle = 'Archive trait in this program?';
  private deactivateActive: boolean = false;

  // TODO: Move these into an event bus in the future
  private traitsPagination?: Pagination = new Pagination();
  private paginationController: PaginationController = new PaginationController();

  traitValidations = {
    scale: {
      decimalPlaces: {integer},
      validValueMax: {integer},
      validValueMin: {integer}
    }
  }

  mounted() {
    this.getTraits();
    this.getObservationLevels();
    this.getTraitTags();

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

    this.traitSidePanelState.bus.$on(this.traitSidePanelState.selectRowEvent, (row: any) => {
      if(this.$ability.can('update', 'Trait')) {
        this.editable(row);
      }
    })
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

  async editable(trait: Trait) {
    let traitEditable = false;
    this.loadingTraitEditable = true;
    try {
      const [editable] = await TraitService.getTraitEditable(this.activeProgram!.id!, trait.id!) as [boolean, Metadata]
      traitEditable = editable;
      this.currentTraitEditable = traitEditable;
    } catch (error) {
      // Display error that traits cannot be loaded
      this.$emit('show-error-notification', 'Error getting editable status');
      throw error;
    } finally {
      this.loadingTraitEditable = false;
    }
  }

  activateArchive(focusTrait: Trait){
    if (focusTrait.active) {
      this.deactivateWarningTitle = `Archive "${focusTrait.traitName}" in ${this.activeProgram!.name!}?`;
    } else {
      this.deactivateWarningTitle = `Restore "${focusTrait.traitName}" to ${this.activeProgram!.name!}?`;
    }
    this.focusTrait = focusTrait;
    this.deactivateActive = true;
  }

  async modalDeleteHandler(){
    try {
      const traitClone = JSON.parse(JSON.stringify(this.focusTrait));
      traitClone.active = !traitClone.active;
      const updatedTrait: Trait = await TraitService.archiveTrait(this.activeProgram!.id!, traitClone);

      // Replace traits in queried traits
      const traitIndex = this.traits.findIndex(trait => trait.id === updatedTrait.id);
      if (traitIndex !== -1) { this.traits.splice(traitIndex, 1, updatedTrait); }

      this.deactivateActive = false;
      this.paginationController.updatePage(1);
      this.traitSidePanelState.bus.$emit(this.traitSidePanelState.closePanelEvent);
      this.$emit('show-success-notification', `"${traitClone.traitName}" successfully ${ traitClone.active ? 'restored' : 'archived'}`);
    } catch(err) {
      this.$log.error(err);
      this.$emit('show-error-notification', `"${this.focusTrait.traitName}" could not be ${ this.focusTrait.active ? 'archived' : 'restored'}`);
    }
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
    this.editValidationHandler = new ValidationError();
  }

  async saveTrait() {
    try {
      this.validationHandler = new ValidationError();
      await TraitService.createTraits(this.activeProgram!.id!, [this.newTrait]);
      this.$emit('show-success-notification', 'Trait creation successful.');
      this.getTraits();
      const levelPromise = this.getObservationLevels();
      const tagPromise = this.getTraitTags();
      this.newTrait = new Trait();
      this.newTraitActive = false;
    } catch (error) {
      if (error instanceof ValidationError) {
        this.validationHandler = error;
        const deletions: string[] = this.processValidationErrors(this.validationHandler, this.newTrait);
        this.$emit('show-error-notification', `Error creating trait. ${this.validationHandler.condenseErrorsSingleRow(deletions)}`);
      } else {
        this.$emit('show-error-notification', 'Error creating trait.');
      }
    } finally {
      this.newTraitFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
    }
  }

  processValidationErrors(handler: ValidationError, trait: Trait): string[] {

    // Set up overrides for error messages
    let deletions: string[] = [];
    //TODO: Move this into the class perhaps
    if (!trait.scale!.dataType) {
      // Remove scale name error
      deletions.push('scale.scaleName');
    } else if (Scale.dataTypeEquals(trait.scale!.dataType!, DataType.Numerical)) {
      // Rename scale name to unit
      handler.overrideMessage(0, 'scale.scaleName', 'Missing unit', 400);
    } else if (Scale.dataTypeEquals(trait.scale!.dataType!, DataType.Duration)) {
      // Rename scale name to unit of time
      handler.overrideMessage(0, 'scale.scaleName', 'Missing unit of time', 400);
    }
    return deletions;
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
        const deletions: string[] = this.processValidationErrors(this.editValidationHandler, this.editTrait!);
        this.$emit('show-error-notification', `Error updating trait. ${this.editValidationHandler.condenseErrorsSingleRow(deletions)}`);
      } else {
        this.$emit('show-error-notification', error);
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

  async getTraitTags() {
    try {
      const response = await TraitService.getTraitTags(this.activeProgram!.id!);
      if (response) {
        const [tags, metadata] = response;
        this.tagOptions = tags;
        return;
      }
    } catch (error) {
      this.$emit('show-error-notification', 'Unable to retrieve existing trait tags');
    }
    this.$emit('show-error-notification', 'Unable to retrieve existing trait tags');
  }

}

</script>
