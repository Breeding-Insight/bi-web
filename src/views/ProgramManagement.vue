<template>
  <div class="program-management">
    <div class="container is-fluid">
      <div class="level header-title">
        <div class="level-left">
          <div class="level-item">
            <a href="/">
              <img 
              src="../assets/img/bi-logo.svg" 
              alt="Breeding Insight home" 
              width="232" 
            >
            </a>
          </div>
        </div>
        <div class="level-right">
          <h1 class="title has-text-primary">Program Name Here</h1>
        </div>
      </div>
      <section class="section no-padding">
        <div class="columns">
          <div class="column is-one-quarter side-menu">
            <b-menu>
              <b-menu-item label="Trials and Experiments"></b-menu-item>
              <b-menu-item label="Germplasm Inventory"></b-menu-item>
              <b-menu-item label="Ontology Management"></b-menu-item>
              <b-menu-item label="Labels"></b-menu-item>
              <b-menu-item label="Reports"></b-menu-item>
              <b-menu-item label="Program Management"></b-menu-item>
            </b-menu>
          </div>
          <div class="column">
            <h1 class="title">Program Management</h1>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class ProgramManagement extends Vue {
  }
</script>