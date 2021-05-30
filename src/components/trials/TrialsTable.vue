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
  <section id="trialsTableLabel">
    <WarningModal
      v-bind:active.sync="deactivateActive"
      v-bind:msg-title="deactivateWarningTitle"
      v-on:deactivate="deactivateActive = false"
    >
      <section>
        <p class="has-text-dark">
          Program-related data referencing this trial will not be affected by this change.
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button v-on:click="modalDeleteHandler()" class="button is-danger"><strong>Yes, remove</strong></button>
          <button v-on:click="deactivateActive = false" class="button">Cancel</button>
        </div>
      </div>              
    </WarningModal>

    <button
      v-if="$ability.can('create', 'Trial')"
      data-testid="newDataForm"
      v-show="!newTrialActive & trials.length > 0"
      class="button is-primary has-text-weight-bold is-pulled-right"
      v-on:click="newTrialActive = true"
    >
      <span class="icon is-small">
        <PlusCircleIcon
          size="1.5x"
          aria-hidden="true"
        />
      </span>
      <span>
        New Trial
      </span>
    </button>

    <NewDataForm
      v-if="newTrialActive"
      v-bind:row-validations="trialValidations"
      v-bind:new-record.sync="newTrial"
      v-bind:data-form-state="newTrialFormState"
      v-on:submit="saveTrial"
      v-on:cancel="cancelTrial"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
      <template v-slot="validations">
        <div class="columns">
          <div class="column is-two-fifths">
            <BasicInputField
              v-model="newTrial.name"
              v-bind:validations="validations.name"
              v-bind:field-name="'Name'"
              v-bind:field-help="'Trial name as preferred. All Unicode special characters accepted.'"
              :placeholder="'New Trial Name'"
            />
          </div>
        </div>
      </template>
    </NewDataForm>

    <ExpandableRowTable
      v-bind:records.sync="trials"
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
      <template v-slot:columns="data">
        <TableColumn name="name" v-bind:label="'Name'">
          {{ data.name }}
        </TableColumn>
        <TableColumn name="numExperiments" v-bind:label="'# Experiments'">
          {{ data.numExperiments }}
        </TableColumn>
      </template>
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
        <EmptyTableMessage
          v-bind:button-view-toggle="!newTrialActive"
          v-bind:button-text="'New Trial'"
          v-bind:create-enabled="$ability.can('create', 'Trial')"
          v-on:newClick="newTrialActive = true"
        >
          <p class="has-text-weight-bold">
            No trials are currently defined for this program.
          </p>
          Trials are used to create studies.<br>
          You can add, edit, and delete trials from this panel.
        </EmptyTableMessage>
      </template>
    </ExpandableRowTable>
  </section>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import WarningModal from '@/components/modals/WarningModal.vue'
  import {PlusCircleIcon} from 'vue-feather-icons'
  import {validationMixin} from 'vuelidate';
  import {Validations} from 'vuelidate-property-decorators'
  import {required} from 'vuelidate/lib/validators'
  import {ProgramLocation} from '@/breeding-insight/model/ProgramLocation'
  import { mapGetters } from 'vuex'
  import {Program} from "@/breeding-insight/model/Program";
  import NewDataForm from '@/components/forms/NewDataForm.vue'
  import BasicInputField from "@/components/forms/BasicInputField.vue";
  import ExpandableRowTable from "@/components/tables/ExpandableRowTable.vue";
  import {TrialService} from "@/breeding-insight/service/TrialService";
  import EmptyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
  import TableColumn from "@/components/tables/TableColumn.vue";
  import {Metadata, Pagination} from "@/breeding-insight/model/BiResponse";
  import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
  import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
  import { DataFormEventBusHandler } from '@/components/forms/DataFormEventBusHandler';
  import {Trial} from '@/breeding-insight/model/Trial'

@Component({
  mixins: [validationMixin],
  components: { NewDataForm, BasicInputField, ExpandableRowTable, EmptyTableMessage, TableColumn,
                WarningModal, 
                PlusCircleIcon },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ProgramLocationsTable extends Vue {

  private activeProgram?: Program;
  private trials: Trial[] = [];
  private trialsPagination?: Pagination = new Pagination();
  private deactivateActive: boolean = false;
  private newTrialActive: boolean = false;
  private deactivateWarningTitle: string = "Remove location from Program name?";
  private newTrial = new Trial();
  private programName: string = "Program Name";
  private deleteTrial?: Trial;

  private paginationController: PaginationController = new PaginationController();

  private newTrialFormState: DataFormEventBusHandler = new DataFormEventBusHandler();
  private editTrialFormState: DataFormEventBusHandler = new DataFormEventBusHandler();

  trialValidations = {
    name: {required}
  }

  mounted() {
    this.getTrials();
  }

  @Watch('paginationController', { deep: true})
  async getTrials() {
    let paginationQuery: PaginationQuery = PaginationController.getPaginationSelections(
      this.paginationController.currentPage,
      this.paginationController.pageSize,
      this.paginationController.showAll);

    this.paginationController.setCurrentCall(paginationQuery);

    try {
      const [programLocations, metadata] = await TrialService.getAll(this.activeProgram!.id!, paginationQuery);

      if (this.paginationController.matchesCurrentRequest(metadata.pagination)) {
        this.trials = trials;
        this.trialsPagination = metadata.pagination;
      }
    } catch (err) {
      // Display error that trials cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load trials');
    }
  }

  createTrial() {
    this.newTrialActive = true;
  }

  updateTrial(updatedTrial: Trial) {

    TrialService.update(updatedTrial).then(() => {
      this.getTrials();
      this.$emit('show-success-notification', 'Success! ' + updatedTrial.name + ' updated.');
    }).catch((error) => {
      this.$emit('show-error-notification', error['errorMessage']);
    }).finally(() => this.editTrialFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT));

  }

  saveTrial() {

    this.newTrial.programId = this.activeProgram!.id;

    TrialService.create(this.newTrial).then((trial: Trial) => {
      this.paginationController.updatePage(1);
      this.getTrials();
      this.$emit('show-success-notification', 'Success! ' + this.newTrial.name + ' added.');
      this.newTrial = new Trial();
      this.newTrialActive = false;
    }).catch((error) => {
      this.$emit('show-error-notification', error['errorMessage']);
    }).finally(() => this.newTrialFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT))

  }

  cancelNewTrial() {
    this.newTrial = new Trial();
    this.newTrialActive = false;
  }

  displayWarning(trial: Trial) {

    if (trial){
      this.deleteTrial = trial;
      this.deactivateWarningTitle = "Remove " + trial.name + " from " + this.activeProgram!.name + "?";
      this.deactivateActive = true;
    } else {
      Vue.$log.error('Could not find object to delete')
    }
  }

  modalDeleteHandler() {
    this.deactivateActive = false;

    if (this.deleteTrial) {
      if (this.deleteTrial.id) {
        if (this.deleteTrial.name) {
          const deleteId: string = this.deleteTrial.id;
          const deleteName: string = this.deleteTrial.name;
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

}

</script>
