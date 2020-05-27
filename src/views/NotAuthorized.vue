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