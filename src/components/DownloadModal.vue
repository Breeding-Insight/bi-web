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
    v-bind:id="'downloadModal-' + uniqueId"
    v-bind:class="modalClass"
  >
    <FormModal
      v-bind:active.sync="active"
      v-bind:title="modalTitle"
      v-on:deactivate="closeDownloadModal"
    >
      <template #form>
        <slot name="form" />
      </template>
      <template #buttons>
        <div class="columns">
          <div class="column is-whole has-text-centered buttons">
            <button
              class="button is-primary has-text-weight-bold"
              v-on:click="invokeDownload"
            >
              <strong>Download</strong>
            </button>
            <button
              class="button"
              v-on:click="closeDownloadModal"
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
export default class DownloadModal extends Vue {

  @Prop()
  uniqueId!: string;
  @Prop()
  modalTitle?: string;
  @Prop()
  modalClass?: string;
  @Prop()
  download!: () => boolean;
  @Prop()
  active!: boolean;

  closeDownloadModal(){
    // Emit deactivate event, allows parent to reset form state, for example.
    this.$emit('deactivate');
  }

  invokeDownload(){
    // Invoke the download prop, which returns true if download succeeded.
    if (this.download())
    {
      // Close and deactivate modal.
      this.closeDownloadModal();
    }
  }

}
</script>