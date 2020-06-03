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

import store from './../store';
import axios from 'axios';
import { ERROR_STATE, LOGOUT } from './../store/mutation-types';

export function call (config: any) {
    config.xsrfCookieName = 'phylo-token';
    //config.xsrfHeaderName = '_xsrf';
    config.withCredentials = true;

    return new Promise(((resolve, reject) => {
        axios(config).then((response) => {
            store.commit(ERROR_STATE, { apiError: false, apiUnavailable: false });
            resolve(response);
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                store.commit(LOGOUT);
            } else {
                store.commit(ERROR_STATE, {
                    apiUnavailable: !error.response,
                    apiError: error.response && error.response.status === 500
                });
            }

            reject(error);
        });
    }));
}