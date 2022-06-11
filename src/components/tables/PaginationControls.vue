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
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import {Pagination} from "@/breeding-insight/model/BiResponse";

  @Component({
    components: {
    },
    computed: {
      displayPageSize: {
        get() {
          return this.showAllState ? -1 : this.pagination.pageSize;
        }
      }
    }
  })
  export default class PaginationControls extends Vue {

    @Prop()
    private pagination!: Pagination;

    private showAllState = false;

    toggleShowAll() {
      this.showAllState = !this.showAllState;
      this.$emit('paginate-toggle-all');
    }

    changePageSize($event:any) {
      this.pagination.pageSize = $event.target.value;
      this.$emit('paginate-page-size', $event.target.value)
      this.showAllState = false;
    }

  }
</script>