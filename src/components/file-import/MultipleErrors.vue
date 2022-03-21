<template>
  <div>
    <!-- Error messages -->
    <div v-if="formattedErrors.length > 0" class="has-text-danger mb-6">

      <!-- Multiple errors list -->
      <template v-if="isValidationError">
        <AlertTriangleIcon size="1x" aria-hidden="true" class="has-vertical-align-middle"></AlertTriangleIcon>
        <span class="has-text-weight-bold ml-1">File contains data errors</span>
        <ul>
          <template v-if="displayAllErrors">
            <li v-for="(errorMessage, rowIndex) of formattedErrors" v-bind:key="rowIndex">{{errorMessage}}</li>
          </template>
          <template v-else>
            <li v-for="(errorMessage, rowIndex) of formattedErrors.slice(0, numDisplayedErrors)" v-bind:key="rowIndex">{{errorMessage}}</li>
          </template>
        </ul>
        <div v-if="formattedErrors.length > this.numDisplayedErrors">
          <template v-if="displayAllErrors">
            <a href="#" v-on:click="displayAllErrors = false" class="is-underlined">
              &lt; Show Less Errors
            </a>
          </template>
          <template v-else>
            <span>... and {{formattedErrors.length - numDisplayedErrors}} more.</span>
            <a href="#" v-on:click="displayAllErrors = true" class="is-underlined ml-3">
              View All Errors &gt;
            </a>
          </template>
        </div>
      </template>

      <!-- Single Error -->
      <template v-else>
        <AlertTriangleIcon size="1x" aria-hidden="true" class="has-vertical-align-middle"></AlertTriangleIcon>
        <span class="has-text-weight-bold ml-1">{{formattedErrors[0]}}</span>
      </template>

    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import { AlertTriangleIcon } from 'vue-feather-icons';

@Component({
  components: {AlertTriangleIcon}
})
export default class MultipleErrors extends Vue {
  @Prop({default: () => []})
  private formattedErrors!: string[];
  @Prop({default: () => false})
  private isValidationError!: boolean;
  @Prop({default: () => 10})
  private numDisplayedErrors!: number;

  private displayAllErrors = false;
}

</script>
