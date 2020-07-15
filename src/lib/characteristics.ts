export class Characteristics {
    public readonly isAdvanceable: boolean;

    constructor(isAdvanceable = true) {
        this.isAdvanceable = isAdvanceable;
    }
}

export function getMergedCharacteristics(left: Characteristics, right: Characteristics) {
    return new Characteristics(left.isAdvanceable && right.isAdvanceable);
}

export const DEFAULT_CHARACTERISTICS = new Characteristics();
