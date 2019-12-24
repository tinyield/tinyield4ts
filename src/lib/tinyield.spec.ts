import {of, Tinyield} from './tinyield';

class Beverage {
    constructor(public readonly name: string, public readonly cost: number) {}
}

describe('Tinyield', () => {
    let beverages: Beverage[];
    beforeEach(() => {
        beverages = [new Beverage('coffee', 1), new Beverage('cola', 1), new Beverage('beer', 1), new Beverage('wine', 3)];
    });

    describe('when "of" is called', () => {
        let sequence: Tinyield<Beverage>;

        beforeEach(() => {
            sequence = of(beverages);
        });

        it('should return a sequence', () => {
            expect(sequence).toBeDefined('sequence is undefined');
        });

        describe('when "filter" is called', () => {
            let filtered: Tinyield<Beverage>;

            beforeEach(() => {
                filtered = sequence.filter(element => element.cost > 1);
            });

            it('should return a new sequence', () => {
                expect(filtered).not.toEqual(sequence);
            });

            describe('when the sequence is traversed', () => {
                let expectation: Beverage[];
                let actual: Beverage[];

                beforeEach(() => {
                    expectation = [beverages[3]];
                    actual = [];
                    filtered.forEach(element => actual.push(element));
                });

                it('should only have the filtered elements', () => {
                    expect(actual.length).toEqual(expectation.length);
                    for (let i = 0; i < actual.length; i++) {
                        expect(actual[i]).toEqual(expectation[i]);
                    }
                });
            });
        });

        describe('when "map" is called', () => {
            let mapped: Tinyield<string>;

            beforeEach(() => {
                mapped = sequence.map(element => element.name);
            });

            it('should return a new sequence', () => {
                expect(mapped).not.toEqual(sequence as any);
            });

            describe('when the sequence is traversed', () => {
                let expectation: string[];
                let actual: string[];

                beforeEach(() => {
                    expectation = beverages.map(element => element.name);
                    actual = [];
                    mapped.forEach(element => actual.push(element));
                });

                it('should report the mapped elements', () => {
                    expect(actual.length).toEqual(expectation.length);
                    for (let i = 0; i < actual.length; i++) {
                        expect(actual[i]).toEqual(expectation[i]);
                    }
                });
            });
        });

        describe('when "skip" is called', () => {
            let skipped: Tinyield<Beverage>;

            beforeEach(() => {
                skipped = sequence.skip(beverages.length - 1);
            });

            it('should return a new sequence', () => {
                expect(skipped).not.toEqual(sequence);
            });

            describe('when the sequence is traversed', () => {
                let expectation: Beverage[];
                let actual: Beverage[];

                beforeEach(() => {
                    expectation = [beverages[beverages.length - 1]];
                    actual = [];
                    skipped.forEach(element => actual.push(element));
                });

                it('should have skipped the requested elements', () => {
                    expect(actual.length).toEqual(expectation.length);
                    for (let i = 0; i < actual.length; i++) {
                        expect(actual[i]).toEqual(expectation[i]);
                    }
                });
            });
        });

        describe('when "then" is called', () => {
            let custom: Tinyield<Beverage>;
            beforeEach(() => {
                custom = sequence.then(previous => yld => {
                    let odd = false;
                    previous.forEach(element => {
                        if (odd) {
                            yld(element);
                        }
                        odd = !odd;
                    });
                });
            });

            it('should return a new sequence', () => {
                expect(custom).not.toEqual(sequence);
            });

            describe('when the sequence is traversed', () => {
                let expectation: Beverage[];
                let actual: Beverage[];

                beforeEach(() => {
                    expectation = [];
                    beverages.forEach((value, index) => {
                        if (index % 2 !== 0) {
                            expectation.push(value);
                        }
                    });
                    actual = [];
                    custom.forEach(element => actual.push(element));
                });

                it('should report elements', () => {
                    expect(actual.length).toEqual(expectation.length);
                    for (let i = 0; i < actual.length; i++) {
                        expect(actual[i]).toEqual(expectation[i]);
                    }
                });
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
