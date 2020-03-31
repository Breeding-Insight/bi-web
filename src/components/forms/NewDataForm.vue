<template>
  <form
      class="new-form"
      novalidate="true"
  >
    <slot v-bind="getValidation()"></slot>
    <div class="columns">
      <div class="column is-whole has-text-centered buttons">
        <button type="button" class="button is-primary" @click="checkSubmit()">
          <span class="icon is-small">
            <CheckCircleIcon size="1.5x" aria-hidden="true"></CheckCircleIcon>
            <span class="is-sr-only">Confirm Edits</span>
          </span>
          <span>
            Save
          </span>
        </button>
        <button type="button" class="button" @click="checkCancel()">Cancel</button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import { CheckCircleIcon } from 'vue-feather-icons';
  import {Validations} from "vuelidate-property-decorators";

  @Component({
      components: {CheckCircleIcon}
    }
  )
  export default class NewDataForm extends Vue {
    @Prop()
    rowValidations!: Object;
    @Prop()
    newRecord!: Object;

    @Validations()
    validations() {
      if (this.rowValidations) {
        return {
          newRecord: {
            ...this.rowValidations
          }
        }
      }

      return {}
    }

    getValidation(){
      return this.$v.newRecord;
    }

    checkSubmit() {
      this.$v.newRecord.$touch();
      if (this.$v.newRecord.$anyError){

        this.$emit('show-error-notification', 'Fix Invalid Fields');
        return;
      } else {

        this.$emit('submit');
        this.$v.newRecord.$reset();
      }
    }

    checkCancel() {
      this.$v.newRecord.$reset();
      this.$emit('cancel');
    }

  }

</script>