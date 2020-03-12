<template>
  <form
      class="edit-form"
      novalidate="true"
  >
    <slot></slot>
    <div class="columns">
      <div class="column is-whole has-text-centered buttons">
        <button type="button" class="button is-primary" @click="$emit('submit')">
                    <span class="icon is-small">
                      <CheckCircleIcon size="1.5x" aria-hidden="true"></CheckCircleIcon>
                      <span class="is-sr-only">Confirm Edits</span>
                    </span>
          <span>
                      Save
                    </span>
        </button>
        <button type="button" class="button" @click="$emit('cancel')">Cancel</button>

      </div>
    </div>
  </form>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import { CheckCircleIcon } from 'vue-feather-icons';

  @Component({
      components: {CheckCircleIcon}
    }
  )
  export default class EditDataRowForm extends Vue {
  }

</script>