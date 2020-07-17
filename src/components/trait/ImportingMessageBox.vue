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
  <div class="importing">
    <h1 class="title">Importing...</h1>
      <article class="message is-light">
        <div class="message-body">
          <div class="columns">
            <div class="column">
              <progress-bar v-bind:label="'Importing File ' + this.file.name"
                            v-bind:estimated-time-text="'May take up to a minute'"
              />
            </div>
            <div class="column">
              <button class="button is-outlined" v-on:click="abort">Abort</button>
            </div>
          </div>
        </div>
      </article>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import ProgressBar from '@/components/forms/ProgressBar.vue'

  @Component({
    components: {
      ProgressBar
    }
  })
  export default class ImportingMessageBox extends Vue {

    @Prop()
    private file!: File;

    abort() {
      this.$emit('abort');
    }

  }
</script>


