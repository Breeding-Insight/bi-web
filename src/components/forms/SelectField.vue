<template>
  <div class="field" :class="{ 'field--error': fieldError }">
    <label class="label">
      <slot name="label"></slot>
    </label>
    <div class="control is-expanded">
      <div class="select is-fullwidth">
        <select 
          v-on:input="$emit('input', $event.target.value)"
        >
          <option disabled selected value="">{{placeholder}}</option>
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
      <slot name="errors"></slot>
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
    //@PropSync('options')
    @Prop()
    value!: string;
    @Prop()
    selectedId!: string;
    @Prop()
    options!: any;
    @Prop()
    fieldError!: boolean;
    @Prop()
    fieldType!: string;
    @Prop()
    placeholder!: string;

  }

</script>