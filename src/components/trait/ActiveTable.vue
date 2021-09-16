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
      data-testid="newDataForm"
      class="button is-primary has-text-weight-bold is-pulled-right"
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
          v-bind:tags="tagOptions"
          v-bind:client-validations="validations"
          v-bind:validation-handler="validationHandler"
          v-on:trait-change="newTrait = $event"
        />
      </template>
    </NewDataForm>

    <ExpandableTable
      v-bind:records.sync="trials"
      v-bind:loading="this.trialsLoading"
      v-bind:row-validations="trialValidations"
      v-bind:editable="$ability.can('update', 'Trial')"
      v-bind:archivable="$ability.can('archive', 'Trial')"
      v-bind:pagination="trialsPagination"
      v-bind:data-form-state="editTrialFormState"
      v-on:submit="updateTrial($event)"
      v-on:remove="displayWarning($event)"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
      v-on:paginate="paginationController.updatePage($event)"
      v-on:paginate-toggle-all="paginationController.toggleShowAll()"
      v-on:paginate-page-size="paginationController.updatePageSize($event)"
    >
      <b-table-column
        v-slot="props"
        :custom-sort="sortTrialName"
        label="Name"
        sortable
        :th-attrs="(column) => ({scope:'col'})"
      >
        <router-link
          :to="{name: 'studies', params: { trialId: props.row.data.id, programId: activeProgram.id }}"
        >
          {{ props.row.data.trialName }}
        </router-link>
      </b-table-column>
      <template v-slot:edit="{editData, validations}">
        <div class="columns">
          <div class="column is-two-fifths">
            <BasicInputField
              v-model="editData.name"
              v-bind:validations="validations.name"
              v-bind:field-name="'Name'"
              v-bind:field-help="'Trial name as preferred. All Unicode special characters accepted.'"
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
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import WarningModal from '@/components/modals/WarningModal.vue'
  import {PlusCircleIcon} from 'vue-feather-icons'
  import {validationMixin} from 'vuelidate';
  import {Validations} from 'vuelidate-property-decorators'
  import {required} from 'vuelidate/lib/validators'
  import { mapGetters } from 'vuex'
  import {Program} from "@/breeding-insight/model/Program";
  import NewDataForm from '@/components/forms/NewDataForm.vue'
  import BasicInputField from "@/components/forms/BasicInputField.vue";
  import {TrialService} from "@/breeding-insight/service/TrialService";
  import EmptyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
  import TableColumn from "@/components/tables/TableColumn.vue";
  import {Metadata, Pagination} from "@/breeding-insight/model/BiResponse";
  import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
  import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
  import { DataFormEventBusHandler } from '@/components/forms/DataFormEventBusHandler';
  import {Trial} from '@/breeding-insight/model/Trial'
  import {Result, Err, Success, ResultGenerator } from "@/breeding-insight/model/Result";
  import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
  import { ValidationError } from '@/breeding-insight/model/errors/ValidationError';
  import {SidePanelTableEventBusHandler} from "@/components/tables/SidePanelTableEventBus";
  import {Trait} from "@/breeding-insight/model/Trait";
  import {TraitService} from "@/breeding-insight/service/TraitService";
  import { integer} from "vuelidate/lib/validators";
  import {ProgramService} from "@/breeding-insight/service/ProgramService";
  import {DataType, Scale} from "@/breeding-insight/model/Scale";
  import {MethodClass} from "@/breeding-insight/model/Method";

@Component({
  mixins: [validationMixin],
  components: { ExpandableTable, NewDataForm, BasicInputField, EmptyTableMessage, TableColumn,
                WarningModal, 
                PlusCircleIcon },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class TrialsTable extends Vue {

  private activeProgram?: Program;
  private traits: Trait[] = [];
  private methodClassOptions: string[] = Object.values(MethodClass);
  private trialsPagination?: Pagination = new Pagination();
  private observationLevelOptions?: string[];
  private tagOptions?: string[];
  private scaleClassOptions: string[] = Object.values(DataType);
  private deactivateActive: boolean = false;
  private newTrialActive: boolean = false;
  private deactivateWarningTitle: string = `Archive ontology term in Program ${this.activeprogram}?`;
  private newTrait = new Trait();
  private programName: string = `Program ${this.activeProgram}`;
  private deleteTrial?: Trial;

  private trialsLoading = true;

  private paginationController: PaginationController = new PaginationController();

  private newTrialFormState: DataFormEventBusHandler = new DataFormEventBusHandler();
  private editTrialFormState: DataFormEventBusHandler = new DataFormEventBusHandler();

  // New trait form
  private newTraitActive: boolean = false;
  private validationHandler: ValidationError = new ValidationError();
  private newTraitFormState: DataFormEventBusHandler = new DataFormEventBusHandler();

  // Side panel table
  private traitSidePanelState: SidePanelTableEventBusHandler = new SidePanelTableEventBusHandler();

  traitValidations = {
    scale: {
      decimalPlaces: {integer},
      validValueMax: {integer},
      validValueMin: {integer}
    }
  }

  mounted() {
    this.getTrials();
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

  createTrial() {
    this.newTrialActive = true;
  }

//   updateTrial(updatedTrial: Trial) {

//     TrialService.update(updatedTrial).then(() => {
//       this.getTrials();
//       this.$emit('show-success-notification', 'Success! ' + updatedTrial.trialName + ' updated.');
// }).catch((error: any) => {
//       this.$emit('show-error-notification', error['errorMessage']);
//     }).finally(() => this.editTrialFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT));

//   }

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

  cancelNewTrait() {
    this.newTrait = new Trait();
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

  displayWarning(trial: Trial) {

    if (trial){
      this.deleteTrial = trial;
      this.deactivateWarningTitle = "Remove " + trial.trialName + " from " + this.activeProgram!.name + "?";
      this.deactivateActive = true;
    } else {
      Vue.$log.error('Could not find object to delete')
    }
  }

  sortTrialName(a: any, b: any, isAsc: boolean) {
    if(isAsc) {
      return a.data.trialName!.localeCompare(b.data.trialName!);
    } else {
      return b.data.trialName!.localeCompare(a.data.trialName!);
    }
  }

  modalDeleteHandler() {
    this.deactivateActive = false;

    if (this.deleteTrial) {
      if (this.deleteTrial.id) {
        if (this.deleteTrial.trialName) {
          const deleteId: string = this.deleteTrial.id;
          const deleteName: string = this.deleteTrial.trialName;
          TrialService.delete(this.activeProgram!.id!, deleteId).then(() => {
            this.getTrials();
            this.$emit('show-success-notification', `${deleteName} removed from program`);
          }).catch((error) => {
            this.$emit('show-error-notification', error['errorMessage']);
          })
          return;
        }
      }
    }
    this.$emit('show-error-notification', `Unable to remove trial`);
  }

  activateNewTraitForm() {
    this.traitSidePanelState.bus.$emit(this.traitSidePanelState.closePanelEvent, () => { this.newTraitActive = true; });
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
