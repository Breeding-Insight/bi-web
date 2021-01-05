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

export class SidePanelTableEventBusHandler {
  bus = new Vue();

  // Events
  openPanelEvent = 'open-panel';
  activateEditEvent = 'activate-edit';
  deactivateEditEvent = 'deactive-edit';
  requestClosePanelEvent = 'request-close-panel';
  confirmCloseEditEvent = 'confirm-close-edit';
  cancelCloseEditEvent = 'cancel-close-edit';
  successEditEvent = 'success-edit-event';

  // State variables
  public panelOpen: boolean = false;
  public editActive: boolean = false;
  public closeEditModalActive: boolean = false;
  public openedRow?: TableRow<any>;

  constructor() {
    this.reset();
    // Set up events on bus
    this.bus.$on(this.openPanelEvent, (row: TableRow<any>) => {
      this.panelOpen = true
      this.openedRow = row;
    });
    this.bus.$on(this.activateEditEvent, (row: TableRow<any>) => {
      this.editActive = true
    });
    this.bus.$on(this.deactivateEditEvent, (showCloseEditModal: boolean) => {
      if (showCloseEditModal){
        this.closeEditModalActive = true;
      } else {
        this.bus.$emit(this.confirmCloseEditEvent);
      }
    });
    this.bus.$on(this.confirmCloseEditEvent, () => {
      this.editActive = false;
      this.panelOpen = false;
      this.closeEditModalActive = false;
      this.openedRow = undefined;
    });
    this.bus.$on(this.cancelCloseEditEvent, () => {
      this.closeEditModalActive = false;
    });
    this.bus.$on(this.successEditEvent, () => {
      this.editActive = false;
      this.panelOpen = true;
    })
  }

  reset() {
    this.panelOpen = false;
    this.editActive = false;
    this.closeEditModalActive = false;
    this.openedRow = undefined;
  }
}
