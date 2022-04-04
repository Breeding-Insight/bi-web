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

import {Trait} from "@/breeding-insight/model/Trait";

describe('Trait equals return the correct values.', () => {

  it('Returns true if tags are the same and in the same order', () => {
    let trait1 = new Trait();
    trait1.tags=["tag1", "tag2"];
    let trait2 = new Trait();
    trait2.tags= ["tag1", "tag2"];
    expect(trait1.equals(trait2)).toBeTruthy();
  });

  it('Returns false if tags are the same, but in different order', () => {
    let trait1  = new Trait();
    trait1.tags = ["tag1", "tag2"];
    let trait2  = new Trait();
    trait2.tags = ["tag2", "tag1"];
    expect(trait1.equals(trait2)).toBeFalsy();
  });

  it('Returns false if trait1 has default tags',() => {
    let trait1 = new Trait();
   // trait1.tags.push("tag1", "tag2");
    let trait2 = new Trait();
    trait2.tags = ["tag1"];
    expect(trait1.equals(trait2)).toBeFalsy();
  });

  it('Returns true if trait1 has default tags and trait2 has empty tag list',() => {
    let trait1 = new Trait();
    // trait1.tags.push("tag1", "tag2");
    let trait2 = new Trait();
    trait2.tags = [];
    expect(trait1.equals(trait2)).toBeTruthy();
  });
});
