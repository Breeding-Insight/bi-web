<template>
  <section id="locationTableLabel">
    <WarningModal
      v-bind:active.sync="deactivateActive"
      v-bind:msg-title="deactivateWarningTitle"
      v-on:deactivate="deactivateActive = false"
    >
      <section>
        <p class="has-text-dark">
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
      v-show="!newLocationActive & locations.length > 0"
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

    <NewDataForm
      v-if="newLocationActive"
      v-bind:row-validations="locationValidations"
      v-bind:new-record.sync="newLocation"
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

    <BaseTable
      v-bind:headers="locationTableHeaders"
      v-bind:records.sync="locations"
      v-bind:row-validations="locationValidations"
      v-bind:editable="true"
      v-on:submit="updateLocation($event)"
      v-on:remove="displayWarning($event)"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
      <template v-slot:columns="data">
        <TableRowColumn name="name">
          {{ data.name }}
        </TableRowColumn>
        <TableRowColumn name="numExperiments">
          {{ data.numExperiments }}
        </TableRowColumn>
      </template>
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
        <EmptyTableMessage
          v-bind:button-view-toggle="!newLocationActive"
          v-bind:button-text="'New Location'"
          v-on:newClick="newLocationActive = true"
        >
          <p class="has-text-weight-bold">
            No locations are currently defined for this program.
          </p>
          Locations are used in trials and experiments.<br>
          Any locations created when setting up trials and experiments will appear in this list automatically.<br>
          You can also add, edit, and delete locations from this panel.  
        </EmptyTableMessage>
      </template>
    </BaseTable>
  </section>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
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
import BaseTable from "@/components/tables/BaseTable.vue";
import {ProgramLocationService} from "@/breeding-insight/service/ProgramLocationService";
import EmptyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
import TableRowColumn from "@/components/tables/TableRowColumn.vue";

@Component({
  mixins: [validationMixin],
  components: { NewDataForm, BasicInputField, BaseTable, EmptyTableMessage, TableRowColumn,
                WarningModal, 
                PlusCircleIcon },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ProgramLocationsTable extends Vue {

  private locationTableHeaders: string[] = ['Name', '# Experiments'];
  private activeProgram?: Program;
  private locations: ProgramLocation[] = [];
  private deactivateActive: boolean = false;
  private newLocationActive: boolean = false;
  private deactivateWarningTitle: string = "Remove location from Program name?";
  private newLocation = new ProgramLocation();
  private programName: string = "Program Name";
  private deleteLocation?: ProgramLocation;

  locationValidations = {
    name: {required}
  }

  mounted() {
    this.getLocations();
  }

  getLocations() {
    ProgramLocationService.getAll(this.activeProgram!.id!).then((programLocations: ProgramLocation[]) => {
      this.locations = programLocations;
    }).catch((error) => {
      // Display error that locations cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load locations');
      throw error;
    });
  }

  createLocation() {
    this.newLocationActive = true;
  }

  updateLocation(updatedLocation: ProgramLocation) {

    ProgramLocationService.update(updatedLocation).then(() => {
      this.getLocations();
      this.$emit('show-success-notification', 'Success! ' + updatedLocation.name + ' updated.');
    }).catch(() => {
      this.$emit('show-error-notification', 'Error updating location');
    });

  }

  saveLocation() {

    this.newLocation.programId = this.activeProgram!.id;

    ProgramLocationService.create(this.newLocation).then((location: ProgramLocation) => {
      this.getLocations();
      this.$emit('show-success-notification', 'Success! ' + this.newLocation.name + ' added.');
      this.newLocation = new ProgramLocation();
      this.newLocationActive = false;
    }).catch(() => {
      this.$emit('show-error-notification', 'Error while creating location, ' + this.newLocation.name);
    })

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
          }).catch(() => {
            this.$emit('show-error-notification', `Unable to remove location, ${deleteName}.`);
          })
          return;
        }
      }
    }
    this.$emit('show-error-notification', `Unable to remove location`);
  }

}

</script>