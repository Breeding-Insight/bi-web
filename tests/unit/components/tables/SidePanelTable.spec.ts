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

import {mount} from "@vue/test-utils";
import SidePanelTable from "@/components/tables/SidePanelTable.vue";
import {TableRow} from "@/breeding-insight/model/view_models/TableRow";
import {Pagination} from "@/breeding-insight/model/BiResponse";
import SidePanel from "@/components/tables/SidePanel.vue";
import TableColumn from "@/components/tables/TableColumn.vue";
import VueRouter from "vue-router";
import AdminUserManagement from "@/views/AdminUserManagement.vue";
import Vuex from "vuex";
import App from "@/App.vue";
import localVue from "../../index";
import TraitsImport from "@/views/TraitsImport.vue";
import TraitsImportTable from "@/components/trait/TraitsImportTable.vue";

describe('Details panel works properly', () => {

  const wrapper = mount(TraitsImportTable);

  it('Displays details panel when show details button is clicked', () => {
    console.log(wrapper.html());
    expect(wrapper.find(SidePanelTable).exists()).toBeTruthy();
  });

});