<template>
  <section id="emptyTableMessage">
    <div class="columns">
      <div class="column is-10">
        <slot />
      </div>
      <div class="column">
        <button
          class="button is-primary has-text-weight-bold is-pulled-right"
          v-on:click="$emit('newClick')"
          v-show="buttonViewToggle"
        >
          <span class="icon is-small">
            <PlusCircleIcon size="1.5x" aria-hidden="true"></PlusCircleIcon>
          </span>
          <span>
            {{buttonText}}
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Component from "vue-class-component";
import {Prop, Vue} from "vue-property-decorator";
import {PlusCircleIcon} from 'vue-feather-icons';

@Component({
  components: {
    PlusCircleIcon
  }
})
export default class EmptyTableMessage extends Vue {
  @Prop()
  buttonViewToggle!: boolean;
  @Prop()
  buttonText!: string;
}
</script>