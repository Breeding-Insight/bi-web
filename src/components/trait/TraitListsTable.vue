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
          <button v-on:click="modalDeleteHandler()" class="button is-danger"><strong>Yes, remove</strong></button>
          <button v-on:click="deactivateActive = false" class="button">Cancel</button>
        </div>
      </div>              
    </WarningModal>

    <BaseTable
      v-bind:headers="traitTableHeaders"
      v-bind:records.sync="traits"
      v-bind:row-validations="traitValidations"
      v-bind:editable="false"
      v-bind:pagination="traitsPagination"
      v-on:submit="updateTrait($event)"
      v-on:remove="displayWarning($event)"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
      v-on:paginate="paginationController.updatePage($event)"
      v-on:paginate-toggle-all="paginationController.toggleShowAll()"
      v-on:paginate-page-size="paginationController.updatePageSize($event)"
    >
      <template v-slot:columns="data">
        <TableRowColumn name="name">
          {{ data.traitName }}
        </TableRowColumn>
        <TableRowColumn name="level">
          {{ data.programObservationLevel.name }}
        </TableRowColumn>
        <TableRowColumn name="method">
          {{ data.method.methodName }}
        </TableRowColumn>
        <TableRowColumn name="scale">
          {{ data.scale.scaleName }}
        </TableRowColumn>        
      </template>
      <template v-slot:edit="{editData, validations}">
        <div class="columns">
          <div class="column is-two-fifths">
            <BasicInputField
              v-model="editData.name"
              v-bind:validations="validations.name"
              v-bind:field-name="'Name'"
              v-bind:field-help="'Trait name as preferred. All Unicode special characters accepted.'"
            />
          </div>
        </div>
      </template>
      <template v-slot:emptyMessage>
        <EmptyTableMessage
        >
          <p class="has-text-weight-bold">
            No traits are currently defined for this program.
          </p>
          Create new traits by clicking "Import Traits".
        </EmptyTableMessage>
      </template>
    </BaseTable>
  </section>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import WarningModal from '@/components/modals/WarningModal.vue'
import {PlusCircleIcon} from 'vue-feather-icons'
import {validationMixin} from 'vuelidate';
import {Validations} from 'vuelidate-property-decorators'
import {required} from 'vuelidate/lib/validators'
import {Trait} from '@/breeding-insight/model/Trait'
import { mapGetters } from 'vuex'
import {Program} from "@/breeding-insight/model/Program";
import NewDataForm from '@/components/forms/NewDataForm.vue'
import BasicInputField from "@/components/forms/BasicInputField.vue";
import BaseTable from "@/components/tables/BaseTable.vue";
import {TraitService} from "@/breeding-insight/service/TraitService";
import EmptyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
import TableRowColumn from "@/components/tables/TableRowColumn.vue";
import {Metadata, Pagination} from "@/breeding-insight/model/BiResponse";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";

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
export default class TraitTable extends Vue {

  private traitTableHeaders: string[] = ['Name', 'Level', 'Method', 'Scale'];
  private activeProgram?: Program;
  private traits: Trait[] = [];
  private traitsPagination?: Pagination = new Pagination();
  private paginationController: PaginationController = new PaginationController();
  private deactivateActive: boolean = false;
  private newTraitActive: boolean = false;
  private deactivateWarningTitle: string = "Remove trait from Program name?";
  private newTrait = new Trait();
  private traitName: string = "Program Trait";
  private deleteTrait?: Trait;

  traitValidations = {
    name: {required}
  }

  mounted() {
    this.getTraits();
  }

  @Watch('paginationController', { deep: true})
  getTraits() {
    let paginationQuery: PaginationQuery = PaginationController.getPaginationSelections(
      this.paginationController.currentPage, this.paginationController.pageSize, this.paginationController.showAll);
    this.paginationController.setCurrentCall(paginationQuery);

    TraitService.getAll(this.activeProgram!.id!, paginationQuery).then(([traits, metadata]) => {
      if (this.paginationController.matchesCurrentRequest(metadata.pagination)){
        this.traits = traits;
        this.traitsPagination = metadata.pagination;
      }
    }).catch((error) => {
      // Display error that traits cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load traits');
      throw error;
    }).finally(() => {
      this.loadedData();
    });
  }

  loadedData() {
    this.loaded = true;
    this.$emit('loaded');
  }

  createTrait() {
    this.newTraitActive = true;
  }

  updateTrait(updatedTrait: Trait) {

    TraitService.update(updatedTrait).then(() => {
      this.getTraits();
      this.$emit('show-success-notification', 'Success! ' + updatedTrait.name + ' updated.');
    }).catch(() => {
      this.$emit('show-error-notification', 'Error updating trait');
    });

  }

  saveTrait() {

    this.newTrait.programId = this.activeProgram!.id;

    TraitService.create(this.newTrait).then((trait: Trait) => {
      this.getTraits();
      this.$emit('show-success-notification', 'Success! ' + this.Trait.name + ' added.');
      this.newTrait = new Trait();
      this.newTraitActive = false;
    }).catch(() => {
      this.$emit('show-error-notification', 'Error while creating trait, ' + this.newTrait.name);
    })

  }

  cancelNewTrait() {
    this.newTrait = new Trait();
    this.newTraitActive = false;
  }

  displayWarning(trait: Trait) {

    if (trait){
      this.deleteTrait = trait;
      this.deactivateWarningTitle = "Remove " + trait.name + " from " + this.activeProgram!.name + "?";
      this.deactivateActive = true;
    } else {
      Vue.$log.error('Could not find object to delete')
    }
  }

  modalDeleteHandler() {
    this.deactivateActive = false;

    if (this.deleteTrait) {
      if (this.deleteTrait.id) {
        if (this.deleteTrait.name) {
          const deleteId: string = this.deleteTrait.id;
          const deleteName: string = this.deleteTrait.name;
          TraitService.delete(this.activeProgram!.id!, deleteId).then(() => {
            this.getTraitss();
            this.$emit('show-success-notification', `${deleteName} removed from program`);
          }).catch(() => {
            this.$emit('show-error-notification', `Unable to remove trait, ${deleteName}.`);
          })
          return;
        }
      }
    }
    this.$emit('show-error-notification', `Unable to remove trait`);
  }

}

</script>
