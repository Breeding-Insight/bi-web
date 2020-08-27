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

import localVue, {defaultStore} from "../../index";
import {mount} from "@vue/test-utils";
import EditDataRowForm from "@/components/forms/EditDataRowForm.vue";

describe('Events emitted properly.', () => {

  const store = defaultStore;
  const wrapper = mount(EditDataRowForm, {localVue, store});

  it('Emits submit event with edited object on editing save', async () => {
    const saveBtn = wrapper.find('button[data-testid="save"]');
    expect(saveBtn.exists()).toBeTruthy();
    await saveBtn.trigger('click');
    expect(wrapper.emitted('submit')).toHaveLength(1);
  });

  it('Emits cancel event with edited object on editing cancel', async () => {
    const cancelBtn = wrapper.find('button[data-testid="cancel"]');
    expect(cancelBtn.exists()).toBeTruthy();
    await cancelBtn.trigger('click');
    expect(wrapper.emitted('cancel')).toHaveLength(1);

  });

})

