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

export class FileType {
    //todo check if all properties needed
    static xls = new FileType("xls", ".xls", "application/vnd.ms-excel", "XLS");
    static xlsx = new FileType("xlsx", ".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "XLSX");
    static csv = new FileType("csv", ".csv", "text/csv", "CSV");

    name: string;
    extension: string;
    mimeType: string;
    id: string;

    constructor(name: string, extension: string, mimeType: string, id: string) {
        this.name = name;
        this.extension = extension;
        this.mimeType = mimeType;
        this.id = id;
    }
}