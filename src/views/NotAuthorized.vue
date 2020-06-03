<!--
  - See the NOTICE file distributed with
  - this work for additional information regarding copyright ownership.
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
  <div class="container">
    <div class="card">
      <div class="card-content">
        <h1 class="title has-text-danger">Not Authorized</h1>
        <p class="has-text-dark">
          You are not authorized to access this resource. Verify your login credentials, and if the issue persists
          <a href="#!">contact your breeding program leader</a> or
          <a href="#!">Breeding Insight support</a>.
        </p>
        <router-link v-bind:to="{name:'home'}">
          Return to Home Page
        </router-link>
      </div>
    </div>
  </div>
</template>