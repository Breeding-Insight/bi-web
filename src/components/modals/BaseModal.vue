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
      v-bind:escapeDeactivates="escapeDeactivates"
      v-bind:allowOutsideClick="allowOutsideClick"
      v-on:deactivate="$emit('deactivate')"
      ref="focusTrap"
  >
    <div
        class="modal"
        v-bind:class="[{ 'is-active': active }, modalClass]"
        tabindex="-1"
    >
        <div class="modal-background" v-on:click="backgroundClicked"/>
        <div class="modal-card">
          <header class="modal-card-head">
            <div class="modal-card-title">
              <h3 class="is-5 title has-text-info" v-if="msgTitle">
                {{msgTitle}}
              </h3>
            </div>
            <button
                v-if="showCloseButton"
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
    msgTitle!: string;
    @Prop()
    active!: boolean;
    @Prop({default:() => true})
    escapeDeactivates!: boolean;
    @Prop({default:() => true})
    allowOutsideClick!: boolean;
    @Prop({default:() => true})
    showCloseButton!: boolean;
    @Prop()
    bodyClass!: Object;
    @Prop()
    modalClass!: Object;

    mounted() {
    }

    backgroundClicked() {
      if(this.escapeDeactivates) {
        this.$refs.focusTrap.deactivate();
      }
    }
  }

</script>