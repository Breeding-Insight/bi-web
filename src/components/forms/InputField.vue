<template>
  <div class="field" :class="{ 'field--error': fieldError }">
    <label class="label">
      <slot name="label"></slot>
    </label>
    <div class="control">
      <input
          :value="value"
          @input="$emit('input', $event.target.value)"
          class="input"
          type="text"
          placeholder="New Name Here"
      >
      <slot name="errors"></slot>
      <p class="help">
        <slot name="help"></slot>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class InputField extends Vue {
    @Prop()
    value!: any;
    @Prop()
    fieldError!: boolean;
  }

</script>