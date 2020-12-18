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

class SidePanelTableEventBusHandler {
  bus = new Vue();
  // Events
  closePanelEvent = 'close-panel';
  openPanelEvent = 'open-panel';

  selectRowEvent = 'select-row';
  activateEditEvent = 'activate-edit';
  deactivateEditEvent = 'deactive-edit';
  submitEditEvent = 'submit-edit';

  // Selected row
  public panelOpen: boolean = false;
  public editActive: boolean = false;
  public openedRow?: TableRow<any>;

  constructor() {
    // Set up events on bus
    this.bus.$on(this.closePanelEvent, () => {this.panelOpen = false});
    this.bus.$on(this.openPanelEvent, (row: TableRow<any>) => {
      this.panelOpen = true
      this.openedRow = row;
    });
  }
}

export const SidePanelTableEventBus = new SidePanelTableEventBusHandler();
