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
  <div class="breeding-methods">
    <WarningModal
        v-bind:active.sync="deleteActive"
        v-bind:msg-title="'Remove Breeding Method?'"
        v-on:deactivate="cancelDelete"
    >
      <section>
        <p class="has-text-dark">
          Are you sure you want to delete breeding method: {{ deleteBreedingMethod.name }}?
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button
              class="button is-danger"
              v-on:click="modalDeleteHandler()"
          >
            <strong>Yes, delete</strong>
          </button>
          <button
              class="button"
              v-on:click="cancelDelete"
          >
            Cancel
          </button>
        </div>
      </div>
    </WarningModal>

    <div class="columns">
      <div class="column is-whole has-text-right buttons">
        <button
            v-if="$ability.can('update', 'ProgramConfiguration')"
            class="button is-primary"
            v-on:click="openModal"
        >
          Choose Predefined Methods
        </button>
        <button
            v-if="$ability.can('create', 'ProgramConfiguration')"
            class="button is-primary"
            v-on:click="showNewMethod"
        >
          Create Breeding Method
        </button>
      </div>
    </div>

    <NewDataForm
        v-if="newMethodActive"
        v-bind:row-validations="newMethodValidations"
        v-bind:new-record.sync="newMethod"
        v-bind:data-form-state="newMethodFormState"
        v-on:submit="saveMethod"
        v-on:cancel="cancelNewMethod"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
      <template v-slot="validations">
        <div class="columns">
          <div class="column is-one-fourth">
            <BasicInputField
                v-model="newMethod.name"
                v-bind:validations="validations.name"
                v-bind:field-name="'Name'"
                v-bind:field-help="''"
            />
          </div>
          <div class="column is-one-fourth">
            <BasicInputField
                v-model="newMethod.abbreviation"
                v-bind:validations="validations.abbreviation"
                v-bind:field-name="'Abbreviation'"
                v-bind:field-help="'No more than 3 characters'"
            />
          </div>
          <div class="column is-one-fourth">
            <BasicInputField
                v-model="newMethod.description"
                v-bind:validations="validations.description"
                v-bind:field-name="'Description'"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-fourth">
            <BasicSelectField
                v-model="newMethod.category"
                v-bind:validations="validations.category"
                v-bind:options="categories"
                v-bind:field-name="'Category'"
            />
          </div>
          <div class="column is-one-fourth">
            <BasicSelectField
                v-model="newMethod.geneticDiversity"
                v-bind:validations="validations.geneticDiversity"
                v-bind:options="diversities"
                v-bind:field-name="'Genetic Diversity'"
            />
          </div>
        </div>
      </template>
    </NewDataForm>

    <div v-if="$ability.can('update', 'ProgramConfiguration') && inUseBreedingMethods.length > 0">
      <article class="message is-warning">
        <div class="message-body">
          <div class="columns is-vcentered">
            <div class="column">
              <div class="has-text-dark">
                <AlertTriangleIcon
                    size="1x"
                    class="has-vertical-align-middle"
                /> Some breeding methods cannot be edited because there are germplasm records using those methods in {{activeProgram.name}}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>

    <ExpandableTable
        v-bind:records.sync="programBreedingMethods"
        v-bind:loading="loading"
        v-bind:pagination="paginationController"
        v-bind:default-sort="['data.name', 'asc']"
        v-bind:debounce-search="400"
        v-bind:editable="$ability.can('update', 'ProgramConfiguration')"
        v-bind:row-editable="isRowEditable"
        v-bind:data-form-state="editMethodFormState"
        v-bind:row-validations="newMethodValidations"
        v-bind:archivable="$ability.can('update', 'ProgramConfiguration')"
        v-bind:row-archivable="isRowArchivable"
        v-bind:deactivate-link-text="'Delete'"
        v-on:submit="updateMethod($event)"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
        v-on:remove="displayWarning($event)"
    >
      <b-table-column field="scope" label="Scope" searchable :customSearch="filterByScope" :th-attrs="(column) => ({scope:'col'})">
        <template v-slot="props">
          <span class="tag" :class="progressTagType(props.row.data.programId)">
            {{ formatOwner(props.row.data.programId) }}
          </span>
        </template>
        <template v-slot:searchable="props">
          <div class="select">
            <select
                v-model="props.filters[props.column.field]"
              >
              <option value=""></option>
              <option value="SYSTEM">System</option>
              <option value="PROGRAM">Program</option>
            </select>
          </div>
        </template>
      </b-table-column>
      <b-table-column field="data.name" label="Name" sortable searchable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.name}}
      </b-table-column>
      <b-table-column field="data.abbreviation" label="Abbreviation" sortable searchable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.abbreviation}}
      </b-table-column>
      <b-table-column field="data.description" label="Description" sortable searchable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
        {{ props.row.data.description}}
      </b-table-column>
      <b-table-column field="data.category" label="Category" sortable searchable :th-attrs="(column) => ({scope:'col'})">
        <template v-slot="props">
          {{ props.row.data.category}}
        </template>
        <template v-slot:searchable="props">
          <div class="select">
            <select
                v-model="props.filters[props.column.field]"
            >
              <option value=""></option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
        </template>
      </b-table-column>
      <b-table-column field="data.geneticDiversity" label="Genetic Diversity" sortable searchable :th-attrs="(column) => ({scope:'col'})">
        <template v-slot="props">
          {{ props.row.data.geneticDiversity}}
        </template>
        <template v-slot:searchable="props">
          <div class="select">
            <select
                v-model="props.filters[props.column.field]"
            >
              <option value=""></option>
              <option v-for="div in diversities" :key="div" :value="div">{{ div }}</option>
            </select>
          </div>
        </template>
      </b-table-column>

      <template v-slot:edit="{editData, validations}">
        <div class="columns">
          <div class="column is-one-fourth">
            <BasicInputField
                v-model="editData.name"
                v-bind:validations="validations.name"
                v-bind:field-name="'Name'"
                v-bind:field-help="''"
            />
          </div>
          <div class="column is-one-fourth">
            <BasicInputField
                v-model="editData.abbreviation"
                v-bind:validations="validations.abbreviation"
                v-bind:field-name="'Abbreviation'"
                v-bind:field-help="'No more than 3 characters'"
            />
          </div>
          <div class="column is-one-fourth">
            <BasicInputField
                v-model="editData.description"
                v-bind:validations="validations.description"
                v-bind:field-name="'Description'"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-fourth">
            <BasicSelectField
                v-model="editData.category"
                v-bind:selected-id="editData.category"
                v-bind:validations="validations.category"
                v-bind:options="categories"
                v-bind:field-name="'Category'"
            />
          </div>
          <div class="column is-one-fourth">
            <BasicSelectField
                v-model="editData.geneticDiversity"
                v-bind:selected-id="editData.geneticDiversity"
                v-bind:validations="validations.geneticDiversity"
                v-bind:options="diversities"
                v-bind:field-name="'Genetic Diversity'"
            />
          </div>
        </div>
      </template>

      <template v-slot:emptyMessage>
        <p class="has-text-weight-bold">
          No breeding methods exist
        </p>
      </template>
    </ExpandableTable>
    <GenericModal
        v-bind:active.sync="showEnableSystemMethods"
        v-bind:msg-title="'Enable/Disable Predefined Breeding Methods'"
        v-on:deactivate="showEnableSystemMethods = false"
        v-bind:modalClass="'enable-system-methods'"
    >
      <div v-if="inUseBreedingMethods.length > 0">
        <article class="message is-warning">
          <div class="message-body">
            <div class="columns is-vcentered">
              <div class="column">
                <div class="has-text-dark">
                  <AlertTriangleIcon
                      size="1x"
                      class="has-vertical-align-middle"
                  /> Some breeding methods cannot be deactivated because there are germplasm records using those methods in {{activeProgram.name}}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
      <ExpandableTable
          v-bind:records.sync="systemBreedingMethods"
          v-bind:pagination="systemPaginationController"
          v-bind:default-sort="['data.name', 'asc']"
          v-bind:debounce-search="400"
          :checked-rows.sync="programEnabledSystemMethods"
          :custom-is-checked="shouldCheck"
          checkable
          :checkbox-position="'left'"
          :checkbox-type="'is-primary'"
          :is-row-checkable="row => !isMethodInUse(row.data)"
      >
        <b-table-column field="data.name" label="Name" sortable searchable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
          {{ props.row.data.name}}
        </b-table-column>
        <b-table-column field="data.abbreviation" label="Abbreviation" sortable searchable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
          {{ props.row.data.abbreviation}}
        </b-table-column>
        <b-table-column field="data.description" label="Description" sortable searchable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
          {{ props.row.data.description}}
        </b-table-column>
        <b-table-column field="data.category" label="Category" sortable searchable :th-attrs="(column) => ({scope:'col'})">
          <template v-slot="props">
            {{ props.row.data.category}}
          </template>
          <template v-slot:searchable="props">
            <div class="select">
              <select
                  v-model="props.filters[props.column.field]"
              >
                <option value=""></option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
          </template>
        </b-table-column>
        <b-table-column field="data.geneticDiversity" label="Genetic Diversity" sortable searchable :th-attrs="(column) => ({scope:'col'})">
          <template v-slot="props">
            {{ props.row.data.geneticDiversity}}
          </template>
          <template v-slot:searchable="props">
            <div class="select">
              <select
                  v-model="props.filters[props.column.field]"
              >
                <option value=""></option>
                <option v-for="div in diversities" :key="div" :value="div">{{ div }}</option>
              </select>
            </div>
          </template>
        </b-table-column>

        <template v-slot:emptyMessage>
          <p class="has-text-weight-bold">
            No breeding methods exist
          </p>
        </template>
      </ExpandableTable>

      <template v-slot:footer>
        <button class="button is-success" :class="{'is-loading': savingSystemMethods}" v-on:click="saveEnabledMethods">Save changes</button>
        <button class="button" v-on:click="showEnableSystemMethods = false">Cancel</button>
      </template>
    </GenericModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
import { Program } from '@/breeding-insight/model/Program';
import { BreedingMethod } from '@/breeding-insight/model/BreedingMethod';
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import { BreedingMethodService } from '@/breeding-insight/service/BreedingMethodService';
import GenericModal from "@/components/modals/GenericModal.vue";
import { mapGetters } from 'vuex';
import { TableRow } from '@/breeding-insight/model/view_models/TableRow';
import { maxLength, required } from 'vuelidate/lib/validators';
import { DataFormEventBusHandler } from '@/components/forms/DataFormEventBusHandler';
import { DEACTIVATE_ALL_NOTIFICATIONS } from '@/store/mutation-types';
import NewDataForm from '@/components/forms/NewDataForm.vue';
import BasicInputField from "@/components/forms/BasicInputField.vue";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";
import { AlertTriangleIcon } from 'vue-feather-icons';
import WarningModal from '@/components/modals/WarningModal.vue'

@Component({
  components: {
    ExpandableTable, GenericModal, NewDataForm, BasicInputField, BasicSelectField, AlertTriangleIcon, WarningModal
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class BreedingMethods extends ProgramsBase {
  private activeProgram?: Program;
  private programBreedingMethods: BreedingMethod[] = [];
  private systemBreedingMethods: BreedingMethod[] = [];
  private inUseBreedingMethods: Array<string> = [];
  private paginationController: PaginationController = new PaginationController();
  private systemPaginationController: PaginationController = new PaginationController();
  private loading = true;
  private showEnableSystemMethods = false;
  private savingSystemMethods = false;
  private programEnabledSystemMethods: TableRow<BreedingMethod>[] = [];
  private newMethodActive = false;
  private newMethod = new BreedingMethod({});
  private newMethodFormState: DataFormEventBusHandler = new DataFormEventBusHandler();
  private editMethodFormState: DataFormEventBusHandler = new DataFormEventBusHandler();
  private deleteActive: boolean = false;
  private deleteBreedingMethod = new BreedingMethod({});

  private categories: Array<string> = ["Acquisition", "Asexual", "Cross", "GM", "Increase", "Inventory", "OP", "Ploidy", "Selection", "Unknown"];

  private diversities: Array<string> = ["Generative (+)", "Derivative (-)", "Maintenance (0)"]

  newMethodValidations = {
    name: {required},
    abbreviation: {required, maxLength: maxLength(3)},
    description: {required},
    category: {required},
    geneticDiversity: {required}
  }

  mounted() {
    this.getBreedingMethods();
  }

  async getBreedingMethods() {
    try {
      this.programBreedingMethods = await BreedingMethodService.getProgramBreedingMethods(this.activeProgram!.id!);
      this.paginationController.totalCount = this.programBreedingMethods.length;
      this.paginationController.currentPage = 1;
      this.paginationController.totalPages = this.paginationController.totalCount.valueOf() / this.paginationController.pageSize.valueOf();

      this.systemBreedingMethods = await BreedingMethodService.getSystemBreedingMethods();
      this.systemPaginationController.totalCount = this.systemBreedingMethods.length;
      this.systemPaginationController.pageSize = this.systemBreedingMethods.length;
      this.systemPaginationController.currentPage = 1;
      this.systemPaginationController.totalPages = 1;
      this.systemPaginationController.showAll = true;

      const inUseMethods: BreedingMethod[] = await BreedingMethodService.getProgramBreedingMethods(this.activeProgram!.id!, true);
      this.inUseBreedingMethods = inUseMethods.map((value: BreedingMethod) => value.id!);
    } catch(e) {
      console.log(e);
      this.$emit('show-error-notification', 'Error while trying to fetch breeding methods');
    } finally {
      this.loading = false;
    }
  }

  formatOwner(programId?:string) {
    if(programId === undefined) {
      return "SYSTEM";
    }
    return "PROGRAM";
  }

  progressTagType(programId?:string) {
    if(programId === undefined) {
      return "is-success";
    }
    return "is-warning";
  }

  openModal() {
    this.programEnabledSystemMethods = [];
    this.programBreedingMethods.forEach((value: BreedingMethod) => {
      if(value.programId === undefined) {
        var method = new BreedingMethod(value);
        this.programEnabledSystemMethods.push(new TableRow(true, false, method));
      }
    });

    this.showEnableSystemMethods = true;
  }

  shouldCheck(a: TableRow<BreedingMethod>, b: TableRow<BreedingMethod>){
    return a.data.id === b.data.id;
  }

  async saveEnabledMethods() {
    try {
      this.savingSystemMethods = true;
      await BreedingMethodService.enableSystemMethods(this.activeProgram!.id!, this.programEnabledSystemMethods.map(value => value.data));
      this.showEnableSystemMethods = false;
      this.$emit('show-success-notification', 'System breeding method enabled');
      this.getBreedingMethods();
    } catch (e) {
      this.$emit('show-error-notification', 'Error while trying to enable system breeding methods');
    } finally {
      this.savingSystemMethods = false;
    }
  }

  async saveMethod() {
    try {
      await BreedingMethodService.createProgramBreedingMethod(this.activeProgram!.id!, this.newMethod);
      this.newMethodActive = false;
      this.getBreedingMethods();
      this.$emit('show-success-notification', 'Breeding method created successfully');
    } catch (e) {
      this.$emit('show-error-notification', 'Error while trying to create breeding method');
    } finally {
      this.newMethodFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
    }
  }

  cancelNewMethod() {
    this.newMethodActive = false;
  }

  showNewMethod() {
    this.newMethod = new BreedingMethod({});
    this.newMethodActive = true;
    this.$store.commit(DEACTIVATE_ALL_NOTIFICATIONS);
  }

  async updateMethod(updatedMethod: BreedingMethod) {
    try {
      await BreedingMethodService.updateProgramBreedingMethod(this.activeProgram!.id!, updatedMethod);
      this.getBreedingMethods();
      this.$emit('show-success-notification', 'Breeding method updated successfully');
    } catch (e) {
      this.$emit('show-error-notification', 'Error while trying to update breeding method');
    } finally {
      this.editMethodFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT)
    }
  }

  isRowEditable(row: TableRow<BreedingMethod>) {
    return row.data.programId !== undefined;
  }

  isRowArchivable(row: TableRow<BreedingMethod>) {
    return row.data.programId !== undefined && !this.isMethodInUse(row.data);
  }

  isMethodInUse(method: BreedingMethod) {
    if(this.inUseBreedingMethods) {
      return this.inUseBreedingMethods.includes(method.id!);
    }
    return false;
  }

  filterByScope(row: TableRow<BreedingMethod>, input: string) {
    if(input === 'SYSTEM') {
      return row.data.programId === undefined;
    } else if(input === 'PROGRAM') {
      return row.data.programId !== undefined;
    } else {
      return true;
    }
  }

  displayWarning(method: BreedingMethod) {

    if (method){
      this.deleteBreedingMethod = method;
      this.deleteActive = true;
    } else {
      Vue.$log.error('Could not find object to delete')
    }
  }

  modalDeleteHandler() {
    this.deleteActive = false;

    if (this.deleteBreedingMethod && this.deleteBreedingMethod.id && this.deleteBreedingMethod.name) {
      const deleteId: string = this.deleteBreedingMethod.id;
      const deleteName: string = this.deleteBreedingMethod.name;
      BreedingMethodService.delete(this.activeProgram!.id!, deleteId).then(() => {
        this.getBreedingMethods();
        this.$emit('show-success-notification', `${deleteName} removed`);
      }).catch(() => {
        this.$emit('show-error-notification', `Unable to remove breeding method: ${deleteName}.`);
      });
      return;
    }

    this.$emit('show-error-notification', `Unable to remove breeding method`);

  }

  cancelDelete() {
    this.deleteActive = false;
    this.deleteBreedingMethod = new BreedingMethod({});
  }

}
</script>