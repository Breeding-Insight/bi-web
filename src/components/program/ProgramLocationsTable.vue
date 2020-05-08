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
    <NewDataRowForm
      v-if="newLocationActive"
      @submit="saveLocation"
      @cancel="cancelNewLocation"
    >
      <div class="columns">
        <div class="column is-two-fifths">
          <InputField
            v-model="newLocation.name"
            :field-error.sync="$v.newLocation.name.$error"
            :field-type="'text'"
            :placeholder="'New Location Name'"
          >
            <template v-slot:label>Name</template>
            <template v-slot:errors>
              <InputError>Name is required</InputError>
            </template>
            <template v-slot:help>
              Location name as preferred. All Unicode special characters accepted.
            </template>
          </InputField>
        </div>
      </div>
    </NewDataRowForm>
    <section v-if="locations.length > 0">
      <table
        role="grid"
        aria-labelledby="locationTableLabel"
        class="table is-striped is-narrow is-hoverable is-fullwidth"
      >
        <thead>
          <tr>
            <th>
              Location Name
            </th>
            <th># Experiments</th>
            <th>
              <button
                class="button is-primary has-text-weight-bold is-pulled-right"
                @click="createLocation()" v-if="!newLocationActive"
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
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-bind:key="location.data.id" v-for="(location, index) in locations" 
              v-bind:class="{'is-selected': (location.edit == true), 'is-new': (location.new == true)}"
          >
            <td v-if="location.edit">
              <input type="text" class="input" v-model="location.editData.name" placeholder="Location Name">
            </td>
            <td v-else>{{ location.data.name }}</td>
            <td>
                {{ location.data.experiments }}
            </td>
            
            <td class="has-text-right">
              
              <a class="margin-right-2" v-on:click="location.toggleEdit()" v-if="!location.edit">Edit</a>
              <a class="" v-on:click="displayWarning(index)" v-if="!location.edit">Remove</a>
              
              <button class="button is-pulled-right" title="Cancel Edit" v-on:click="location.cancelEdit()" v-if="location.edit">
                <span class="icon is-small is-light">
                  <XSquareIcon size="1.5x" aria-hidden="true"></XSquareIcon>
                  <span class="is-sr-only">Cancel Edit</span>
                </span>
                <span>
                  Cancel
                </span>
              </button>
              
              <button class="button is-pulled-right is-primary"  title="Confirm Location" v-on:click="updateLocation(index)" v-if="location.edit">
                <span class="icon is-small">
                  <CheckCircleIcon size="1.5x" aria-hidden="true"></CheckCircleIcon>
                  <span class="is-sr-only">Confirm Edits</span>
                </span>
                <span>
                  Save
                </span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <section v-else>
      <div class="columns">
        <div class="column is-10">
          <p class="has-text-weight-bold">
            No locations are currently defined for this program.
          </p>
          Locations are used in trials and experiments.<br>
          Any locations created when setting up trials and experiments will appear in this list automatically.<br>
          You can also add, edit, and delete locations from this panel.  
        </div>
        <div class="column">
          <button class="button is-primary has-text-weight-bold is-pulled-right"
                  @click="createLocation()" v-if="!newLocationActive"
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
        </div>
      </div>
      <hr>
    </section>
  </section>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import WarningModal from '@/components/modals/WarningModal.vue'
import {Location} from '@/breeding-insight/model/Location'
import {TableRow} from '@/breeding-insight/model/view_models/TableRow'
import {PlusCircleIcon, CheckCircleIcon, XSquareIcon} from 'vue-feather-icons'
import {validationMixin} from 'vuelidate';
import InputError from '@/components/forms/InputError.vue'
import InputField from '@/components/forms/InputField.vue'
import NewDataRowForm from '@/components/forms/NewDataRowForm.vue'
import {Validations} from 'vuelidate-property-decorators'
import {required} from 'vuelidate/lib/validators'
import {ProgramLocation} from '@/breeding-insight/model/ProgramLocation'

@Component({
  mixins: [validationMixin],
  components: { NewDataRowForm,
                InputError, InputField,
                WarningModal, 
                PlusCircleIcon, CheckCircleIcon, XSquareIcon }
})
export default class ProgramLocationsTable extends Vue {

  private locations: Array<TableRow<Location>> = [];
  private deactivateActive: boolean = false;
  private newLocationActive: boolean = false;
  private deactivateWarningTitle: string = "Remove location from Program name?";
  private deleteIndex = -1;
  private currentNewRow: TableRow<Location> | null = null;

  private newLocation: ProgramLocation = new ProgramLocation();
  private programName: string = "Program Name";

  @Validations()
  validations = {
    newLocation : {
      name: {required}
    }
  }

  mounted() {
    this.getLocations();
  }

  getLocations() {
    // TODO: api call
    this.locations.push(new TableRow(true, new Location('1', 'Alternate greenhouse', '3')));
    this.locations.push(new TableRow(true, new Location('2', 'Better labeling for locations', '10')));
    this.locations.push(new TableRow(true, new Location('3', 'capitalization', '3')));
  }

  createLocation() {
    this.newLocationActive = true;
  }

  updateLocation(rowIndex: number) {
    // TODO: api call
    const editRow: TableRow<Location> = this.locations[rowIndex];
    editRow.confirmChanges();
    editRow.toggleEdit();

    this.clearNewRow();
    this.$emit('show-success-notification', 'Location successfully updated');

  }

  saveLocation() {
    this.$v.$touch();
    if (this.$v.$anyError){
      this.$emit('show-error-notification', 'Fix Invalid Fields');
      return;
    }
    else {
      // TODO: api call
      // some index management here for now just to allow the stub to work
      let id: Number = Number(1);

      if (this.locations.length > 0) {
        const editRow: TableRow<Location> = this.locations[this.locations.length-1];
        const location: Location = editRow.editData;
        id = Number(location.id)+1;
      }

      if (this.newLocation.name) {
        const newLocation: Location = new Location(id.toString(), this.newLocation.name, '');
        const newRow: TableRow<Location> = new TableRow(true, newLocation);
        newRow.toggleNew();
        this.locations.push(newRow);

        this.clearNewRow();
        this.currentNewRow = newRow;

        this.$emit('show-success-notification', 'Success! ' + this.newLocation.name + ' added.');
        this.newLocationActive = false;
      }
      
      // Check all of our fields to see if they were required
      this.newLocation = new ProgramLocation();
      this.$v.$reset();
    }
  }

  cancelNewLocation() {
    this.newLocation = new ProgramLocation();
    this.$v.$reset();
    this.newLocationActive = false;
  }

  displayWarning(rowIndex: number) {
    // Get the location
    const editRow: TableRow<Location> = this.locations[rowIndex];
    const location: Location = editRow.editData;
    this.deleteIndex = rowIndex;
    this.deactivateWarningTitle = "Remove " + location.name + " from " + this.programName + "?";
    this.deactivateActive = true;
  }

  modalDeleteHandler() {
    this.deactivateActive = false;

    // TODO: api call
    this.clearNewRow();
    this.locations.splice(this.deleteIndex, 1);
  }

  clearNewRow() {
     if (this.currentNewRow != null) {
      this.currentNewRow.toggleNew();
      this.currentNewRow = null;
    }
  }

}

</script>