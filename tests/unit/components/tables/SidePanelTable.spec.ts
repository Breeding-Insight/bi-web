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

import {mount, Wrapper} from "@vue/test-utils";
import SidePanel from "@/components/tables/SidePanel.vue";
import localVue, {defaultStore} from "../../index";
import TraitsImportTable from "@/components/trait/TraitsImportTable.vue";
import {Trait} from "@/breeding-insight/model/Trait";
import {Method} from "@/breeding-insight/model/Method";
import {Scale} from "@/breeding-insight/model/Scale";
import {ProgramObservationLevel} from "@/breeding-insight/model/ProgramObservationLevel";
import {mocked} from 'ts-jest'
import {TraitUploadDAO} from "@/breeding-insight/dao/TraitUploadDAO";
import SidePanelTableRow from "@/components/tables/SidePanelTableRow.vue";
import DaoUtils from "../../test-utils/DaoUtils";

jest.mock('@/breeding-insight/dao/TraitUploadDAO');
let traits: Trait[] = [];

function setup() {

  // Mock trait response
  const method = new Method('Test Method', 'Computation', 'A method', '1=1');
  const scale = new Scale('Test Scale', 'Number', undefined, 3, 0, 999);
  const level = new ProgramObservationLevel('Plant');
  traits = [
    new Trait('1', 'Trait1', level, method, scale),
    new Trait('2', 'Trait2', level, method, scale)
  ]
  const response = DaoUtils.formatBiResponse(traits);

  const traitUploadDAO = mocked(TraitUploadDAO, true);
  traitUploadDAO.getTraitUpload.mockResolvedValue(response);
}

setup();

describe('Details panel works properly', () => {
  const store = defaultStore;
  const wrapper = mount(TraitsImportTable, {localVue, store});

  it('Displays details panel when row is clicked', async () => {

    // Check on row click
    const row = wrapper.findComponent(SidePanelTableRow);
    expect(row.exists()).toBeTruthy();
    await row.trigger('click');

    const sidePanel = wrapper.findComponent(SidePanel);
    expect(sidePanel.exists()).toBeTruthy();
    // Sanity check to see if the trait information can be found
    expect(sidePanel.text()).toContain(traits[0].traitName);
    expect(sidePanel.text()).toContain(traits[0].scale!.dataType);
    expect(sidePanel.text()).toContain(traits[0].method!.methodClass);

    const closeBtn = sidePanel.find('[aria-label="close"]');
    expect(closeBtn.exists()).toBeTruthy();
    await closeBtn.trigger('click');
  });

  it('Displays details panel when Show Details button is clicked', async () => {

    const row = wrapper.findComponent(SidePanelTableRow);
    const showDetailsLink = row.find('a[data-testid="showDetails"]');
    expect(showDetailsLink.exists()).toBeTruthy();

    await showDetailsLink.trigger('click');
    const sidePanel = wrapper.findComponent(SidePanel);
    expect(sidePanel.exists()).toBeTruthy();
    // Sanity check to see if the trait information can be found
    expect(sidePanel.html()).toContain(traits[0].traitName);
    expect(sidePanel.html()).toContain(traits[0].scale!.dataType);
    expect(sidePanel.html()).toContain(traits[0].method!.methodClass);
  });

});

describe('Pagination works with side panel table', () => {

  it('Next page button works when side panel open', () => {});

  it('Next page button works when side panel closed', () => {});

  it('Previous page button works when side panel open', () => {});

  it('Previous page button works when side panel closed', () => {});

  it('Page selection button works when side panel open', () => {});

  it('Page selection button works when side panel open', () => {});

  it('Page size selection works when side panel open', () => {});

  it('Page size selection works when side panel closed', () => {});

});