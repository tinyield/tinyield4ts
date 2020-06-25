import {of, Query} from '../../lib/query';
import {BEER, Beverage, getDinnerBeverages, getPackOfBeer} from '../model/beverage';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';

describe('AdvancerZip', () => {
    let dinnerBeverages: Beverage[];
    let packOfBeer: Beverage[];
    let dinnerBeveragesQuery: Query<Beverage>;
    let beerPackQuery: Query<Beverage>;

    beforeEach(() => {
        dinnerBeverages = getDinnerBeverages();
        packOfBeer = getPackOfBeer();
        dinnerBeveragesQuery = of(dinnerBeverages);
        beerPackQuery = of(packOfBeer);
    });

    describe('when "zip" is called', () => {
        const assertSameZippedArray = (actual: Beverage[][], expected: Beverage[][]) => {
            expect(actual.length).toEqual(expected.length);
            for (let i = 0; i < actual.length; i++) {
                expect(actual[i][0]).toEqual(expected[i][0]);
                expect(actual[i][1]).toEqual(expected[i][1]);
            }
        };

        let zipped: Query<Beverage[]>;
        let expectation: Beverage[][];

        beforeEach(() => {
            expectation = dinnerBeverages.map(value => [value, BEER]);
            zipped = beerPackQuery.zip(dinnerBeveragesQuery, (elem1, elem2) => [elem2, elem1]);
        });

        it('should return a new sequence', () => {
            expect(zipped).not.toEqual(dinnerBeveragesQuery as any);
        });

        describe('when the sequence is iterated', () => {
            let actual: Beverage[][];

            beforeEach(() => {
                actual = getResultFromIteration(zipped);
            });

            it('should report elements', () => {
                assertSameZippedArray(actual, expectation);
            });
        });

        describe('when the sequence is traversed', () => {
            let actual: Beverage[][];

            beforeEach(() => {
                actual = getResultFromTraversal(zipped);
            });

            it('should report elements', () => {
                assertSameZippedArray(actual, expectation);
            });
        });
    });
});
