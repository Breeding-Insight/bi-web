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
  <section id="ontologyTableLabel">
    <WarningModal
      v-bind:active.sync="deactivateActive"
      v-bind:msg-title="deactivateWarningTitle"
      v-on:deactivate="deactivateActive = false"
    >
      <section>
        <p class="has-text-dark" :class="this.$modalTextClass">
          Program-related data referencing this trait will not be affected by this change.
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button
            class="button is-danger"
            v-on:click="modalDeleteHandler"
          >
            <strong>Yes, {{ archiveWarning() }}</strong>
          </button>
          <button
            class="button"
            v-on:click="cancelTermUpdate"
          >
            Cancel
          </button>
        </div>
      </div>              
    </WarningModal>

    <div v-if="active" class="columns has-text-right mb-0 buttons">
      <div class="column">
        <button
            v-if="$ability.can('create', 'Trait') && !isSubscribed"
            data-testid="newDataForm"
            v-show="!newTraitActive && traits.length > 0"
            class="button mx-2 is-primary is-pulled-right is-light has-text-weight-bold"
            v-on:click="activateNewTraitForm"
        >
        <span class="icon is-small">
          <PlusCircleIcon
              size="1.5x"
              aria-hidden="true"
          />
        </span>
          <span>
          New Term
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
            v-bind:descriptions="descriptionOptions"
            v-bind:program-observation-levels="observationLevelOptions"
            v-bind:entities="entityOptions"
            v-bind:attributes="attributeOptions"
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
      v-bind:loading="traitsLoading"
      v-on:paginate="paginationController.updatePage($event)"
      v-on:paginate-toggle-all="paginationController.toggleShowAll(traitsPagination.totalCount.valueOf())"
      v-on:paginate-page-size="paginationController.updatePageSize(parseInt($event,10))"
    >

      <!-- 
        Table row column slot specification
        data: T
      -->
      <template v-slot:columns="data">
        <TableColumn
            name="name"
            v-bind:label="'Name'"
            v-bind:sortField="ontologySort.field"
            v-bind:sortFieldLabel="nameSortLabel"
            v-bind:sortable="true"
            v-bind:sortOrder="ontologySort.order"
            v-on:newSortColumn="$emit('newSortColumn', $event)"
            v-on:toggleSortOrder="$emit('toggleSortOrder')"
        >
          {{ data.observationVariableName }}
        </TableColumn>
        <TableColumn
            name="termType"
            v-bind:label="'Term Type'"
            v-bind:sortField="ontologySort.field"
            v-bind:sortFieldLabel="termTypeSortLabel"
            v-bind:sortable="true"
            v-bind:sortOrder="ontologySort.order"
            v-on:newSortColumn="$emit('newSortColumn', $event)"
            v-on:toggleSortOrder="$emit('toggleSortOrder')"
        >
          {{ TraitStringFormatters.getTermTypeString(data.termType) }}
        </TableColumn>
        <TableColumn
          name="trait"
          v-bind:label="'Trait'"
          v-bind:visible="!traitSidePanelState.collapseColumns"
          v-bind:sortField="ontologySort.field"
          v-bind:sortFieldLabel="entityAttributeSortLabel"
          v-bind:sortable="true"
          v-bind:sortOrder="ontologySort.order"
          v-on:newSortColumn="$emit('newSortColumn', $event)"
          v-on:toggleSortOrder="$emit('toggleSortOrder')"
          class="display-case"
        >
          {{ data.entity }} {{data.attribute }}
        </TableColumn>
        <TableColumn
            name="method"
            v-bind:label="'Method'"
            v-bind:visible="!traitSidePanelState.collapseColumns"
            v-bind:sortField="ontologySort.field"
            v-bind:sortFieldLabel="methodSortLabel"
            v-bind:sortable="true"
            v-bind:sortOrder="ontologySort.order"
            v-on:newSortColumn="$emit('newSortColumn', $event)"
            v-on:toggleSortOrder="$emit('toggleSortOrder')"
            class="display-case"
        >
          {{ (data.method.description ? data.method.description + " ": "") + data.method.methodClass }}
        </TableColumn>
        <TableColumn
            name="scaleClass"
            v-bind:label="'Scale Class'"
            v-bind:visible="!traitSidePanelState.collapseColumns"
            v-bind:sortField="ontologySort.field"
            v-bind:sortFieldLabel="scaleClassSortLabel"
            v-bind:sortable="true"
            v-bind:sortOrder="ontologySort.order"
            v-on:newSortColumn="$emit('newSortColumn', $event)"
            v-on:toggleSortOrder="$emit('toggleSortOrder')"
        >
          {{ TraitStringFormatters.getScaleTypeString(data.scale) }}
        </TableColumn>
        <TableColumn
            name="unit"
            v-bind:label="'Unit'"
            v-bind:visible="!traitSidePanelState.collapseColumns"
            v-bind:sortField="ontologySort.field"
            v-bind:sortFieldLabel="unitSortLabel"
            v-bind:sortable="true"
            v-bind:sortOrder="ontologySort.order"
            v-on:newSortColumn="$emit('newSortColumn', $event)"
            v-on:toggleSortOrder="$emit('toggleSortOrder')"
        >
          <template v-if="data.scale.dataType==='NUMERICAL'">
            {{ data.scale.scaleName }}
          </template>
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
          v-bind:description-options="descriptionOptions"
          v-bind:entity-options="entityOptions"
          v-bind:attribute-options="attributeOptions"
          v-bind:edit-active="traitSidePanelState.editActive"
          v-bind:editable="$ability.can('update', 'Trait') && currentTraitEditable"
          v-bind:loading-editable="loadingTraitEditable"
          v-bind:edit-form-state="traitSidePanelState.dataFormState"
          v-bind:client-validations="traitValidations"
          v-bind:validation-handler="editValidationHandler"
          v-bind:archivable="$ability.can('archive', 'Trait')"
          v-on:activate-edit="activateEdit($event)"
          v-on:deactivate-edit="traitSidePanelState.bus.$emit(traitSidePanelState.closePanelEvent)"
          v-on:trait-change="changeTerm($event)"
          v-on:submit="updateTerm"
          v-on:archive="activateArchive($event)"
          v-on:restore="activateArchive($event)"
          v-on:show-error-notification="$emit('show-error-notification', $event)"
        />
      </template>

      <template v-slot:emptyMessage>
        <EmptyTableMessage
            v-bind:button-view-toggle="!newTraitActive && active && !isSubscribed"
            v-bind:button-text="'New Term'"
            v-on:newClick="activateNewTraitForm"
            v-bind:create-enabled="$ability.can('create', 'Trait')"
        >
          <p class="has-text-weight-bold">
            No ontology terms are currently {{ active ? 'defined' : 'archived' }} for this program.
          </p>
          <p v-if="active && $ability.can('create', 'Trait')">
            Create new ontology terms by clicking "New Term" or by navigating to "Import Ontology".
          </p>
          <p v-if="!active && !isSubscribed && $ability.can('archive', 'Trait') && $ability.can('update', 'Trait')">
            Archive an existing ontology term by clicking "Show details" > "Edit" > "Archive". <br>
            Create new archived ontology terms by clicking "New Term" or by navigating to "Import Ontology".
          </p>
        </EmptyTableMessage>
      </template>
    </SidePanelTable>
  </section>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import WarningModal from '@/components/modals/WarningModal.vue'
import {PlusCircleIcon} from 'vue-feather-icons'
import {validationMixin} from 'vuelidate';
import {Trait} from '@/breeding-insight/model/Trait'
import {mapActions, mapGetters} from 'vuex'
import {Program} from "@/breeding-insight/model/Program";
import NewDataForm from '@/components/forms/NewDataForm.vue'
import BasicInputField from "@/components/forms/BasicInputField.vue";
import SidePanelTable from "@/components/tables/SidePanelTable.vue";
import TraitDetailPanel from "@/components/trait/TraitDetailPanel.vue";
import {TraitService} from "@/breeding-insight/service/TraitService";
import EmptyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
import TableColumn from "@/components/tables/TableColumn.vue";
import {Metadata, Pagination} from "@/breeding-insight/model/BiResponse";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {StringFormatters} from '@/breeding-insight/utils/StringFormatters';
import {TraitStringFormatters} from '@/breeding-insight/utils/TraitStringFormatters';
import BaseTraitForm from "@/components/trait/forms/BaseTraitForm.vue";
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
import {ProgramService} from "@/breeding-insight/service/ProgramService";
import {MethodClass} from "@/breeding-insight/model/Method";
import {DataType, Scale} from "@/breeding-insight/model/Scale";
import {SidePanelTableEventBusHandler} from "@/components/tables/SidePanelTableEventBus";
import {DataFormEventBusHandler} from '@/components/forms/DataFormEventBusHandler';
import {integer, maxLength} from "vuelidate/lib/validators";
import {TermType, TraitField, TraitFilter} from "@/breeding-insight/model/TraitSelector";
import {OntologySort, OntologySortField} from "@/breeding-insight/model/Sort";
import {BackendPaginationController} from "@/breeding-insight/model/view_models/BackendPaginationController";
import {Category} from "@/breeding-insight/model/Category";
import {EnumUtils} from "@/breeding-insight/utils/EnumUtils";

@Component({
  mixins: [validationMixin],
  components: {
    BaseTraitForm, NewDataForm, BasicInputField, SidePanelTable, EmptyTableMessage, TableColumn,
                WarningModal, TraitDetailPanel,
                PlusCircleIcon },
  computed: {
    ...mapGetters([
      'activeProgram'
    ]),
    ...mapGetters('programManagement',[
      'isSubscribed'
    ])
  },
  methods: {
    ...mapActions('programManagement', {
        getSubscribedOntology: 'getSubscribedOntology'
    })
  },
  data: () => ({Trait, StringFormatters, TraitStringFormatters})
})
export default class OntologyTable extends Vue {
  @Prop({default: () => true})
  active?: boolean;

  @Prop()
  ontologySort!: OntologySort;

  private activeProgram?: Program;
  private traits: Trait[] = [];
  private methodClassOptions: string[] = Object.values(MethodClass);
  private observationLevelOptions?: string[];
  private attributeOptions?: string[];
  private entityOptions?: string[];
  private descriptionOptions?: string[];
  private tagOptions?: string[];
  private scaleClassOptions: string[] = Object.values(DataType);
  private editTrait?: Trait;
  private originalTrait?: Trait;
  private newTrait: Trait = new Trait();
  private currentTraitEditable = false;
  private loadingTraitEditable = true;
  private traitsLoading = true;

  // table column sorting
  private nameSortLabel: string = OntologySortField.Name;
  private methodSortLabel: string = OntologySortField.MethodDescription;
  private scaleClassSortLabel: string = OntologySortField.ScaleClass;
  private unitSortLabel: string = OntologySortField.ScaleName;
  private entityAttributeSortLabel: string = OntologySortField.entityAttributeSortLabel;
  private termTypeSortLabel: string = OntologySortField.TermType;

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

  // Shared Ontology
  private isSubscribed?: boolean;
  private getSubscribedOntology!: () => any;

  // TODO: Move these into an event bus in the future
  private traitsPagination?: Pagination = new Pagination();
  private paginationController: BackendPaginationController = new BackendPaginationController();

  shortCharLimit = 12;
  longCharLimit = 30;

  traitValidations = {
    observationVariableName: {
      maxLength: maxLength(this.shortCharLimit)
    },
    entity: {
      maxLength: maxLength(this.longCharLimit)
    },
    attribute: {
      maxLength: maxLength(this.longCharLimit)
    },
    method: {
      description: {
        maxLength: maxLength(this.longCharLimit)
      }
    },
    scale: {
      decimalPlaces: {integer},
      validValueMax: {integer},
      validValueMin: {integer}
    }
  }

  mounted() {
    this.getSubscribedOntology();
    this.updatePagination();
    this.getTraits();
    this.getObservationLevels();
    this.getAttributesEntitiesDescriptions();
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

  archiveWarning() {
    return this.editTrait && this.editTrait.active ? 'restore' : 'archive';
  }

  @Watch('ontologySort', {deep: true})
  @Watch('paginationController', { deep: true})
  paginationChanges() {
    this.updatePagination();
    this.getTraits();
  }

  updatePagination() {
    let paginationQuery: PaginationQuery = BackendPaginationController.getPaginationSelections(
        this.paginationController.currentPage, this.paginationController.pageSize, this.paginationController.showAll);
    this.paginationController.setCurrentCall(paginationQuery);
  }

  getTraits() {
    // filter the terms pulled from the back-end
    let filters: TraitFilter[] = [{ field: TraitField.STATUS, value: this.active}];
    this.traitsLoading = true;

    TraitService.getFilteredTraits(this.activeProgram!.id!, this.paginationController.currentCall, true, filters, this.ontologySort).then(([traits, metadata]) => {
      if (this.paginationController.matchesCurrentRequest(metadata.pagination)){
        this.traits = traits;
        this.traitsPagination = metadata.pagination;
      }
    }).catch((error) => {
      // Display error that traits cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load traits');
      throw error;
    }).finally( () => this.traitsLoading =  false );
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

  changeTerm(editedTerm: Trait) {
    this.editTrait = Trait.assign(editedTerm);
  }

  activateArchive(focusTrait: Trait){
    if (this.editTrait && !this.editTrait.active) {
      this.deactivateWarningTitle = `Archive "${focusTrait.observationVariableName}" in program ${this.activeProgram!.name!}?`;
    } else {
      this.deactivateWarningTitle = `Restore "${focusTrait.observationVariableName}" to program ${this.activeProgram!.name!}?`;
    }
    this.deactivateActive = true;
  }

  async updateTerm() {
    if (this.originalTrait && this.editTrait) {
      try {
        if (this.originalTrait.active === !this.editTrait.active) this.activateArchive(this.editTrait);
        else await this.updateTrait();
      } catch (error) {
        this.$log.error(error);
        this.$emit('show-error-notification', `"${this.editTrait.observationVariableName}" could not be updated`);
      }
    }
  }

  async modalDeleteHandler(){
    try {
      const traitClone = JSON.parse(JSON.stringify(this.editTrait));
      const updatedTrait: Trait = await TraitService.archiveTrait(this.activeProgram!.id!, traitClone);

      // Replace traits in queried traits
      const traitIndex = this.traits.findIndex(trait => trait.id === updatedTrait.id);
      if (traitIndex !== -1) { this.traits.splice(traitIndex, 1, updatedTrait); }

      this.deactivateActive = false;
      this.paginationController.updatePage(1);
      await this.updateTrait(true);
    } catch(err) {
      this.$log.error(err);
      if (this.editTrait)
        this.$emit('show-error-notification', `"${this.editTrait.observationVariableName}" could not be ${ this.editTrait.active ? 'restored' : 'archived'}.`);
    } finally {
      this.deactivateActive = false;
      this.traitSidePanelState.dataFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
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
      //For nominal traits switch back label value
      let traitToSave = this.prepareScaleCategoriesForSave(this.newTrait);

      this.validationHandler = new ValidationError();
      const [ [savedTrait], metadata ] = await TraitService.createTraits(this.activeProgram!.id!, [traitToSave]);
      if (traitToSave.active === false) {
        savedTrait.active = false;
        await TraitService.archiveTrait(this.activeProgram!.id!, savedTrait);
      }
      this.$emit('show-success-notification', 'Trait creation successful.');
      this.paginationController.updateOnAdd();
      this.getTraits();
      const levelPromise = this.getObservationLevels();
      const tagPromise = this.getTraitTags();
      await this.getAttributesEntitiesDescriptions();
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
    }
    return deletions;
  }

  cancelTermUpdate() {
    this.deactivateActive = false;
    this.traitSidePanelState.dataFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
    this.$emit('show-info-notification', 'Ontology term update aborted.');
  }

  async updateTrait(archiveStateChanged?: boolean) {
    try {
      //For nominal traits switch back label value
      let traitToSave = this.prepareScaleCategoriesForSave(this.editTrait!);

      this.editValidationHandler = new ValidationError();
      const [data] = await TraitService.updateTraits(this.activeProgram!.id!, [traitToSave!]) as [Trait[], Metadata];

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
      const tagPromise = this.getTraitTags();
      this.traitSidePanelState.bus.$emit(this.traitSidePanelState.successEditEvent, data[0]);
      let editNote;
      if (this.editTrait) {
        if (archiveStateChanged) {
          editNote = `"${this.editTrait.observationVariableName}" successfully edited and ${ this.editTrait.active ? 'restored' : 'archived'}.`;
        } else {
          editNote = `"${this.editTrait.observationVariableName}" successfully edited.`;
        }
      }
      this.getTraits();
      this.clearSelectedRow();
      await this.getObservationLevels();
      this.traitSidePanelState.bus.$emit(this.traitSidePanelState.closePanelEvent);
      this.$emit('show-success-notification', editNote);
    } catch (error) {
      if (error instanceof ValidationError) {
        this.editValidationHandler = error;
        const deletions: string[] = this.processValidationErrors(this.editValidationHandler, this.editTrait!);
        this.$emit('show-error-notification', `Error updating ontology term. ${this.editValidationHandler.condenseErrorsSingleRow(deletions)}`);
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

  prepareScaleCategoriesForSave(inputTrait: Trait){
    let traitToSave = JSON.parse(JSON.stringify(inputTrait));
    if ((traitToSave) && (traitToSave.scale) && (traitToSave.scale.dataType) && (Scale.dataTypeEquals(traitToSave.scale.dataType, DataType.Nominal)) && (traitToSave.scale.categories)) {
      traitToSave.scale.categories.forEach((category: Category) => {
        category.value = category.label;
        category.label = undefined;
      });
    }
    //Translate TermType from user readable to backend storage format
    traitToSave.termType = EnumUtils.enumValueToKey(inputTrait.termType, TermType);
    return traitToSave;
  }

  async getAttributesEntitiesDescriptions() {
    try {
      //Want to retrieve all entries for autocomplete not just those on current page
      //TODO: right now this.traitsPagination.totalCount is 0 when it hits this method, so relying on large number to retrieve all values
      let totalCount = 5000;
      const response = await TraitService.getAttributesEntitiesDescriptions(this.activeProgram!.id!, totalCount);
      if (response) {
        const attributesEntitiesDescriptions: [string[], string[], string[]] = response;
        [this.attributeOptions, this.entityOptions, this.descriptionOptions] = attributesEntitiesDescriptions;
        return;
      }
    } catch (error) {
      this.$emit('show-error-notification', 'Unable to retrieve ontology term entities, attributes, and descriptions');
    }
    this.$emit('show-error-notification', 'Unable to retrieve ontology term entities, attributes, and descriptions');
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
