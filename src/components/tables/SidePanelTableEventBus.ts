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

import Vue from 'vue';
import {TableRow} from "@/breeding-insight/model/view_models/TableRow";
import {EventStore} from "@/util/EventStore";

export class SidePanelTableEventBusHandler {
  bus = new Vue();

  // Events
  confirmOpenPanel = 'confirm-open-panel';
  closePanelEvent = 'close-panel-event';
  selectRowEvent = 'select-row';
  activateEditEvent = 'activate-edit';
  requestClosePanelEvent = 'request-close-panel';
  confirmCloseEditEvent = 'confirm-close-edit';
  cancelCloseEditEvent = 'cancel-close-edit';
  successEditEvent = 'success-edit-event';
  collapseColumnsEvent = 'collapseColumns';
  uncollapseColumnsEvent = 'uncollapse-columns';

  // Event store
  private eventStore: EventStore = new EventStore();

  // State variables
  public panelOpen: boolean = false;
  public editActive: boolean = false;
  public closeEditModalActive: boolean = false;
  public collapseColumns: boolean = false;
  public openedRow?: any;

  constructor() {
    this.reset();
    // Set up events on bus
    this.bus.$on(this.selectRowEvent, (row: any) => {
      this.eventStore.addEvent(() => { this.bus.$emit(this.confirmOpenPanel, row); });
      this.bus.$emit(this.requestClosePanelEvent, () => this.showCloseWarningModal(), () => this.bus.$emit(this.confirmCloseEditEvent));
    });
    // Accepts a function to execute after panel closing
    this.bus.$on(this.closePanelEvent, (event: () => void) => {
      if (event) { this.eventStore.addEvent(event); }
      this.bus.$emit(this.requestClosePanelEvent, () => this.showCloseWarningModal(), () => this.bus.$emit(this.confirmCloseEditEvent));
    });

    // Final state events
    this.bus.$on(this.confirmOpenPanel, (row: any) => {
      this.openPanel(row);
    });
    this.bus.$on(this.activateEditEvent, () => {
      this.activateEdit();
      this.eventStore.clear();
    });
    this.bus.$on(this.confirmCloseEditEvent, (event: () => void) => {
      if (event) { event(); }
      if (this.editActive) {
        this.cancelEdit();
      } else {
        this.closePanel();
      }
      this.executeStoredEvents();
    });
    this.bus.$on(this.cancelCloseEditEvent, () => {
      this.cancelCloseEdit();
      this.eventStore.clear();
    });
    this.bus.$on(this.successEditEvent, (updatedRow: any) => {
      if (updatedRow) { this.openedRow = updatedRow; }
      this.cancelEdit();
      this.eventStore.clear();
    });
    this.bus.$on(this.collapseColumnsEvent, () => {
      this.collapseColumns = true;
    });
    this.bus.$on(this.uncollapseColumnsEvent, () => {
      this.collapseColumns = false;
    })
  }

  private openPanel(row: TableRow<any>) {
    this.panelOpen = true;
    this.openedRow = row;
  }

  private closePanel() {
    this.editActive = false;
    this.panelOpen = false;
    this.closeEditModalActive = false;
    this.openedRow = undefined;
  }

  private showCloseWarningModal() {
    this.closeEditModalActive = true;
  }

  private cancelCloseEdit() {
    this.closeEditModalActive = false;
  }

  private executeStoredEvents() {
    while (this.eventStore.hasEvent()){
      this.eventStore.pop()!.execute();
    }
  }

  private activateEdit() {
    this.editActive = true;
  }
  private cancelEdit() {
    this.closeEditModalActive = false;
    this.editActive = false;
  }

  reset() {
    this.panelOpen = false;
    this.editActive = false;
    this.closeEditModalActive = false;
    this.openedRow = undefined;
  }
}
