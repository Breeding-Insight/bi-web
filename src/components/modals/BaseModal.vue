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

  <focus-trap
      v-bind:active="active"
      v-bind:returnFocusOnDeactivate="true"
      v-bind:escapeDeactivates="true"
      v-on:deactivate="$emit('deactivate')"
      ref="focusTrap"
  >
    <div
        class="modal"
        v-bind:class="[{ 'is-active': active }, modalClass]"
        tabindex="-1"
    >
      <div class="modal-background" v-on:click="() => $refs.focusTrap.deactivate()"/>
      <div class="modal-card">
        <header class="modal-card-head">
          <div class="modal-card-title" />
          <button
              class="delete"
              aria-label="close"
              @click="() => $refs.focusTrap.deactivate()"
          />
        </header>
        <section
            class="modal-card-body"
            v-bind:class="bodyClass"
        >
          <slot></slot>
        </section>
        <footer class="modal-card-foot">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </focus-trap>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FocusTrap } from 'focus-trap-vue'

@Component({
  components: { FocusTrap }
})
export default class BaseModal extends Vue {
  @Prop()
  active!: boolean;
  @Prop()
  bodyClass!: Object;
  @Prop()
  modalClass!: Object;

  mounted() {
  }
}

</script>