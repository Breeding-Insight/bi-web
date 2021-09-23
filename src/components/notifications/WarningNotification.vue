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
  <b-notification type="is-warning" v-bind:active.sync="active" aria-close-label="Close Notification"
                  role="alert" v-on:close="onClose">
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <AlertTriangleIcon size="1.5x"></AlertTriangleIcon>
        </div>
        <div class="level-item" :class="bannerTextClass">
          {{msg}}
        </div>
      </div>
    </div>
  </b-notification>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import { AlertTriangleIcon } from 'vue-feather-icons';
import {DEACTIVATE_WARNING_NOTIFICATION} from "@/store/mutation-types";

  @Component({
    components: {AlertTriangleIcon}
  })
  export default class WarningNotification extends Vue {
    // 'active' and 'msg' should stay private.
    // (use the getters and mutators in the vuex store
    //  to modify these values)
    private active: boolean = false;
    private msg : string = '';

    private bannerTextClass: string = "banner-text";
    @Watch('$store.state.warningNotificationActive', {immediate: true})
    onActiveChanged(newVal: boolean, oldVal: any) {
      this.active = newVal;
    }
    @Watch('$store.state.warningNotificationMsg', {immediate: true})
    onMsgChanged(newVal: string, oldVal: any) {
      this.msg = newVal;
    }
    onClose(){
      this.$store.commit(DEACTIVATE_WARNING_NOTIFICATION);
    }
  }

</script>