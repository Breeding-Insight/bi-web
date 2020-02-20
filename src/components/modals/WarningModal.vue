<template>
  <BaseModal
      v-bind:active="active"
      v-on:close-modal="$emit('cancel')"
    >
      <div class="message is-danger">
        <div class="message-body">
          <article class="media">
            <figure class="media-left">
              <p class="image is-24x24">
                <alert-triangle-icon size="1.5x"></alert-triangle-icon>
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <h3 class="is-5 title has-text-danger">
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
import { AlertTriangleIcon } from 'vue-feather-icons'
import BaseModal from '@/components/modals/BaseModal.vue';

@Component({
  components: {AlertTriangleIcon, BaseModal}
})
export default class WarningModal extends Vue {
  @Prop()
  active!: boolean;
  @Prop()
  msgTitle! : string;
}

</script>