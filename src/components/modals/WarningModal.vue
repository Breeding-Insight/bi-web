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
  <BaseModal
      v-bind:active.sync="active"
      v-on:deactivate="$emit('deactivate')"
    >
      <div class="message is-danger">
        <div class="message-body">
          <article class="media">
            <figure class="media-left">
              <p class="image is-24x24">
                <alert-triangle-icon size="1.5x"></alert-triangle-icon>
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <h3 class="is-5 title has-text-danger">
                  {{msgTitle}}
                </h3>
              </div>
            </div>
          </article>
          <slot></slot>
        </div>
      </div>
  </BaseModal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AlertTriangleIcon } from 'vue-feather-icons'
import BaseModal from '@/components/modals/BaseModal.vue';

@Component({
  components: {AlertTriangleIcon, BaseModal}
})
export default class WarningModal extends Vue {
  @Prop()
  active!: boolean;
  @Prop()
  msgTitle! : string;
}

</script>