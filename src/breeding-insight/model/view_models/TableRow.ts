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

export class TableRow<T extends Object> {
  data!: T;
  edit: boolean;
  new: boolean;
  selected: boolean;
  editable: boolean;
  nameError: boolean;
  emailError: boolean;
  editData!: T;

  constructor(editable: boolean, data: T) {
    //this.data = new User(id, name, email, roles);
    //this.editData = Object.assign({}, this.data);
    this.editable = editable;
    this.new = false;
    this.edit = false;
    this.new = false;
    this.selected = false;
    this.nameError = false;
    this.emailError = false;
    this.data = data;
    if (editable) {
        this.editData = {...data};
    }
      
  }



  confirmChanges() {
    this.data = {...this.editData};
  }

  revertChanges() {
    this.editData = {...this.data};
  }

  toggleEdit() {
    if (this.editable) {
      this.edit = !this.edit;
    }
  }

  toggleNew() {
    this.new = !this.new;
  }

  cancelEdit() {
    this.toggleEdit();
    this.revertChanges();
  }

  clearNewState() {
    this.new = false;
  }
}