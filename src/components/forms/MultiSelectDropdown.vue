<template>
  <div class="multi-select dropdown" :class="{'is-active': isActive}">
    <div class="dropdown-trigger">
      <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" v-on:click="toggleActive">
        <span>Selected ({{selected ? selected.length : 0}})</span>
        <span class="icon is-small">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
        </span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div>
        <input :value="filterVal" type="text" class="input" placeholder="Search..." v-on:input="filterOptions($event.target.value)"/>
      </div>
      <div v-if="selected && selected.length > 0">
        <button class="button is-small is-text" v-on:click="clearFilters">Clear filters</button>
      </div>
      <div class="dropdown-content">
        <template v-for="option in filteredOptions">
          <div class="dropdown-item" :key="'option-'+option">
            <label class="checkbox">
              <input type="checkbox" v-on:click="selectItem(option)" :checked="selected && selected.includes(option)">
              {{option}}
            </label>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class MultiSelectDropdown extends Vue {
  @Prop()
  public value?: any;

  @Prop()
  public options?: Array<any>;

  @Prop({default: false})
  public multiple?: boolean;

  isActive: boolean = false;
  selected?: any = this.value;
  numSelected = 0;
  filterVal?: string = "";
  filteredOptions?: Array<any> = this.options;

  @Watch('value', {immediate: true})
  watchValue(newVal: any, oldVal: any) {
      this.selected = newVal;
  }

  @Watch('options', {immediate: true})
  watchOptions(newVal: any, oldVal: any) {
    this.filteredOptions = newVal;
  }

  selectItem(value:any) {
    if (this.multiple) {
      if (this.selected) {
        if (this.selected.indexOf(value) === -1) {
          // Add value
          this.selected = [...this.selected, value];
        } else {
          // Remove value
          this.selected = this.selected.filter((val:any) => val !== value);
        }
      } else {
        this.selected = [value];
      }
      this.numSelected = this.selected.length;
      this.$emit('change', this.selected);
    } else {
      if (this.selected !== value) {
        this.selected = value;
        this.$emit('change', this.selected);
      }
    }
    this.$emit('input', this.selected);
    this.$forceUpdate();
    if (!this.multiple) {
      this.isActive = false;
    }
  }

  filterOptions(value: string) {
    this.filterVal = value;
    if(this.filterVal!.trim().length > 0) {
      this.filteredOptions = this.options!.filter(val => (val+"").startsWith(this.filterVal!));
    } else {
      this.filteredOptions = this.options;
    }

  }

  toggleActive() {
    this.isActive = !this.isActive;
    if(!this.isActive) {
      this.filterOptions("");
    }
  }

  clearFilters() {
    this.selected = [];
    this.$emit('input', this.selected);
    this.$forceUpdate();
  }

}
</script>
<style scoped>

</style>