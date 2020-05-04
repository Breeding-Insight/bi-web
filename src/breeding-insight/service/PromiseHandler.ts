import {PromiseResult} from "promise.allsettled";

export class PromiseHandler {
  promises: Promise<any>[] = [];

  constructor(promises: Promise<any>[]) {
    this.promises = promises;
  }

  addPromise(promise: Promise<any>) {
    this.promises.push(promise);
  }

  resolvePromises(): Promise<any> {
    //TODO: Need to get these function shimmed out in typescript.
    return new Promise<any>((resolve, reject) => {
      Promise.allSettled(this.promises).then( (results: PromiseResult<any>[]) => {
        if (results.every((result: PromiseResult<any>) => result.status == 'fulfilled')) {
          resolve(results.map((result: PromiseResult<any>) => result.value));
        } else {
          const failedResults = results.filter((result: PromiseResult<any>) => result.reason !== undefined)
            .map((failedResult: PromiseResult<any>) => failedResult.reason);
          reject(failedResults);
        }
      })
    });
  }

}