<template>
  <table class="table is-striped is-narrow is-hoverable is-fullwidth">
    <thead>
      <tr>
        <template v-for="(header, index) in headers">
          <th v-bind:key="'header' + index">{{header}}</th>
        </template>
        <template v-if="editable">
          <th></th>
        </template>
      </tr>
    </thead>
    <tbody>
      <template v-for="(row, index) in tableRows">
        <BaseTableRow
          v-bind:key="'row' + index"
          v-bind:row-data="row"
          v-on:edit="row.toggleEdit()"
          v-on:remove="$emit('remove', row.data)"
        >
          <slot
            v-bind="row.data"
            name="columns"
          />
        </BaseTableRow>
        <template v-if="row.edit">
          <tr
            v-bind:key="'edit' + index"
            v-bind:class="{'is-selected': (row.edit == true), 'is-new': (row.new == true)}"
          >
            <td v-bind:colspan="columnSpan">
              <EditDataRowForm
                @submit="validateAndSubmit(index)"
                @cancel="cancelEdit(row, index)"
              >
                <slot
                  v-bind:editData="row.editData"
                  v-bind:validation="getValidations(index)"
                  name="edit" />
              </EditDataRowForm>
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import BaseTableRow from "@/components/tables/BaseTableRow.vue"
  import {TableRow} from "@/model/view_models/TableRow"
  import EditDataRowForm from '@/components/forms/EditDataRowForm.vue'
  import {Validations} from "vuelidate-property-decorators";

  @Component({
    components: { BaseTableRow, EditDataRowForm }
  })
  export default class BaseTable extends Vue {
    //<slot name="table-row" v-bind:row-data="program"></slot>
    // Knows all of the data
    @Prop()
    headers!: string;
    @Prop()
    records!: Array<any>;
    @Prop()
    rowValidations!: Object;
    @Prop()
    editable!: boolean;
    @Prop()
    newRecord!: any;

    private tableRows: Array<TableRow<any>> = new Array<TableRow<any>>();
    private finishedInitialPopulate: boolean = false;

    @Watch('records', {immediate: true, deep:true})
    updateTableRows() {
      const rowArray = new Array<TableRow<any>>();
      for (const record of this.records){
        const newTableRow = new TableRow<any>(this.editable, record);

        if (this.newRecord){
          if (record.id === this.newRecord.id){
            newTableRow.toggleNew();
          }
        }
        rowArray.push(newTableRow);

      }
      this.tableRows = rowArray;
    }

    @Validations()
    validations() {
      if (this.rowValidations) {
        return {
          tableRows: {
            $each: {
              editData: {
                ...this.rowValidations
              }
            }
          }
        }
      }

      return {}
    }

    updated() {
      this.finishedInitialPopulate = true;
    }

    get columnSpan() {
      return this.editable ? this.headers.length + 1 : this.headers.length;
    }

    rowExists(record: any) {
      return this.tableRows.find(row => row.data.id === record.id) != undefined;
    }

    getValidations(index: number) {
      return this.$v.tableRows.$each[index];
    }

    validateAndSubmit(rowIndex: number) {

      this.$v.tableRows.$each[rowIndex].editData.$touch();
      if (this.$v.tableRows.$each[rowIndex].editData.$anyError){
        this.$emit('show-error-notification', 'Fix Invalid Fields');
        return;
      }
      else {
        // Check all of our fields to see if they were required
        this.$v.tableRows.$each[rowIndex].editData.$reset();
        const editedRecord = this.tableRows[rowIndex].editData;
        this.$emit('submit', editedRecord);
      }
    }

    cancelEdit(record: TableRow<any>, rowIndex: number) {
      record.toggleEdit();
      record.revertChanges();
      // clear form
      this.$v.tableRows.$each[rowIndex].editData.$reset();
    }

    resetAllRowStates() {

      for (const record of this.tableRows){
        record.clearNewState();
      }
    }

  }
</script>