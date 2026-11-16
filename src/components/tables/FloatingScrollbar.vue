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

// Height used when the browser draws overlay scrollbars that take no space (e.g. macOS by default).
const MIN_BAR_HEIGHT_PX = 12;

/**
 * A horizontal scrollbar fixed to the bottom of the window (above any page controls pinned there) for
 * a table's scroll box, shown while the box can scroll sideways, is at least partly on screen, and its
 * own scrollbar is out of sight below the window or behind those controls.
 * Scrolling either one scrolls the other, so a table can be scrolled sideways with a plain mouse
 * without first scrolling the page down to the bottom of the box.
 */
@Component
export default class FloatingScrollbar extends Vue {

  // Returns the element that scrolls sideways (the table's scroll box), or null if not rendered yet.
  @Prop()
  scrollTarget!: () => HTMLElement | null;
  // Returns the height of whatever is pinned to the bottom of the window under the bar, e.g. page controls.
  @Prop({default: () => () => 0})
  bottomOffset!: () => number;

  private visible = false;
  private contentWidth = 0;
  private left = 0;
  private width = 0;
  private barHeight = MIN_BAR_HEIGHT_PX;
  private bottom = 0;

  private frame: number | null = null;
  private target: HTMLElement | null = null;
  private resizeObserver: { observe: (el: Element) => void, disconnect: () => void } | null = null;

  get barStyle(): { [key: string]: string } {
    return {
      left: `${this.left}px`,
      bottom: `${this.bottom}px`,
      width: `${this.width}px`,
      height: `${this.barHeight}px`
    };
  }

  mounted() {
    window.addEventListener('scroll', this.scheduleUpdate, {passive: true});
    window.addEventListener('resize', this.scheduleUpdate);
    // ResizeObserver is in every supported browser, but not in this TypeScript version's DOM types.
    const ResizeObserverClass = (window as any).ResizeObserver;
    if (ResizeObserverClass) {
      this.resizeObserver = new ResizeObserverClass(() => this.scheduleUpdate());
    }
    this.scheduleUpdate();
  }

  updated() {
    this.scheduleUpdate();
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.scheduleUpdate);
    window.removeEventListener('resize', this.scheduleUpdate);
    this.attachTarget(null);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.frame !== null) window.cancelAnimationFrame(this.frame);
  }

  /** Re-measures on the next frame; call after the table's rows or columns change. */
  scheduleUpdate() {
    if (this.frame !== null) return;
    this.frame = window.requestAnimationFrame(() => {
      this.frame = null;
      this.update();
    });
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
    const bottom = this.bottomOffset();
    // Top of whatever is pinned to the bottom of the window, or the bottom of the window.
    const edge = window.innerHeight - bottom;
    const scrollsSideways = target.scrollWidth > target.clientWidth;
    const partlyOnScreen = rect.top < edge - this.barHeight && rect.bottom > 0;
    const ownScrollbarOffScreen = rect.bottom > edge;
    this.visible = scrollsSideways && partlyOnScreen && ownScrollbarOffScreen;
    if (!this.visible) return;

    this.bottom = bottom;
    this.left = rect.left + target.clientLeft;
    this.width = target.clientWidth;
    this.contentWidth = target.scrollWidth;
    // Match the browser's own scrollbar size, with room for overlay scrollbars that take none.
    this.barHeight = Math.max(target.offsetHeight - target.clientHeight - target.clientTop * 2, MIN_BAR_HEIGHT_PX);

    this.$nextTick(() => this.setScrollLeft(this.$refs.bar as HTMLElement, target.scrollLeft));
  }

  private attachTarget(target: HTMLElement | null) {
    if (this.target) {
      this.target.removeEventListener('scroll', this.onTargetScroll);
      if (this.resizeObserver) this.resizeObserver.disconnect();
    }
    this.target = target;
    if (target) {
      target.addEventListener('scroll', this.onTargetScroll, {passive: true});
      if (this.resizeObserver) {
        this.resizeObserver.observe(target);
        // The table inside the box widens when columns or rows change.
        if (target.firstElementChild) this.resizeObserver.observe(target.firstElementChild);
      }
    }
  }

  private onTargetScroll() {
    if (this.visible) this.setScrollLeft(this.$refs.bar as HTMLElement, this.target!.scrollLeft);
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
