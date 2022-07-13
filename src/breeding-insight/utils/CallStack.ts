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

import {v4 as uuidv4} from "uuid";

/*
Handles a call stack for a single endpoint. When multiple calls are made
over a period of time, this class will record the most recent call and only
return the response from that call.
 */
export class CallStack {
  call: (options: any) => Promise<any>;
  currentCallId: string;

  constructor(call: (options: any) => Promise<any>) {
    this.call = call;
  }

  makeCall(options: any): { call: Promise<any>; callId: string; } {
    const callId = uuidv4();
    this.currentCallId = callId;
    return {call: this.call(options), callId};
  }

  isCurrentCall(callId: string) {
    return this.currentCallId === callId;
  }
}