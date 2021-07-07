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


export type Result<E, S> = Err<E, S> | Success<E, S>;

export class Err<E, S> {
  readonly value: E;

  constructor(value: E) {
    this.value = value;
  }

  applyResult<A>(func: (s: S) => A): Result<E, A> {
    return this as any;
  }

  isErr(): this is Err<E, S> {
    return true;
  }

  isSuccess(): this is Success<E, S> {
    return false;
  }
}

export class Success<E, S> {
  readonly value: S;

  constructor(value: S) {
    this.value = value;
  }

  applyResult<A>(func: (s: S) => A): Result<E, A> {
    return new Success(func(this.value));
  }

  isSuccess(): this is Success<E, S> {
    return true;
  }

  isErr(): this is Err<E, S> {
    return false;
  }
}

export class ResultGenerator {

  static err<E, S>(e: E): Err<E, S> {
    return new Err(e);
  }

  static success<E, S>(s: S): Success<E, S> {
    return new Success(s);
  }
}
