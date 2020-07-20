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
  <div class="corfirm-import">
    <article class="message is-success">
      <div class="message-body">
        <nav class="level">
          <div class="level-left">
            <div class="level-item">
              <div class="has-text-dark">
                <strong>{{numTraits}} new traits and duplicates not checked yet</strong>
                <br/>Duplicate traits, highlighted in yellow and a X icon, will not be imported.
                <br/>Traits in this list can be directly edited using the "Show details" link.
              </div>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <div>
                <button class="button is-success has-text-weight-bold" v-on:click="confirm">Confirm</button>
              </div>
            </div>
            <div class="level-item">
              <div>
                <button class="button is-outlined" v-on:click="abort">Abort</button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component({
    components: {
    }
  })
  export default class ConfirmImportMessageBox extends Vue {

    @Prop()
    private numTraits!: number;

    confirm() {
      this.$emit('confirm');
    }

    abort() {
      this.$emit('abort');
    }

  }
</script>


