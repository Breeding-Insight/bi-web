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
        <p
          class="has-text-dark"
          :class="this.$modalTextClass"
        >
          Program-related data referencing this ontology term will not be affected by this change.
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

    <button
        v-if="$ability.can('create', 'Trait')"
        v-show="!newTraitActive & traits.length > 0"
        class="button is-primary is-pulled-right has-text-weight-bold"
        v-on:click="$router.push({name: 'traits-import', params: {programId: activeProgram.id}})"
    >
        <span class="icon is-small">
          <PlusCircleIcon
              size="1.5x"
              aria-hidden="true"
          />
        </span>
      <span>
          Import Batch File
        </span>
    </button>
    <button
        v-if="$ability.can('create', 'Trait')"
        v-show="!newTraitActive & traits.length > 0"
        data-testid="newDataForm"
        class="button is-primary is-light mx-2 has-text-weight-bold is-pulled-right"
        v-on:click="activateNewTraitForm"
    >
      <span class="icon is-small">
        <PlusCircleIcon
            size="1.5x"
            aria-hidden="true"
        />
      </span>
      <span>
        New Ontology Term
      </span>
    </button>

    <div class="is-clearfix" />

    <NewDataForm
      v-if="newTraitActive"
      v-bind:row-validations="traitValidations"
      v-bind:new-record.sync="newTrait"
      v-bind:data-form-state="newTraitFormState"
      v-on:submit="saveTrait"
      v-on:cancel="cancelNewTrait"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
      <template v-slot="validations">
        <BaseTraitForm
          v-bind:trait="newTrait"
          v-bind:scale-options="scaleClassOptions"
          v-bind:method-options="methodClassOptions"
          v-bind:program-observation-levels="observationLevelOptions"
          v-bind:descriptions="descriptionOptions"
          v-bind:entities="entityOptions"
          v-bind:attributes="attributeOptions"
          v-bind:tags="tagOptions"
          v-bind:client-validations="validations"
          v-bind:validation-handler="validationHandler"
          v-on:trait-change="newTrait = $event"
        />
      </template>
    </NewDataForm>

    <ExpandableTable
      v-bind:records.sync="traits"
      v-bind:editable="$ability.can('update', 'Trait')"
      v-bind:archivable="$ability.can('archive', 'Trait')"
      v-bind:pagination="traitsPagination"
      v-bind:data-form-state="editTermFormState"
      v-bind:row-validations="traitValidations"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
      v-on:paginate="paginationController.updatePage($event)"
      v-on:paginate-toggle-all="paginationController.toggleShowAll()"
      v-on:paginate-page-size="paginationController.updatePageSize($event)"
    >
      <b-table-column
          v-slot="{ row: { data: term } }"
          :custom-sort="sortTermName"
          label="Name"
          sortable
          :th-attrs="(column) => ({scope:'col'})"
      >
        {{ term.observationVariableName }}
      </b-table-column>
      <b-table-column
          v-slot="{ row: { data: term } }"
          label="Trait"
          sortable
          :th-attrs="(column) => ({scope:'col'})"
      >
        {{ term.entity }} {{ term.attribute }}
      </b-table-column>
      <b-table-column
          v-slot="{ row: { data: term } }"
          label="Method"
          sortable
          :th-attrs="(column) => ({scope:'col'})"
      >
        {{ term.method.description }} {{ term.method.methodClass }}
      </b-table-column>
      <b-table-column
          v-slot="{ row: { data: term } }"
          label="Scale Class"
          sortable
          :th-attrs="(column) => ({scope:'col'})"
      >
        {{ term.scale.dataType }}
      </b-table-column>
      <b-table-column
          v-slot="{ row: { data: term } }"
          label="Unit"
          sortable
          :th-attrs="(column) => ({scope:'col'})"
      >
        {{ term.scale.scaleName }}
      </b-table-column>
      <template v-slot:edit="{editData, validations}">
        <div class="columns">
          <div class="column is-two-fifths">
            <BasicInputField
              v-model="editData.name"
              v-bind:validations="validations.name"
              v-bind:field-name="'Name'"
              v-bind:field-help="'Ontology term name as preferred. All Unicode special characters accepted.'"
            />
          </div>
        </div>
      </template>
      <template v-slot:emptyMessage>
        <p class="has-text-weight-bold">
          No ontology is currently defined for this program.
        </p>
        Ontology terms are used to create an ontology.<br>
        You can add, edit, and archive ontology terms from this panel.
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
import ExpandableTable from "@/components/tables/expandableTable/ExpandableTable.vue";

@Component({
  mixins: [validationMixin],
  components: { BaseTraitForm, SidePanelTable, TraitDetailPanel, ExpandableTable, NewDataForm, BasicInputField,
    EmptyTableMessage, TableColumn, WarningModal, PlusCircleIcon },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  },
  data: () => ({Trait, StringFormatters, TraitStringFormatters})
})
export default class OntologyActiveTable extends Vue {

  // copied from TrialsTable
  private editTermFormState: DataFormEventBusHandler = new DataFormEventBusHandler();


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

  sortTermName(a: any, b: any, isAsc: boolean) {
    if(isAsc) {
      return a.data.observationVariableName!.localeCompare(b.data.observationVariableName!);
    } else {
      return b.data.observationVariableName!.localeCompare(a.data.observationVariableName!);
    }
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
      const tagPromise = this.getTraitTags();
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

  async getAttributesEntitiesDescriptions() {
    try {
      const response = await TraitService.getAttributesEntitiesDescriptions(this.activeProgram!.id!);
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
