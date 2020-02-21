<template>
  <span
      class="form-error has-text-danger"
      :class="{ 'is-hidden': hiddenIndication }"
  >
    <slot></slot>
  </span>
</template>


<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class InputError extends Vue {
    @Prop()
    hiddenIndication!: boolean;
  }

</script>