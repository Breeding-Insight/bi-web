<template>
  <div>
    <!-- Error messages -->
    <div v-if="formattedErrors.length > 0" class="has-text-danger mb-6">

      <!-- Multiple errors list -->
      <template v-if="isValidationError">
        <AlertTriangleIcon size="1x" aria-hidden="true" class="has-vertical-align-middle"></AlertTriangleIcon>
        <span class="has-text-weight-bold ml-1">File contains data errors</span>

        <ExpandableTable
            v-bind:records.sync="formattedErrors"
            v-bind:loading="this.errorsLoading"
            v-bind:pagination="paginationController"
            v-bind:rowClasses="formattedErrors"
        >
          <b-table-column field="data.row" label="Row"  sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.row }}
          </b-table-column>
          <b-table-column field="data.field" label="Field"  sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.field }}
          </b-table-column>
          <b-table-column field="data.message" label="Error" sortable v-slot="props" :th-attrs="(column) => ({scope:'col'})">
            {{ props.row.data.message }}
          </b-table-column>
        </ExpandableTable>

      </template>

      <!-- Single Error -->
      <template v-else>
        <AlertTriangleIcon size="1x" aria-hidden="true" class="has-vertical-align-middle"></AlertTriangleIcon>
        <span class="has-text-weight-bold ml-1">{{formattedErrors[0].message}}</span>
      </template>

    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import { AlertTriangleIcon } from 'vue-feather-icons';
import { ImportError } from '@/breeding-insight/model/errors/ImportError';
import {Pagination} from "@/breeding-insight/model/BiResponse";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import ExpandableTable from "@/components/tables/expandableTable/ExpandableTable.vue";
import {mapGetters} from "vuex";


@Component({
  components: {AlertTriangleIcon, ExpandableTable},
})
export default class MultipleErrors extends Vue {
  @Prop({default: () => []})
  private formattedErrors!: ImportError[];
  @Prop({default: () => false})
  private isValidationError!: boolean;
  @Prop({default: () => 10})
  private numDisplayedErrors!: number;
  @Prop( {default: () => "dave"})
  private fileName!:string;

  private paginationController: PaginationController = new PaginationController();
  private errorsLoading: Boolean = false;

  mounted() {
    this.setPagination();
  }

  setPagination() {
    if (this.formattedErrors) {
        this.paginationController.totalCount = this.formattedErrors.length;
        this.paginationController.pageSize = this.formattedErrors.length; //todo until showAll fixed in another card, just display all errors
        this.paginationController.currentPage = 1;
        this.paginationController.totalPages = this.paginationController.totalCount.valueOf() / this.paginationController.pageSize.valueOf();
      }
  }

}

</script>
