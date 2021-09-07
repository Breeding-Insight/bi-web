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
  <section id="locationTableLabel">
    <WarningModal
      v-bind:active.sync="deactivateActive"
      v-bind:msg-title="deactivateWarningTitle"
      v-on:deactivate="deactivateActive = false"
    >
      <section>
        <p class="has-text-dark" :class="this.$modalTextClass">
          Program-related data referencing this location will not be affected by this change.
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
      v-if="$ability.can('create', 'Location')"
      data-testid="newDataForm"
      v-show="!newLocationActive"
      class="button is-primary has-text-weight-bold is-pulled-right"
      v-on:click="newLocationActive = true"
    >
      <span class="icon is-small">
        <PlusCircleIcon
          size="1.5x"
          aria-hidden="true"
        />
      </span>
      <span>
        New Location
      </span>
    </button>

    <div class="is-clearfix"></div>

    <NewDataForm
      v-if="newLocationActive"
      v-bind:row-validations="locationValidations"
      v-bind:new-record.sync="newLocation"
      v-bind:data-form-state="newLocationFormState"
      v-on:submit="saveLocation"
      v-on:cancel="cancelNewLocation"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
      <template v-slot="validations">
        <div class="columns">
          <div class="column is-two-fifths">
            <BasicInputField
              v-model="newLocation.name"
              v-bind:validations="validations.name"
              v-bind:field-name="'Name'"
              v-bind:field-help="'Location name as preferred. All Unicode special characters accepted.'"
              :placeholder="'New Location Name'"
            />
          </div>
        </div>
      </template>
    </NewDataForm>

    <ExpandableTable
      v-bind:records.sync="locations"
      v-bind:loading="this.locationsLoading"
      v-bind:row-validations="locationValidations"
      v-bind:editable="$ability.can('update', 'Location')"
      v-bind:archivable="$ability.can('archive', 'Location')"
      v-bind:pagination="locationsPagination"
      v-bind:data-form-state="editLocationFormState"
      v-on:submit="updateLocation($event)"
      v-on:remove="displayWarning($event)"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
      v-on:paginate="paginationController.updatePage($event)"
      v-on:paginate-toggle-all="paginationController.toggleShowAll()"
      v-on:paginate-page-size="paginationController.updatePageSize($event)"
    >
      <b-table-column field="data.name" label="Name" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.name }}
      </b-table-column>
      <b-table-column field="data.numExperiments" label="# Experiments" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.numExperiments }}
      </b-table-column>
      <template v-slot:edit="{editData, validations}">
        <div class="columns">
          <div class="column is-two-fifths">
            <BasicInputField
              v-model="editData.name"
              v-bind:validations="validations.name"
              v-bind:field-name="'Name'"
              v-bind:field-help="'Location name as preferred. All Unicode special characters accepted.'"
            />
          </div>
        </div>
      </template>
      <template v-slot:emptyMessage>
          <p class="has-text-weight-bold">
            No locations are currently defined for this program.
          </p>
          Locations are used in trials and experiments.<br>
          Any locations created when setting up trials and experiments will appear in this list automatically.<br>
          You can also add, edit, and delete locations from this panel.
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
  import {ProgramLocation} from '@/breeding-insight/model/ProgramLocation'
  import { mapGetters } from 'vuex'
  import {Program} from "@/breeding-insight/model/Program";
  import NewDataForm from '@/components/forms/NewDataForm.vue'
  import BasicInputField from "@/components/forms/BasicInputField.vue";
  import {ProgramLocationService} from "@/breeding-insight/service/ProgramLocationService";
  import TableColumn from "@/components/tables/TableColumn.vue";
  import {Metadata, Pagination} from "@/breeding-insight/model/BiResponse";
  import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
  import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
  import { DataFormEventBusHandler } from '@/components/forms/DataFormEventBusHandler';
  import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';

@Component({
  mixins: [validationMixin],
  components: { ExpandableTable, NewDataForm, BasicInputField, TableColumn,
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
  private locations: ProgramLocation[] = [];
  private locationsPagination?: Pagination = new Pagination();
  private deactivateActive: boolean = false;
  private newLocationActive: boolean = false;
  private deactivateWarningTitle: string = "Remove location from Program name?";
  private newLocation = new ProgramLocation();
  private programName: string = "Program Name";
  private deleteLocation?: ProgramLocation;

  private locationsLoading = true;

  private paginationController: PaginationController = new PaginationController();

  private newLocationFormState: DataFormEventBusHandler = new DataFormEventBusHandler();
  private editLocationFormState: DataFormEventBusHandler = new DataFormEventBusHandler();

  locationValidations = {
    name: {required}
  }

  mounted() {
    this.getLocations();
  }

  @Watch('paginationController', { deep: true})
  getLocations() {
    let paginationQuery: PaginationQuery = PaginationController.getPaginationSelections(
      this.paginationController.currentPage, this.paginationController.pageSize, this.paginationController.showAll);
    this.paginationController.setCurrentCall(paginationQuery);

    ProgramLocationService.getAll(this.activeProgram!.id!, paginationQuery).then(([programLocations, metadata]) => {
      if (this.paginationController.matchesCurrentRequest(metadata.pagination)){
        this.locations = programLocations;
        this.locationsPagination = metadata.pagination;
      }

    }).catch((error) => {
      // Display error that locations cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load locations');
      throw error;
    }).finally(() => this.locationsLoading = false);
  }

  createLocation() {
    this.newLocationActive = true;
  }

  updateLocation(updatedLocation: ProgramLocation) {

    ProgramLocationService.update(updatedLocation).then(() => {
      this.getLocations();
      this.$emit('show-success-notification', 'Success! ' + updatedLocation.name + ' updated.');
    }).catch((error) => {
      this.$emit('show-error-notification', error['errorMessage']);
    }).finally(() => this.editLocationFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT));

  }

  saveLocation() {

    this.newLocation.programId = this.activeProgram!.id;

    ProgramLocationService.create(this.newLocation).then((location: ProgramLocation) => {
      this.paginationController.updatePage(1);
      this.getLocations();
      this.$emit('show-success-notification', 'Success! ' + this.newLocation.name + ' added.');
      this.newLocation = new ProgramLocation();
      this.newLocationActive = false;
    }).catch((error) => {
      this.$emit('show-error-notification', error['errorMessage']);
    }).finally(() => this.newLocationFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT))

  }

  cancelNewLocation() {
    this.newLocation = new ProgramLocation();
    this.newLocationActive = false;
  }

  displayWarning(location: ProgramLocation) {

    if (location){
      this.deleteLocation = location;
      this.deactivateWarningTitle = "Remove " + location.name + " from " + this.activeProgram!.name + "?";
      this.deactivateActive = true;
    } else {
      Vue.$log.error('Could not find object to delete')
    }
  }

  modalDeleteHandler() {
    this.deactivateActive = false;

    if (this.deleteLocation) {
      if (this.deleteLocation.id) {
        if (this.deleteLocation.name) {
          const deleteId: string = this.deleteLocation.id;
          const deleteName: string = this.deleteLocation.name;
          ProgramLocationService.delete(this.activeProgram!.id!, deleteId).then(() => {
            this.getLocations();
            this.$emit('show-success-notification', `${deleteName} removed from program`);
          }).catch((error) => {
            this.$emit('show-error-notification', error['errorMessage']);
          })
          return;
        }
      }
    }
    this.$emit('show-error-notification', `Unable to remove location`);
  }

}

</script>