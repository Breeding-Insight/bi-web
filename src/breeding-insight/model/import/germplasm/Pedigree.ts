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

export class Pedigree {
  femaleParent? : string;
  maleParent? : string;

  constructor(femaleParent?: string, maleParent?: string) {
    this.femaleParent = femaleParent;
    this.maleParent = maleParent;
  }

  /**
   * Pedigree string format from bi-api is femaleParentGID/maleParentGID.
   * It's possible to have only a female parent, but not only a male.
   *
   * @param pedigreeString
   */
  public static parsePedigreeString(pedigreeString : string) : Pedigree {
    if (pedigreeString === undefined) {
      return new Pedigree();
    }
    const parents = pedigreeString.split("/", 2);
    if (parents.length === 2) {
      return new Pedigree(parents[0], parents[1]);
    } else if (parents.length === 1) {
      return new Pedigree(parents[0]);
    } else {
      return new Pedigree();
    }
  }

  /**
   * Wrapper of parsePedigreeString that handles female/male parent unknown cases.
   *
   * @param pedigreeString
   * @param femaleParentUnknown
   * @param maleParentUnknown
   */
  public static parsePedigreeStringWithUnknowns(pedigreeString: string, femaleParentUnknown: string, maleParentUnknown: string) : Pedigree {
    let parsedPedigree = this.parsePedigreeString(pedigreeString);
    if (femaleParentUnknown) parsedPedigree.femaleParent = "0";
    if (maleParentUnknown) parsedPedigree.maleParent = "0";
    return parsedPedigree;
  }

}