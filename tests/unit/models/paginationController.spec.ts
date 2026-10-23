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

import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";

describe('PaginationController page size changes', () => {

  it('Resets to the first page when page size changes', () => {
    const controller = new PaginationController(10, 20, 10, 200);
    controller.updatePageSize(200);
    expect(controller.currentPage).toEqual(1);
    expect(controller.pageSize).toEqual(200);
    expect(controller.getPaginationSelections().page).toEqual(1);
  });
});
