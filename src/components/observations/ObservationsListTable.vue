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
  <section id="observationsTableLabel">
    <WarningModal
      v-bind:active.sync="deactivateActive"
      v-bind:msg-title="deactivateWarningTitle"
      v-on:deactivate="deactivateActive = false"
    >
      <section>
        <p class="has-text-dark">
          Program-related data referencing this observation will not be affected by this change.
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button v-on:click="modalDeleteHandler()" class="button is-danger"><strong>Yes, remove</strong></button>
          <button v-on:click="deactivateActive = false" class="button">Cancel</button>
        </div>
      </div>              
    </WarningModal>

    <ExpandableRowTable
      v-bind:records.sync="observations"
      v-bind:row-validations="observationValidations"
      v-bind:pagination="observationsPagination"
      v-bind:data-form-state="editObservationFormState"
      v-on:submit="updateObservation($event)"
      v-on:remove="displayWarning($event)"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
      v-on:paginate="paginationController.updatePage($event)"
      v-on:paginate-toggle-all="paginationController.toggleShowAll()"
      v-on:paginate-page-size="paginationController.updatePageSize($event)"
    >
      <template v-slot:columns="data">
        <TableColumn name="germplasm" v-bind:label="'Germplasm'">
          <p>{{ data.germplasmName }}</p>
        </TableColumn>
        <TableColumn name="observation-unit" v-bind:label="'Observation Unit'">
          <p>{{ data.observationUnitName }}</p>
        </TableColumn>
        <TableColumn name="trait" v-bind:label="'Trait'">
          <p>{{ data.traitName }}</p>
        </TableColumn>
        <TableColumn name="value" v-bind:label="'Value'">
          <p>{{ data.value }}</p>
        </TableColumn>
        <TableColumn name="season" v-bind:label="'Season'">
          <p>{{ data.season.name }}</p>
        </TableColumn>
        <TableColumn name="timestamp" v-bind:label="'Timestamp'">
          <p>{{ data.stamp | dmyFormat}}</p>
        </TableColumn>
        <TableColumn name="collector" v-bind:label="'Collector'">
          <p>{{ data.collector }}</p>
        </TableColumn>
        <TableColumn name="updated-by" v-bind:label="'Updated By'">
          <p>{{ data.updatedBy }}</p>
        </TableColumn>
      </template>
      <template v-slot:edit="{editData, validations}">
        <div class="columns">
          <div class="column is-two-fifths">
            <BasicInputField
              v-model="editData.name"
              v-bind:validations="validations.name"
              v-bind:field-name="'Name'"
              v-bind:field-help="'Observation name as preferred. All Unicode special characters accepted.'"
            />
          </div>
        </div>
      </template>
      <template v-slot:emptyMessage>
        <EmptyTableMessage
          v-bind:button-view-toggle="!newObservationActive"
          v-bind:button-text="'New Observation'"
          v-bind:create-enabled="$ability.can('create', 'Observation')"
          v-on:newClick="newObservationActive = true"
        >
          <p class="has-text-weight-bold">
            No observations are currently defined for this program.
          </p>
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
  import { mapGetters } from 'vuex'
  import {Program} from "@/breeding-insight/model/Program";
  import NewDataForm from '@/components/forms/NewDataForm.vue'
  import BasicInputField from "@/components/forms/BasicInputField.vue";
  import ExpandableRowTable from "@/components/tables/ExpandableRowTable.vue";
  import {ObservationService} from "@/breeding-insight/service/ObservationService";
  import EmptyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
  import TableColumn from "@/components/tables/TableColumn.vue";
  import {Metadata, Pagination} from "@/breeding-insight/model/BiResponse";
  import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
  import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
  import { DataFormEventBusHandler } from '@/components/forms/DataFormEventBusHandler';
  import {Observation} from '@/breeding-insight/model/Observation'
  import {Result, Err, Success, ResultGenerator } from "@/breeding-insight/model/Result";
  import { dmyFormat } from '@/breeding-insight/utils/filters';

@Component({
  mixins: [validationMixin],
  components: { NewDataForm, BasicInputField, ExpandableRowTable, EmptyTableMessage, TableColumn,
                WarningModal, 
                PlusCircleIcon },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  },
  filters: {
    dmyFormat
  }
})
export default class ObservationsTable extends Vue {

  private activeProgram?: Program;
  private programId?: string = this.$route.params.programId;
  private studyId?: string = this.$route.params.studyId;
  private observations: Observation[] = [];
  private observationsPagination?: Pagination = new Pagination();
  private deactivateActive: boolean = false;
  private newObservationActive: boolean = false;
  private deactivateWarningTitle: string = "Remove location from Program name?";
  private newObservation = new Observation();
  private programName: string = "Program Name";
  private deleteObservation?: Observation;

  private paginationController: PaginationController = new PaginationController();

  private newObservationFormState: DataFormEventBusHandler = new DataFormEventBusHandler();
  private editObservationFormState: DataFormEventBusHandler = new DataFormEventBusHandler();

  observationValidations = {
    name: {required}
  }

  mounted() {
    this.getObservations();
  }

  @Watch('paginationController', { deep: true})
  async getObservations() {
    let paginationQuery: PaginationQuery = PaginationController.getPaginationSelections(
      this.paginationController.currentPage,
      this.paginationController.pageSize,
      this.paginationController.showAll);

    this.paginationController.setCurrentCall(paginationQuery);

    try {
      const response: Result<Error, [Observation[], Metadata]> = await ObservationService.getByStudy(this.programId!, this.studyId!, paginationQuery);
      if(response.isErr()) throw response.value;
      let [observations, metadata] = response.value;

      if (this.paginationController.matchesCurrentRequest(metadata.pagination)) {
        this.observations = observations;
        this.observationsPagination = metadata.pagination;
      }
    } catch (err) {
      // Display error that observations cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load observations');
    }
  }

  createObservation() {
    this.newObservationActive = true;
  }

//   updateObservation(updatedObservation: Observation) {

//     ObservationService.update(updatedObservation).then(() => {
//       this.getObservations();
//       this.$emit('show-success-notification', 'Success! ' + updatedObservation.observationName + ' updated.');
// }).catch((error: any) => {
//       this.$emit('show-error-notification', error['errorMessage']);
//     }).finally(() => this.editObservationFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT));

//   }

  saveObservation() {

    // this.newObservation.id = this.activeProgram!.id;

    // ObservationService.create(this.newObservation).then((observation: Observation) => {
    //   this.paginationController.updatePage(1);
    //   this.getObservations();
    //   this.$emit('show-success-notification', 'Success! ' + this.newObservation.observationName + ' added.');
    //   this.newObservation = new Observation();
    //   this.newObservationActive = false;
    // }).catch((error) => {
    //   this.$emit('show-error-notification', error['errorMessage']);
    // }).finally(() => this.newObservationFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT))

  }

  cancelNewObservation() {
    this.newObservation = new Observation();
    this.newObservationActive = false;
  }

  displayWarning(observation: Observation) {

    if (observation){
      this.deleteObservation = observation;
      this.deactivateWarningTitle = "Remove " + observation.value + " from " + this.activeProgram!.name + "?";
      this.deactivateActive = true;
    } else {
      Vue.$log.error('Could not find object to delete')
    }
  }

  // modalDeleteHandler() {
  //   this.deactivateActive = false;

  //   if (this.deleteObservation) {
  //     if (this.deleteObservation.id) {
  //       if (this.deleteObservation.observationName) {
  //         const deleteId: string = this.deleteObservation.id;
  //         const deleteName: string = this.deleteObservation.observationName;
  //         ObservationService.delete(this.activeProgram!.id!, deleteId).then(() => {
  //           this.getObservations();
  //           this.$emit('show-success-notification', `${deleteName} removed from program`);
  //         }).catch((error) => {
  //           this.$emit('show-error-notification', error['errorMessage']);
  //         })
  //         return;
  //       }
  //     }
  //   }
  //   this.$emit('show-error-notification', `Unable to remove observation`);
  // }

}

</script>
