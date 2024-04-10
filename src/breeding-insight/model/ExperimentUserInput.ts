export class ExperimentUserInput {
    overwrite?: boolean;
    overwriteReason?: string;

    constructor(overwrite?: boolean, overwriteReason?: string) {
        this.overwrite = overwrite;
        this.overwriteReason = overwriteReason;
    }
}