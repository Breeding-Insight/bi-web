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

// ResizeObserver is in every supported browser, but not in this TypeScript version's DOM types.
interface ResizeObserverLike {
  observe(element: Element): void;
  disconnect(): void;
}

type ResizeObserverConstructor = new (callback: () => void) => ResizeObserverLike;

export interface FrameThrottle {
  /** Runs the function on the next animation frame, once however often this is called before then. */
  schedule(): void;
  /** Drops a scheduled run, e.g. when the component is destroyed. */
  cancel(): void;
}

export class LayoutUtils {

  private static pageResizeSubscribers: Set<() => void> = new Set();
  private static pageResizeObserver: ResizeObserverLike | null = null;

  /** Wraps a function so that it runs at most once per animation frame. */
  static frameThrottle(fn: () => void): FrameThrottle {
    let frame: number | null = null;
    return {
      schedule() {
        if (frame !== null) return;
        frame = window.requestAnimationFrame(() => {
          frame = null;
          fn();
        });
      },
      cancel() {
        if (frame !== null) {
          window.cancelAnimationFrame(frame);
          frame = null;
        }
      }
    };
  }

  /**
   * Calls the callback when any of the elements changes size. Returns a function that stops observing.
   * Does nothing in browsers without ResizeObserver.
   */
  static observeResize(elements: Element[], callback: () => void): () => void {
    const observer = LayoutUtils.createResizeObserver(callback);
    if (!observer) return () => {};
    elements.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }

  /**
   * Calls the callback when the page's height or width changes, e.g. when content above a table
   * collapses. Every subscriber shares one observer. Returns a function that unsubscribes.
   */
  static onPageResize(callback: () => void): () => void {
    LayoutUtils.pageResizeSubscribers.add(callback);
    if (!LayoutUtils.pageResizeObserver) {
      LayoutUtils.pageResizeObserver = LayoutUtils.createResizeObserver(
        () => LayoutUtils.pageResizeSubscribers.forEach(subscriber => subscriber())
      );
      if (LayoutUtils.pageResizeObserver) LayoutUtils.pageResizeObserver.observe(document.body);
    }
    return () => {
      LayoutUtils.pageResizeSubscribers.delete(callback);
      if (LayoutUtils.pageResizeSubscribers.size === 0 && LayoutUtils.pageResizeObserver) {
        LayoutUtils.pageResizeObserver.disconnect();
        LayoutUtils.pageResizeObserver = null;
      }
    };
  }

  private static createResizeObserver(callback: () => void): ResizeObserverLike | null {
    const ResizeObserverClass = (window as unknown as { ResizeObserver?: ResizeObserverConstructor }).ResizeObserver;
    return ResizeObserverClass ? new ResizeObserverClass(callback) : null;
  }
}
