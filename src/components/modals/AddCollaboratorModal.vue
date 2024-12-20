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
  <section
    v-bind:id="'addCollaboratorModal-' + uniqueId"
    v-bind:class="modalClass"
  >
    <FormModal
      v-bind:active.sync="active"
      v-bind:title="modalTitle"
      v-on:deactivate="closeAddCollaboratorModal"
    >
      <template #form>
        <slot name="form" />
      </template>
      <template #buttons>
        <div class="columns">
          <div class="column is-whole has-text-centered buttons">
            <button
              class="button is-primary has-text-weight-bold"
              v-on:click="invokeAddCollaborator"
            >
              <strong>Save</strong>
            </button>
            <button
              class="button"
              v-on:click="closeAddCollaboratorModal"
            >
              Cancel
            </button>
          </div>
        </div>
      </template>
    </FormModal>
  </section>
</template>


<script lang="ts">
import {Component, Vue, Prop} from "vue-property-decorator";
import {validationMixin} from "vuelidate";
import FormModal from "@/components/modals/FormModal.vue";

@Component({
  mixins: [validationMixin],
  components: {FormModal}
})
export default class AddCollaboratorModal extends Vue {

  @Prop()
  uniqueId!: string;
  @Prop()
  modalTitle?: string;
  @Prop()
  modalClass?: string;
  @Prop()
  addCollaborator!: () => Promise<boolean>;
  @Prop()
  active!: boolean;

  closeAddCollaboratorModal(){
    // Emit deactivate event, allows parent to reset form state, for example.
    this.$emit('deactivate');
  }

  async invokeAddCollaborator(){
    try {
      // Await the result of the async addCollaborator function
      const result = await this.addCollaborator();
      if (result) {
        // Emit the event after the promise is resolved
        this.$emit('add-collaborator');
        // Close and deactivate modal
        this.closeAddCollaboratorModal();
      }
    } catch (error) {
      // Handle any errors that might occur during the async operation
      console.error('Error adding collaborator:', error);
      // Optionally emit an error event or handle the error in some way
      this.$emit('show-error-notification', `Error while adding a collaborator`);
    }
  }

}
</script>