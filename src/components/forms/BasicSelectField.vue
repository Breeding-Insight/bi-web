<template>
  <BaseFieldWrapper
      v-bind:validations="validations"
      v-bind:field-help="fieldHelp"
      v-bind:field-name="fieldName"
  >
    <div class="select is-fullwidth">
      <select
          v-on:input="$emit('input', $event.target.value)"
          class="select is-fullwidth"
      >
        <option disabled v-bind:selected="displayDefault()" value="">Select a {{fieldName.toLowerCase()}}</option>
        <template v-if="emptyValueName">
          <option v-bind:value="undefined" v-bind:selected="selectedId === undefined">
            {{emptyValueName}}
          </option>
        </template>
        <option
            v-for="option in options"
            v-bind:key="option.id"
            v-bind:selected="option.id === selectedId"
            v-bind:value="option.id"
        >
          {{ option.name }}
        </option>
      </select>
    </div>
  </BaseFieldWrapper>

</template>

<script lang="ts">
  import { Component, Prop, PropSync, Vue } from 'vue-property-decorator';
  import BaseFieldWrapper from "@/components/forms/BaseFieldWrapper.vue";
  @Component({
    components: {BaseFieldWrapper}
  })
  export default class BasicSelectField extends Vue {
    @Prop()
    selectedId!: string;
    @Prop()
    options!: any;
    @Prop()
    fieldName!: string;
    @Prop()
    fieldHelp!: string;
    @Prop()
    validations!: any;
    @Prop()
    emptyValueName!: string;


    displayDefault() {
      return this.selectedId === null || this.selectedId === undefined;
    }
  }

</script>