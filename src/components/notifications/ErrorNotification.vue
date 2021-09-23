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
  <b-notification type="is-danger" v-bind:active.sync="active" aria-close-label="Close Notification"
    role="alert" v-on:close="onClose">
    <div class="columns has-vertical-align-middle">
      <div class="column is-flex-grow-0">
          <AlertCircleIcon size="1.5x"></AlertCircleIcon>
      </div>
      <div class="column" :class="bannerTextClass">
        {{msg}}
      </div>
    </div>
  </b-notification>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { AlertCircleIcon } from 'vue-feather-icons';
import {DEACTIVATE_ERROR_NOTIFICATION} from "@/store/mutation-types";

@Component({
  components: {AlertCircleIcon}
})
export default class ErrorNotification extends Vue {
  // 'active' and 'msg' should stay private.
  // (use the getters and mutators in the vuex store
  //  to modify these values)
  private active: boolean = false;
  private msg: string = '';

  private bannerTextClass: string = "banner-text";

  @Watch('$store.state.errorNotificationActive', {immediate: true})
  onActiveChanged(newVal: boolean, oldVal: any) {
    this.active = newVal;
  }
  @Watch('$store.state.errorNotificationMsg', {immediate: true})
  onMsgChanged(newVal: string, oldVal: any) {
    this.msg = newVal;
  }
  onClose(){
    this.$store.commit(DEACTIVATE_ERROR_NOTIFICATION);
  }
}

</script>