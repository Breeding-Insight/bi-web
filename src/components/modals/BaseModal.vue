<template>

<div
    class="modal"
    v-bind:class="{ 'is-active': active }"
>
  <div class="modal-background" />
  <div class="modal-card">
    <header class="modal-card-head">
      <div class="modal-card-title" />
      <button
          class="delete"
          aria-label="close"
          @click="$emit('closeModal')"
      />
    </header>
    <section class="modal-card-body has-text-centered">
      <slot></slot>
    </section>
  </div>
</div>

</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class BaseModal extends Vue {
    @Prop()
    public active: boolean = false;
  }

</script>