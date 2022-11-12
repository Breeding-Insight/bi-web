<template>
  <div class="dropdown" :class="{'is-active': isActive}">
    <div class="dropdown-trigger">
      <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" v-on:click="isActive = !isActive">
        <span>Selected ({{numSelected}})</span>
        <span class="icon is-small">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
        </span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <div class="dropdown-item" v-for="option in options" :key="'option-'+option">
          <label class="checkbox">
            <input type="checkbox" v-on:click="selectItem(option)">
            {{option}}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class MultiSelectDropdown extends Vue {
  private isActive: boolean = false;
  private selected?: any;
  private numSelected = 0;

  @Prop()
  public value?: any;

  @Prop()
  public options?: any;

  @Prop({default: false})
  public multiple?: boolean;

  mounted() {
    this.selected = this.value;
  }

  @Watch('value', {immediate: true})
  watchCompleted(newVal: boolean, oldVal: boolean) {
      this.selected = newVal;
  }

  selectItem(value:any) {
    if (this.multiple) {
      if (this.selected) {
        if (this.selected.indexOf(value) === -1) {
          // Add value
          this.selected = [...this.selected, value]
        } else {
          // Remove value
          this.selected = this.selected.filter((val:any) => val !== value)
        }
      } else {
        this.selected = [value]
      }
      this.numSelected = this.selected.length;
      this.$emit('change', this.selected)
    } else {
      if (this.selected !== value) {
        this.selected = value
        this.$emit('change', this.selected)
      }
    }
    this.$emit('input', this.selected)
    if (!this.multiple) {
      this.isActive = false;
    }
  }

}
</script>