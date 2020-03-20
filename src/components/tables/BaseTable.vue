<template>
  <table class="table is-striped is-narrow is-hoverable is-fullwidth">
    <thead>
      <tr>
        <th>
          Name
        </th>
        <th>
          Species
        </th>
        <th>
          # Users
        </th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(row, index) in tableRows">
        <BaseTableRow
          v-bind:key="'row' + index"
          v-bind:row-data="row"
          @edit="row.toggleEdit()"
          @cancel="$log.error('row delete')"
        >
          <slot
            v-bind:data="row.data"
            name="columns"
          />
        </BaseTableRow>
        <template v-if="row.edit">
          <tr
            v-bind:key="'edit' + index"
            v-bind:class="{'is-selected': (row.edit == true), 'is-new': (row.new == true)}"
          >
            <td colspan="4">
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
  import {Program} from "@/model/Program";

  @Component({
    components: { BaseTableRow, EditDataRowForm }
  })
  export default class BaseTable extends Vue {
    //<slot name="table-row" v-bind:row-data="program"></slot>
    // Knows all of the data
    @Prop()
    records!: Array<any>;
    @Prop()
    rowValidations!: Object;
    @Prop()
    editable!: boolean;

    private tableRows: Array<TableRow<any>> = new Array<TableRow<any>>();

    @Watch('records', {immediate: true, deep:true})
    updateTableRows() {
      const rowArray = new Array<TableRow<any>>();
      for (const record of this.records){
        rowArray.push(new TableRow<any>(this.editable, record));
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

    rowExists(record: Object) {
      console.log(this.tableRows.find(row => row === record));
      return this.tableRows.find(row => row === record);
    }

    getValidations(index: number) {
      return this.$v.tableRows.$each[index];
    }

    validateAndSubmit(rowIndex: number) {

      this.$v.tableRows.$each[rowIndex].editData.$touch();
      if (this.$v.tableRows.$each[rowIndex].editData.$anyError){
        //TODO: Send this to the front
        //this.$emit('show-error-notification', 'Fix Invalid Fields');
        return;
      }
      else {
        // Check all of our fields to see if they were required
        this.$v.tableRows.$each[rowIndex].editData.$reset();
        const editedRecord = this.tableRows[rowIndex].editData;
        //this.resetAllRowStates();
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