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
        <th>
          Test
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(row, index) in data">
        <BaseTableRow
          v-bind:key="'row' + index"
          v-bind:row-data="row"
          @edit="row.toggleEdit()"
          @cancel="$log.error('row delete')"
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
            <td colspan="4">
              <EditDataRowForm
                @submit="this.$emit('submit')"
                @cancel="this.$emit('cancel')"
              >
                <slot name="editForm" />
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

  @Component({
    components: { BaseTableRow, EditDataRowForm }
  })
  export default class BaseTable extends Vue {
    //<slot name="table-row" v-bind:row-data="program"></slot>
    // Knows all of the data
    @Prop()
    data!: Array<TableRow<any>>;
  }
</script>