export class Characteristics {
    public readonly hasAdvancer: boolean;

    constructor(hasAdvancer?: boolean) {
        if (hasAdvancer !== undefined) {
            this.hasAdvancer = hasAdvancer;
        } else {
            this.hasAdvancer = true;
        }
    }
}

export const DEFAULT_CHARACTERISTICS = new Characteristics();
