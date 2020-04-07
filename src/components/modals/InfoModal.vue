<template>
  <BaseModal
    v-bind:active.sync="active"
    v-on:deactivate="$emit('deactivate')"
  >
    <div class="message is-info">
      <div class="message-body">
        <article class="media">
          <figure class="media-left">
            <p class="image is-24x24">
              <alert-circle-icon size="1.5x"></alert-circle-icon>
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <h3 class="is-5 title has-text-info">
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
  import BaseModal from '@/components/modals/BaseModal.vue';
  import { AlertCircleIcon } from 'vue-feather-icons'

  @Component({
    components: {BaseModal, AlertCircleIcon}
  })
  export default class InfoModal extends Vue {
    @Prop()
    active!: boolean;
    @Prop()
    bodyClass!: Object;
    @Prop()
    msgTitle!: string;
  }

</script>