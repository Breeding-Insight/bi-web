<template>
  <b-pagination
      v-if="pagination"
      :total="pagination.totalCount"
      :current.sync="pagination.currentPage"
      range-before="1"
      range-after="1"
      order="is-centered"
      size="is-small"
      :simple="false"
      :rounded="false"
      :per-page="pagination.pageSize"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      v-on:change="$emit('paginate', $event)"
  >
    <b-pagination-button
        slot="previous"
        slot-scope="props"
        :page="props.page"
        tag="button"
    >
      Previous
    </b-pagination-button>

    <template
        slot="next"
        slot-scope="props"
    >
      <b-pagination-button
          :page="props.page"
          tag="button"
      >
        Next
      </b-pagination-button>

      <div class="pagination-extras">
        <div class="page-size-select pagination-link">
          <div class="select is-small">
            <label for="paginationSelect" class="is-sr-only">Results Per Page</label>
            <select
                id="paginationSelect"
                v-model="displayPageSize"
                v-on:change="changePageSize($event)"
            >
              <option value="10">
                10
              </option>
              <option value="20">
                20
              </option>
              <option value="50">
                50
              </option>
              <option value="100">
                100
              </option>
              <option value="200">
                200
              </option>
            </select>
          </div>
          <span>per page</span>
        </div>

        <button
            v-if="isShowAllEnabled"
            data-testid="showAll"
            role="button"
            class="pagination-link show-all-button"
            v-bind:class="{ 'has-background-info': showAllState}"
            v-on:click="toggleShowAll()"
        >
          Show All
        </button>
      </div>
    </template>
  </b-pagination>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import {Pagination} from "@/breeding-insight/model/BiResponse";

  @Component({
    components: {
    }
  })
  export default class PaginationControls extends Vue {

    @Prop()
    private pagination!: Pagination;
    @Prop({default: true})
    private isShowAllEnabled!: boolean;

    private showAllState = false;

    private displayPageSize: Number = -1;

    mounted() {
      this.displayPageSize = this.pagination.pageSize
    }

    @Watch('pagination.showAll', {immediate: true})
    onShowAllChange(newVal: boolean) {
      this.showAllState = newVal;
      this.setDisplayPageSize();
    }

    @Watch('pagination.pageSize', {immediate: true})
    onPageSizeChange(newVal: number) {
      this.setDisplayPageSize();
    }

    toggleShowAll() {
      this.showAllState = !this.showAllState;
      this.$emit('paginate-toggle-all');
      this.setDisplayPageSize();
    }

    changePageSize($event:any) {
      const pageSize = Number.parseInt($event.target.value);
      this.pagination.pageSize = pageSize;
      this.$emit('paginate-page-size', pageSize);
      this.showAllState = false;
      this.setDisplayPageSize();
    }

    setDisplayPageSize(){
      this.displayPageSize = this.showAllState ? -1 : this.pagination.pageSize;
    }

  }
</script>