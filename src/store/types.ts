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

import {User} from "@/breeding-insight/model/User";
import {Program} from "@/breeding-insight/model/Program";

export interface RootState {
  loggedIn: boolean;
  user?: User;
  program?: Program;
  apiError: boolean;
  apiUnavailable: boolean;
  loginServerError: boolean;
  requestedPath?: string;
  firstVisit?: boolean;
  showSidebarMobile: boolean;

  errorNotificationActive: boolean;
  errorNotificationMsg?: string;
  successNotificationActive: boolean;
  successNotificationMsg?: string;
  infoNotificationActive: boolean;
  infoNotificationMsg?: string;
  warningNotificationActive: boolean;
  warningNotificationMsg?: string;
}
