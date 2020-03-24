<template>
  <BaseFieldWrapper
    v-bind:validations="validations"
    v-bind:field-help="fieldHelp"
    v-bind:field-name="fieldName"
  >
    <input
        :value="value"
        @input="$emit('input', $event.target.value)"
        class="input"
        :type="fieldTypeComputed"
        v-bind:placeholder="fieldName"
    />
  </BaseFieldWrapper>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import BaseFieldWrapper from "@/components/forms/BaseFieldWrapper.vue";

  @Component({
    components: {BaseFieldWrapper}
  })
  export default class BasicInputField extends Vue {
    @Prop()
    value!: any;
    @Prop()
    fieldType!: string;
    @Prop()
    fieldName!: string;
    @Prop()
    fieldHelp!: string;
    @Prop()
    validations!: any;

    get fieldTypeComputed() {
      return this.fieldType ? this.fieldType : 'text';
    }
  }

</script>