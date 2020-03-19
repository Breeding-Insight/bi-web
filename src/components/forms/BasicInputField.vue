<template>
  <div class="field" v-bind:class="{ 'field--error': fieldError }">
    <label class="label">
      {{fieldName}}
    </label>
    <div class="control">
      <input
          :value="value"
          @input="$emit('input', $event.target.value)"
          class="input"
          :type="fieldTypeComputed()"
          v-bind:placeholder="fieldName"
      >
      <span
          class="form-error has-text-danger"
          :class="{ 'is-hidden': !fieldError }"
      >
        {{fieldName}} is required
      </span>
      <p class="help" v-if="fieldHelp != null">
        {{fieldHelp}}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class BasicInputField extends Vue {
    @Prop()
    value!: any;
    @Prop()
    fieldError!: boolean;
    @Prop()
    fieldType!: string;
    @Prop()
    fieldName!: string;
    @Prop()
    fieldHelp!: string;

    fieldTypeComputed() {
      return this.fieldType ? this.fieldType : 'text';
    }
  }

</script>