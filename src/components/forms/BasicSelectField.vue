<template>
  <div class="field" :class="{ 'field--error': fieldError }">
    <label class="label">
      {{fieldName}}
    </label>
    <div class="control is-expanded">
      <div class="select is-fullwidth">
        <select
            v-on:input="$emit('input', $event.target.value)"
        >
          <option disabled v-bind:selected="displayDefault()" value="">Select a {{fieldName.toLowerCase()}}</option>
          <option
              v-for="option in options"
              v-bind:key="option.id"
              v-bind:selected="option.id == selectedId"
              v-bind:value="option.id"
          >
            {{ option.name }}
          </option>
        </select>
      </div>
      <span
          class="form-error has-text-danger"
          :class="{ 'is-hidden': !fieldError }"
      >
        {{fieldName}} is required
      </span>
      <p class="help">
        <slot name="help"></slot>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, PropSync, Vue } from 'vue-property-decorator';

  @Component
  export default class SelectField extends Vue {
    @Prop()
    selectedId!: string;
    @Prop()
    options!: any;
    @Prop()
    fieldError!: boolean;
    @Prop()
    fieldName!: string;

    displayDefault() {
      return this.selectedId === null || this.selectedId === undefined;
    }
  }

</script>