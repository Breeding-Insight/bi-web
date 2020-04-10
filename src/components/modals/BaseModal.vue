<template>

  <focus-trap
      v-bind:active.sync="active"
      v-bind:returnFocusOnDeactivate="false"
      v-on:deactivate="$emit('deactivate')"
  >
    <div
        class="modal"
        v-bind:class="{ 'is-active': active }"
        tabindex="-1"
    >
        <div class="modal-background" v-on:click="$emit('deactivate')"/>
        <div class="modal-card">
          <header class="modal-card-head">
            <div class="modal-card-title" />
            <button
                class="delete"
                aria-label="close"
                @click="$emit('deactivate')"
            />
          </header>
          <section
            class="modal-card-body"
            v-bind:class="bodyClass"
          >
            <slot></slot>
          </section>
          <footer class="modal-card-foot"/>
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
    active!: boolean;
    @Prop()
    bodyClass!: Object;

    mounted() {
    }
  }

</script>