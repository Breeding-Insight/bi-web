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

export enum MethodClass {
  Computation = "Computation",
  Observation = "Observation",
  Measurement = "Measurement",
  Counting = "Counting",
  Estimation = "Estimation"
}

export class Method {
  methodName?: string;
  methodClass?: string;
  description?: string;
  formula?: string;

  constructor(methodName?:string, methodClass?:string, description?:string, formula?:string) {
    this.methodName = methodName;
    this.methodClass = methodClass;
    this.description = description;
    this.formula = formula;
  }

  static assign(method: Method) {
    return new Method(method.methodName, method.methodClass, method.description, method.formula);
  }

  static methodClassEquals(classString: string, type: MethodClass): boolean {
    return classString.toUpperCase() === type.toUpperCase();
  }

  equals(method?: Method): boolean {
    if (!method) {return false;}
    return (this.methodName === method.methodName) &&
      (this.methodClass === method.methodClass) &&
      (this.description === method.description) &&
      (this.formula === method.formula);
  }
}