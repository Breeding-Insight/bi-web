/*
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, Prop, Vue} from 'vue-property-decorator'
import {FrameThrottle, LayoutUtils} from '@/breeding-insight/utils/LayoutUtils';

// Smallest box worth scrolling in; below this the box fills the window under the header instead.
const MIN_BOX_HEIGHT_PX = 320;
// Space kept between the page controls and the bottom of the window.
const BOTTOM_GAP_PX = 16;

// The parts of Buefy's b-table internal state that watchBuefyTable() follows.
interface BuefyTableState {
  newData?: Array<any>;
  filters?: object;
  currentSortColumn?: object;
  isAsc?: boolean;
}

/**
 * Keeps a table's header row and horizontal scrollbar on screen by capping the height of its scroll
 * box (the element matched by boundedScrollSelector()) to the space left in the window.
 *
 * A table shorter than the box looks as it would unbounded. A taller one scrolls inside the box,
 * with the header pinned by the .bounded-table styles in main.scss. The box is sized so that, on
 * load, its bottom edge and the page controls under it fit in the window. If the table starts too
 * far down the page for that, the box fills the window below the sticky DeltaBreed header instead,
 * and FloatingScrollbar stands in for its horizontal scrollbar until the page is scrolled down.
 *
 * Opt out with :bounded="false" where the table already sits inside something that scrolls, such as
 * a modal.
 */
@Component
export default class BoundedTableMixin extends Vue {

  @Prop({default: true})
  bounded!: boolean;

  // Rows left after a Buefy table's own (client-side) filters; kept by watchBuefyTable().
  filteredRecordCount: number = 0;

  private boundedMaxHeight: number | null = null;
  private boundedResize: FrameThrottle | null = null;
  private stopPageResize: (() => void) | null = null;

  get boundedStyle(): { [key: string]: string } {
    return this.bounded && this.boundedMaxHeight !== null
      ? {'--bounded-table-max-height': `${this.boundedMaxHeight}px`}
      : {};
  }

  /** CSS selector, within this component, of the element that scrolls. */
  boundedScrollSelector(): string {
    return '.table-wrapper';
  }

  /** Height of the page controls that sit directly under the scroll box and must stay in view with it. */
  boundedReservedHeight(scrollElement: HTMLElement): number {
    let height = 0;
    let sibling = scrollElement.nextElementSibling as HTMLElement | null;
    while (sibling) {
      height += BoundedTableMixin.outerHeight(sibling);
      sibling = sibling.nextElementSibling as HTMLElement | null;
    }
    return height;
  }

  /** The element that scrolls, for FloatingScrollbar's scroll-target. */
  boundedScrollElement(): HTMLElement | null {
    return this.$el instanceof HTMLElement
      ? this.$el.querySelector(this.boundedScrollSelector()) as HTMLElement | null
      : null;
  }

  /** Scrolls the box back to its first row, after a change of page, page size, sort or filter. */
  scrollBoundedToTop() {
    const scrollElement = this.boundedScrollElement();
    if (scrollElement) {
      scrollElement.scrollTop = 0;
    }
  }

  /**
   * Follows a Buefy b-table's state: keeps filteredRecordCount current, and returns the box to its
   * first row when the sort or a column filter changes. Buefy only emits filters-change for backend
   * filtering, so the table's state is watched instead of its events. Call once the table is mounted.
   */
  watchBuefyTable(table: Vue | undefined) {
    if (!table) return;
    const state = table as unknown as BuefyTableState;
    this.$watch(() => (state.newData ? state.newData.length : 0), (count: number) => {
      this.filteredRecordCount = count;
    }, {immediate: true});
    this.$watch(() => [state.currentSortColumn, state.isAsc, JSON.stringify(state.filters || {})], () => {
      this.scrollBoundedToTop();
    });
  }

  mounted() {
    this.boundedResize = LayoutUtils.frameThrottle(() => this.updateBoundedMaxHeight());
    window.addEventListener('resize', this.scheduleBoundedResize);
    // Rows loading, page controls appearing, or content above the table collapsing all change the
    // page's size, and may move the box or change the room it has.
    this.stopPageResize = LayoutUtils.onPageResize(this.scheduleBoundedResize);
    this.scheduleBoundedResize();
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.scheduleBoundedResize);
    if (this.stopPageResize) this.stopPageResize();
    if (this.boundedResize) this.boundedResize.cancel();
  }

  private scheduleBoundedResize() {
    if (this.bounded && this.boundedResize) this.boundedResize.schedule();
  }

  private updateBoundedMaxHeight() {
    const scrollElement = this.boundedScrollElement();
    // offsetParent is null while the table is hidden, e.g. in an inactive tab.
    if (!scrollElement || scrollElement.offsetParent === null) return;

    const mainHeader = document.querySelector('.main-header') as HTMLElement | null;
    const headerHeight = mainHeader ? mainHeader.offsetHeight : 0;
    // Buefy puts a margin under the box when page controls follow it.
    const boxMargin = parseFloat(window.getComputedStyle(scrollElement).marginBottom || '0');
    const reserved = boxMargin + this.boundedReservedHeight(scrollElement) + BOTTOM_GAP_PX;
    const top = scrollElement.getBoundingClientRect().top + window.pageYOffset;

    // Tallest the box can be with the page scrolled so the box sits just under the sticky header.
    const fitsBelowHeader = window.innerHeight - headerHeight - reserved;
    // Tallest the box can be without scrolling the page.
    const fitsOnLoad = window.innerHeight - top - reserved;

    // Fit the box on screen as loaded when that leaves room for several rows. When content above the
    // table pushes it too far down, fill the window below the header instead: one scroll of the page
    // then brings the whole box, its horizontal scrollbar and the page controls into view.
    const maxHeight = Math.round(Math.max(
      fitsOnLoad >= MIN_BOX_HEIGHT_PX ? fitsOnLoad : fitsBelowHeader,
      MIN_BOX_HEIGHT_PX
    ));
    if (maxHeight !== this.boundedMaxHeight) {
      this.boundedMaxHeight = maxHeight;
    }
  }

  private static outerHeight(element: HTMLElement): number {
    if (element.offsetParent === null) return 0;
    const style = window.getComputedStyle(element);
    return element.offsetHeight + parseFloat(style.marginTop || '0') + parseFloat(style.marginBottom || '0');
  }
}
