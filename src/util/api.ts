import store from './../store';
import axios from 'axios';
import { ERROR_STATE, LOGOUT } from './../store/mutation-types';

export function call (config: any) {
    config.xsrfCookieName = 'xsrf_token';
    config.xsrfHeaderName = 'X-XSRF-TOKEN';
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