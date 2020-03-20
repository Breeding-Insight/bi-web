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
      <template v-for="(row, index) in records">
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

  import { Component, Prop, Vue } from 'vue-property-decorator'
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
    records!: Array<TableRow<any>>;
    @Prop()
    rowValidations!: Object;

    @Validations()
    validations() {
      if (this.rowValidations) {
        return {
          records: {
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

    getValidations(index: number) {
      return this.$v.records.$each[index];
    }

    validateAndSubmit(rowIndex: number) {

      this.$v.records.$each[rowIndex].editData.$touch();
      if (this.$v.records.$each[rowIndex].editData.$anyError){
        //TODO: Send this to the front
        //this.$emit('show-error-notification', 'Fix Invalid Fields');
        return;
      }
      else {
        // Check all of our fields to see if they were required
        this.$v.records.$each[rowIndex].editData.$reset();
        this.$emit('submit', rowIndex);
      }
    }

    cancelEdit(record: TableRow<any>, rowIndex: number) {
      record.toggleEdit();
      record.revertChanges();
      // clear form
      this.$v.records.$each[rowIndex].editData.$reset();
    }
  }
</script>