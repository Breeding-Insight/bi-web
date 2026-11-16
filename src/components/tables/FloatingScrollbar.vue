<!--
  - See the NOTICE file distributed with this work for additional information
  - regarding copyright ownership.
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
  <div
    v-show="visible"
    ref="bar"
    class="floating-scrollbar"
    aria-hidden="true"
    v-bind:style="barStyle"
    v-on:scroll="onBarScroll"
  >
    <div v-bind:style="{width: `${contentWidth}px`}" />
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {FrameThrottle, LayoutUtils} from '@/breeding-insight/utils/LayoutUtils';

// Height used when the browser draws overlay scrollbars that take no space (e.g. macOS by default).
const MIN_BAR_HEIGHT_PX = 12;

/**
 * A horizontal scrollbar fixed to the bottom of the window for a table's scroll box, shown while the
 * box can scroll sideways, is at least partly on screen, and its own scrollbar is out of sight below
 * the window. Scrolling either one scrolls the other, so a table can be scrolled sideways with a
 * plain mouse without first scrolling the page down to the bottom of the box.
 */
@Component
export default class FloatingScrollbar extends Vue {

  // Returns the element that scrolls sideways (the table's scroll box), or null if not rendered yet.
  @Prop()
  scrollTarget!: () => HTMLElement | null;

  private visible = false;
  private contentWidth = 0;
  private left = 0;
  private width = 0;
  private barHeight = MIN_BAR_HEIGHT_PX;

  private measure: FrameThrottle | null = null;
  private target: HTMLElement | null = null;
  private stopTargetResize: (() => void) | null = null;
  private stopPageResize: (() => void) | null = null;

  get barStyle(): { [key: string]: string } {
    return {
      left: `${this.left}px`,
      width: `${this.width}px`,
      height: `${this.barHeight}px`
    };
  }

  mounted() {
    this.measure = LayoutUtils.frameThrottle(() => this.update());
    window.addEventListener('scroll', this.scheduleUpdate, {passive: true});
    window.addEventListener('resize', this.scheduleUpdate);
    this.stopPageResize = LayoutUtils.onPageResize(this.scheduleUpdate);
    this.scheduleUpdate();
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.scheduleUpdate);
    window.removeEventListener('resize', this.scheduleUpdate);
    if (this.stopPageResize) this.stopPageResize();
    this.attachTarget(null);
    if (this.measure) this.measure.cancel();
  }

  /** Re-measures on the next frame. */
  scheduleUpdate() {
    if (this.measure) this.measure.schedule();
  }

  private update() {
    const target = this.scrollTarget ? this.scrollTarget() : null;
    if (target !== this.target) this.attachTarget(target);
    // offsetParent is null while the table is hidden, e.g. in an inactive tab.
    if (!target || target.offsetParent === null) {
      this.visible = false;
      return;
    }

    const rect = target.getBoundingClientRect();
    const edge = window.innerHeight;
    const scrollsSideways = target.scrollWidth > target.clientWidth;
    const partlyOnScreen = rect.top < edge - this.barHeight && rect.bottom > 0;
    const ownScrollbarOffScreen = rect.bottom > edge;
    this.visible = scrollsSideways && partlyOnScreen && ownScrollbarOffScreen;
    if (!this.visible) return;

    this.left = rect.left + target.clientLeft;
    this.width = target.clientWidth;
    this.contentWidth = target.scrollWidth;
    // Match the browser's own scrollbar size, with room for overlay scrollbars that take none.
    this.barHeight = Math.max(target.offsetHeight - target.clientHeight - target.clientTop * 2, MIN_BAR_HEIGHT_PX);

    this.$nextTick(() => this.setScrollLeft(this.$refs.bar as HTMLElement, target.scrollLeft));
  }

  private attachTarget(target: HTMLElement | null) {
    if (this.target) this.target.removeEventListener('scroll', this.onTargetScroll);
    if (this.stopTargetResize) {
      this.stopTargetResize();
      this.stopTargetResize = null;
    }
    this.target = target;
    if (target) {
      target.addEventListener('scroll', this.onTargetScroll, {passive: true});
      // The table inside the box widens when columns or rows change.
      const observed: Element[] = target.firstElementChild ? [target, target.firstElementChild] : [target];
      this.stopTargetResize = LayoutUtils.observeResize(observed, this.scheduleUpdate);
    }
  }

  private onTargetScroll() {
    if (this.visible && this.target) this.setScrollLeft(this.$refs.bar as HTMLElement, this.target.scrollLeft);
  }

  private onBarScroll() {
    if (this.target) this.setScrollLeft(this.target, (this.$refs.bar as HTMLElement).scrollLeft);
  }

  // The two sides have the same scroll width, so skipping equal positions stops each side's scroll
  // event from being echoed back to the other.
  private setScrollLeft(element: HTMLElement | undefined, scrollLeft: number) {
    if (!element || Math.abs(element.scrollLeft - scrollLeft) < 1) return;
    element.scrollLeft = scrollLeft;
  }
}
</script>
