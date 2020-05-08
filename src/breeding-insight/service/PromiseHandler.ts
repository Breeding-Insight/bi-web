import {PromiseRejection, PromiseResolution, PromiseResult} from "promise.allsettled";
import {PromiseResultTuple} from "promise.allsettled/types";

export class PromiseHandler {
  promises: Promise<any>[] = [];

  constructor(promises: Promise<any>[]) {
    this.promises = promises;
  }

  addPromise(promise: Promise<any>) {
    this.promises.push(promise);
  }

  resolvePromises(): Promise<any> {
    
    return new Promise<any>((resolve, reject) => {
      Promise.allSettled(this.promises).then( (results: PromiseResult<any, any>[]) => {
        const successResults: PromiseResolution<any>[] = results as PromiseResolution<any>[];
        if (successResults.every((result: PromiseResolution<any>) => result.status === 'fulfilled')) {
          resolve(successResults.map((result: PromiseResolution<any>) => result.value));
        } else {
          const rejectionResults: PromiseRejection<any>[] = results as PromiseRejection<any>[];
          const failedResults = rejectionResults.filter((result: PromiseRejection<any>) => result.reason !== undefined)
            .map((failedResult: PromiseRejection<any>) => failedResult.reason);
          reject(failedResults);
        }
      })
    });
  }

}