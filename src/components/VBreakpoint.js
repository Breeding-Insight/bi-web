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

import { extend } from 'vue-breakpoint-component'
 
// Default configuration:
const config = {
  // breakpoints for bulma, need to still mess with stuff to get matching with bulma classes
  breakpoints: {
    mobile: '(min-width: 529px)',//768
    tablet: '(min-width: 768px)',//1024
    desktop: '(min-width: 1024px)',//1216
  },
  debounceTime: 100,
  experimental: false
}
 
const { VShowAt, VHideAt, VBreakpoint } = extend(config)
 
export default VBreakpoint
 
export { VShowAt, VHideAt, VBreakpoint }