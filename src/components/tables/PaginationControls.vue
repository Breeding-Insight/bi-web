<template>
  <b-pagination
      v-if="pagination"
      :total="pagination.totalCount"
      :current="pagination.currentPage"
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
        tag="a"
    >
      Previous
    </b-pagination-button>

    <template
        slot="next"
        slot-scope="props"
    >
      <b-pagination-button
          :page="props.page"
          tag="a"
      >
        Next
      </b-pagination-button>

      <div class="pagination-extras">
        <div class="page-size-select pagination-link">
          <div class="select is-small">
            <label for="paginationSelect" class="is-sr-only">Results Per Page</label>
            <select
                id="paginationSelect"
                v-model="pagination.pageSize"
                v-on:change="$emit('paginate-page-size', $event.target.value)"
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

        <a
            data-testid="showAll"
            role="button"
            class="pagination-link show-all-button"
            v-bind:class="{ 'has-background-info': pagination.totalPages === 1}"
            v-on:click="$emit('paginate-toggle-all')"
        >
          Show All
        </a>
      </div>
    </template>
  </b-pagination>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import {Pagination} from "@/breeding-insight/model/BiResponse";

  @Component({
    components: {
    }
  })
  export default class PaginationControls extends Vue {

    @Prop()
    private pagination!: Pagination;

  }
</script>