/*
 * See the NOTICE file distributed with this work for additional information regarding copyright ownership.
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

export class DisplayNameManager {

  static getDisplayName(name: string, config?: any) {
    // Check local renames first
    let displayName = this.searchDisplayName(name, config.names);
    if (displayName) return displayName;
    // Return same name if nothing was found
    return name;
  }

  static searchDisplayName(name: string, nameMap?: any): string | undefined {
    const path: string[] = name.split('.');
    // Check path passed by component
    let currentStep = 0;
    let currentPath;
    while (currentStep <= path.length - 1) {
      currentPath = path.slice(currentStep).join('.');
      if (currentPath in nameMap) {
        return nameMap[currentPath];
      }
      currentStep += 1;
    }
    return undefined;
  }
}