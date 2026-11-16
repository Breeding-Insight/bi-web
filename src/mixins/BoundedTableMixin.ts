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

// Smallest box worth scrolling in; below this the box fills the window under the header instead.
const MIN_BOX_HEIGHT_PX = 320;
// Space kept between the page controls and the bottom of the window.
const BOTTOM_GAP_PX = 16;

// The parts of Buefy's b-table internal state that watchBuefyTable() follows.
interface BuefyTableState {
  newData: Array<any>;
  filters: object;
  currentSortColumn: object;
  isAsc: boolean;
}

/**
 * Keeps a table's header row and horizontal scrollbar on screen by capping the height of its scroll
 * box (the element matched by boundedScrollSelector()) to the space left in the window.
 *
 * A table shorter than the box looks as it would unbounded. A taller one scrolls inside the box,
 * with the header pinned by the .bounded-table styles in main.scss. The box is sized so that, on
 * load, its bottom edge and the page controls under it fit in the window. If the table starts too
 * far down the page for that, the box fills the window below the sticky DeltaBreed header instead.
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
  private boundedFrame: number | null = null;
  private pinFrame: number | null = null;
  private pageResizeObserver: { observe: (el: Element) => void, disconnect: () => void } | null = null;

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
  watchBuefyTable(table: Vue) {
    const state = table as unknown as BuefyTableState;
    this.$watch(() => state.newData.length, (count: number) => {
      this.filteredRecordCount = count;
    }, {immediate: true});
    this.$watch(() => [state.currentSortColumn, state.isAsc, JSON.stringify(state.filters)], () => {
      this.scrollBoundedToTop();
    });
  }

  mounted() {
    window.addEventListener('resize', this.scheduleBoundedResize);
    window.addEventListener('scroll', this.schedulePinControls, {passive: true});
    // Content elsewhere on the page, such as details collapsed above the table, can move the box
    // without this component updating; the page's height changes when it does. ResizeObserver is in
    // every supported browser, but not in this TypeScript version's DOM types.
    const ResizeObserverClass = (window as any).ResizeObserver;
    if (ResizeObserverClass) {
      this.pageResizeObserver = new ResizeObserverClass(() => this.scheduleBoundedResize());
      this.pageResizeObserver!.observe(document.body);
    }
    this.scheduleBoundedResize();
  }

  updated() {
    // Rows, page controls or content above the table may have changed.
    this.scheduleBoundedResize();
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.scheduleBoundedResize);
    window.removeEventListener('scroll', this.schedulePinControls);
    if (this.pageResizeObserver) {
      this.pageResizeObserver.disconnect();
    }
    if (this.boundedFrame !== null) {
      window.cancelAnimationFrame(this.boundedFrame);
    }
    if (this.pinFrame !== null) {
      window.cancelAnimationFrame(this.pinFrame);
    }
  }

  /** The table's page controls, marked with the bounded-table-controls class, while they are shown. */
  boundedControlsElement(): HTMLElement | null {
    const controls = this.$el instanceof HTMLElement
      ? this.$el.querySelector('.bounded-table-controls') as HTMLElement | null
      : null;
    // offsetParent is null while the controls or the table are hidden.
    return controls && controls.offsetParent !== null ? controls : null;
  }

  /**
   * Height of the page controls while pinControls() holds them at the bottom of the window, or 0.
   * Worked out from where the layout puts the controls, not where they have been moved to, so it
   * gives the same answer whether or not they have been moved yet in this frame. FloatingScrollbar
   * sits this far up from the bottom of the window.
   */
  boundedPinnedControlsHeight(): number {
    const controls = this.boundedControlsElement();
    const scrollElement = this.boundedScrollElement();
    if (!this.bounded || !controls || !scrollElement) return 0;

    const height = controls.offsetHeight;
    const layoutBottom = BoundedTableMixin.layoutBottom(controls);
    const belowWindow = layoutBottom > window.innerHeight;
    const boxOnScreen = scrollElement.getBoundingClientRect().top < window.innerHeight - height;
    return belowWindow && boxOnScreen ? height : 0;
  }

  /** The element that scrolls, for FloatingScrollbar's scroll-target. */
  boundedScrollElement(): HTMLElement | null {
    return this.$el instanceof HTMLElement
      ? this.$el.querySelector(this.boundedScrollSelector()) as HTMLElement | null
      : null;
  }

  private scheduleBoundedResize() {
    if (!this.bounded || this.boundedFrame !== null) return;
    this.boundedFrame = window.requestAnimationFrame(() => {
      this.boundedFrame = null;
      this.updateBoundedMaxHeight();
    });
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

    // Content above the table, its rows or its page size may have moved the box and its controls.
    this.schedulePinControls();
  }

  private schedulePinControls() {
    if (!this.bounded || this.pinFrame !== null) return;
    this.pinFrame = window.requestAnimationFrame(() => {
      this.pinFrame = null;
      this.pinControls();
    });
  }

  /**
   * While the box is on screen but its page controls are below the window, moves the controls up to
   * the bottom of the window, so paging stays in reach on pages where content above the table pushes
   * the box down. A transform leaves the layout alone, so nothing else on the page moves.
   */
  private pinControls() {
    const controls = this.boundedControlsElement();
    if (controls) {
      const pinnedHeight = this.boundedPinnedControlsHeight();
      const shift = pinnedHeight > 0 ? Math.round(BoundedTableMixin.layoutBottom(controls) - window.innerHeight) : 0;
      if (shift !== BoundedTableMixin.pinShift(controls)) {
        controls.style.transform = shift > 0 ? `translateY(-${shift}px)` : '';
        controls.dataset.pinShift = String(shift);
        controls.classList.toggle('is-pinned', shift > 0);
      }
    }

    const floatingScrollbar = this.$refs.floatingScrollbar as Vue & { scheduleUpdate?: () => void } | undefined;
    if (floatingScrollbar && floatingScrollbar.scheduleUpdate) {
      floatingScrollbar.scheduleUpdate();
    }
  }

  // How far pinControls() has moved the controls up from where the layout puts them. Kept on the
  // element, so a re-rendered one starts from 0.
  private static pinShift(controls: HTMLElement): number {
    return Number(controls.dataset.pinShift || '0');
  }

  // Bottom edge of the controls, relative to the window, where the layout puts them.
  private static layoutBottom(controls: HTMLElement): number {
    return controls.getBoundingClientRect().top + BoundedTableMixin.pinShift(controls) + controls.offsetHeight;
  }

  private static outerHeight(element: HTMLElement): number {
    if (element.offsetParent === null) return 0;
    const style = window.getComputedStyle(element);
    return element.offsetHeight + parseFloat(style.marginTop || '0') + parseFloat(style.marginBottom || '0');
  }
}
