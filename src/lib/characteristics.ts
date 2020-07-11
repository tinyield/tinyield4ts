export class Characteristics {
    public readonly hasAdvancer: boolean;

    constructor(hasAdvancer = true) {
        this.hasAdvancer = hasAdvancer;
    }
}

export const DEFAULT_CHARACTERISTICS = new Characteristics();
