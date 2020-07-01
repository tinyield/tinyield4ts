export class Beverage {
    constructor(public readonly name: string, public readonly cost: number) {}
}

export const BEER = new Beverage('beer', 1);
export const COFFEE = new Beverage('coffee', 2);
export const COLA = new Beverage('cola', 1);
export const WINE = new Beverage('wine', 3);

export function getPackOfBeer(): Beverage[] {
    return [BEER, BEER, BEER, BEER];
}

export function getDinnerBeverages(): Beverage[] {
    return [COLA, WINE, COFFEE];
}
