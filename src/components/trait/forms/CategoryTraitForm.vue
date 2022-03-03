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
  <div>
    <WarningModal
        v-bind:active.sync="deleteModalActive"
        v-bind:msg-title="deleteWarningTitle"
        v-on:deactivate="deleteModalActive = false"
    >
      <section>
        <p class="has-text-dark" :class="this.$modalTextClass">
          Please confirm that you would like to remove this category.
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button
              class="button is-danger"
              type="button"
              v-on:click="removeRow()"
          >
            <strong>Yes, remove</strong>
          </button>
          <button
              class="button"
              type="button"
              v-on:click="cancelRemoveRow()"
          >
            Cancel
          </button>
        </div>
      </div>
    </WarningModal>

    <template v-if="Scale.dataTypeEquals(type, DataType.Ordinal)">
      <template v-for="[i, item] of data.entries()">
        <LabelValueRow
          v-bind:label="item.label"
          v-bind:value="item.value"
          v-on:delete="checkRemoveRow(i)"
          v-on:value-change="item.value = $event"
          v-on:label-change="item.label = $event"
          v-bind:key="i"
          v-bind:can-be-removed="i > 1"
          v-bind:server-row-validation="getCategoryErrors(i)"
        />
      </template>
    </template>
    <template v-if="Scale.dataTypeEquals(type, DataType.Nominal)">
      <template v-for="[i, item] of data.entries()">
        <ValueRow
            v-bind:value="item.value"
            v-on:delete="checkRemoveRow(i)"
            v-on:value-change="item.value = $event"
            v-bind:value-placeholder="nominalPlaceholders[i]"
            v-bind:key="i"
            v-bind:can-be-removed="i > 0"
            v-bind:server-row-validation="getCategoryErrors(i)"
        />
      </template>
    </template>
    <button data-testid="new" type="button" class="button" @click="addRow()">
          <span class="icon is-small">
            <PlusCircleIcon
                size="1.5x"
                aria-hidden="true"
            />
            <span class="is-sr-only">Add item</span>
          </span>
      <span>
        Add Item
      </span>
    </button>
  </div>
</template>

<script lang="ts">

import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import {Category} from "@/breeding-insight/model/Category";
import LabelValueRow from "@/components/trait/forms/LabelValueRow.vue";
import BasicInputField from "@/components/forms/BasicInputField.vue";
import WarningModal from "@/components/modals/WarningModal.vue";
import {PlusCircleIcon} from "vue-feather-icons";
import {DataType, Scale} from "@/breeding-insight/model/Scale";
import ValueRow from "@/components/trait/forms/ValueRow.vue";
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
import {TraitError} from "@/breeding-insight/model/errors/TraitError";
import {FieldError} from "@/breeding-insight/model/errors/FieldError";
import {RowError} from "@/breeding-insight/model/errors/RowError";

@Component({
  components: {ValueRow, BasicInputField, LabelValueRow, WarningModal, PlusCircleIcon},
  data: () => ({DataType, TraitError, Scale}),
  computed: {
    categoryVals: function () {
      //return this.data;
    }
  }
})
export default class CategoryTraitForm extends Vue {

  @Prop({default: () => []})
  private data!: Category[];
  @Prop({default: true})
  private new!: boolean;
  @Prop()
  private type!: DataType;
  @Prop()
  private validationHandler!: ValidationError;
  @Prop()
  private validationIndex!: number;

  private nominalPlaceholders = ['Category', 'Category', 'Category', 'Category', 'Category'];
  private deleteWarningTitle: string = "Remove category?"
  private activeRemoveRowIndex?: number;
  private deleteModalActive: boolean = false;

  @Watch('data', {immediate: true, deep: true})
  todo() {
    //it doesn't get here on first try why
    console.log("here is a watch");
  }

  @Watch('type', {immediate: true})
  updateCategories() {
    let newCategories = this.data;

    console.log('updatecat old');
    console.log(this.data.length);

    this.$emit('update-data', newCategories);
    console.log("post emit");
    console.log(this.data.length);

    //todo might not be needed anymore?
  }

  getCategoryErrors(categoryIndex: number): RowError | undefined {
    if (this.validationHandler) {
      const fieldErrors: FieldError[] = this.validationHandler.getValidation(this.validationIndex, TraitError.ScaleCategories);
      if (fieldErrors.length > 0) {
        for (const [index, fieldError] of fieldErrors.entries()) {
          // Check that it has nested errors for the categories
          if (fieldError.rowErrors){
            // Get the specific category index requested
            const rowError: RowError[] = fieldError.rowErrors.filter(rowError => rowError.rowIndex === categoryIndex);
            if (rowError && rowError.length > 0) {
              return rowError[0];
            }
          }
        }
      }
    }
  }

  checkRemoveRow(index: number) {
    this.activeRemoveRowIndex = index;

    const rowToDelete: Category = this.data[index];
    if (rowToDelete && ((rowToDelete.label && rowToDelete.label!.trim() !== '') ||
      (rowToDelete.value && rowToDelete.value!.trim() !== '')))
    {
      this.deleteModalActive = true;
    } else {
      this.removeRow();
    }
  }

  cancelRemoveRow() {
    this.deleteModalActive = false;
    this.activeRemoveRowIndex = undefined;
    return;
  }

  removeRow() {
    let newCategories = this.data;
    if ((this.type === DataType.Ordinal && this.data.length > 2) ||
        (this.type === DataType.Nominal && this.data.length > 1) ||
        (this.type !== DataType.Ordinal && this.type !== DataType.Nominal)) {
      newCategories.splice(this.activeRemoveRowIndex!,1);
      this.activeRemoveRowIndex = undefined;
      this.deleteModalActive = false;
      return;
    }
    this.activeRemoveRowIndex = undefined;
    this.deleteModalActive = false;

    this.$emit('update-data', newCategories);
    return;
  }

  addRow() {
    let newCategories = this.data;
    newCategories.push(new Category());
    console.log("add");
    this.$emit('update-data', newCategories);
  }
}
</script>