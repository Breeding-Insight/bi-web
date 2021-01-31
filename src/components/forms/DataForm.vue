<!--
  - See the NOTICE file distributed with this work for additional information
  - regarding copyright ownership.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <form
      v-bind:class="formClass"
      novalidate="true"
  >
    <slot v-bind="getValidation()"></slot>
    <div class="columns">
      <div class="column is-whole has-text-centered buttons">
        <button
            data-testid="save"
            type="button"
            class="button is-primary"
            @click="checkSubmit()"
            v-bind:disabled="dataFormState.saveStarted"
            v-bind:class="{'is-loading': dataFormState.saveStarted}"
        >
          <span class="icon is-small">
            <CheckCircleIcon size="1.5x" aria-hidden="true"></CheckCircleIcon>
            <span class="is-sr-only">Confirm Edits</span>
          </span>
          <span>
            Save
          </span>
        </button>
        <button data-testid="cancel" type="button" class="button" @click="checkCancel()">Cancel</button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { CheckCircleIcon } from 'vue-feather-icons';
import { Validations } from 'vuelidate-property-decorators';
import { DataFormEventBusHandler } from '@/components/forms/DataFormEventBusHandler';

@Component({
  components: { CheckCircleIcon }
})
export default class DataForm extends Vue {
  @Prop()
  rowValidations!: Object;
  @Prop()
  dataFormState!: DataFormEventBusHandler;

  protected record!: Object;
  protected formClass!: string;

  @Validations()
  validations () {
    if (this.rowValidations) {
      return {
        record: {
          ...this.rowValidations
        }
      };
    }

    return {};
  }

  getValidation () {
    return this.$v.record;
  }

  checkSubmit () {
    this.dataFormState.bus.$emit(DataFormEventBusHandler.SAVE_STARTED_EVENT);

    if (this.$v.record) {
      this.$v.record.$touch();
    }

    if (this.$v.record && this.$v.record.$anyError) {
      this.dataFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
      this.$emit('show-error-notification', 'Fix Invalid Fields');
      return;
    } else {
      // debouncing
      setTimeout(() => {
        this.$emit('submit');

        if (this.$v.record) {
          this.$v.record.$reset();
        }
      }, 250);
    }
  }

  checkCancel () {
    this.dataFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
    if (this.$v.record) {
      this.$v.record.$reset();
    }
    this.$emit('cancel');
  }
}

</script>