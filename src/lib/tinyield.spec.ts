import {of, Tinyield} from './tinyield';

class Beverage {
    constructor(public readonly name: string, public readonly cost: number) {}
}

describe('Tinyield', () => {
    let beverages: Beverage[];
    let packOfBeer: Beverage[];
    const beer = new Beverage('beer', 1);

    beforeEach(() => {
        const coffee = new Beverage('coffee', 1);
        const cola = new Beverage('cola', 1);
        const wine = new Beverage('wine', 3);

        beverages = [coffee, cola, wine];
        packOfBeer = [beer, beer, beer, beer];
    });

    describe('when "of" is called', () => {
        let sequence: Tinyield<Beverage>;

        beforeEach(() => {
            sequence = of(beverages);
        });

        it('should return a sequence', () => {
            expect(sequence).toBeDefined('sequence is undefined');
            expect(packOfBeer).toBeDefined('packOfBeer is undefined');
        });

        describe('when "sorted" is called', () => {
            let actual: Beverage[];
            let expected: Beverage[];

            beforeEach(() => {
                const comparator = (a: Beverage, b: Beverage) => a.cost - b.cost;
                expected = beverages.sort(comparator);
                actual = [];
                sequence.sorted(comparator).forEach(element => actual.push(element));
            });

            it('should traverse the sequence', () => {
                expect(actual.length).toEqual(beverages.length);
                for (let i = 0; i < actual.length; i++) {
                    expect(actual[i]).toEqual(expected[i]);
                }
            });
        });

        describe('when "forEach" is called', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = [];
                sequence.forEach(element => actual.push(element));
            });

            it('should traverse the sequence', () => {
                expect(actual.length).toEqual(beverages.length);
                for (let i = 0; i < actual.length; i++) {
                    expect(actual[i]).toEqual(beverages[i]);
                }
            });
        });
    });
});
