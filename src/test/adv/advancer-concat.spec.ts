import {of, Query} from '../..';
import {Beverage, getDinnerBeverages, getPackOfBeer} from '../model/beverage';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';

describe('AdvancerConcat', () => {
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

    describe('when "concat" is called', () => {
        let concat: Query<Beverage>;
        let expectation: Beverage[];

        beforeEach(() => {
            expectation = [...packOfBeer, ...dinnerBeverages];
            concat = beerPackQuery.concat(dinnerBeveragesQuery);
        });

        it('should return a new sequence', () => {
            expect(concat).not.toEqual(beerPackQuery as any);
            expect(concat).not.toEqual(dinnerBeveragesQuery as any);
        });

        describe('when the sequence is iterated', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = getResultFromIteration(concat);
            });

            it('should report elements', () => {
                assertSameArray(actual, expectation);
            });
        });

        describe('when the sequence is traversed', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = getResultFromTraversal(concat);
            });

            it('should report elements', () => {
                assertSameArray(actual, expectation);
            });
        });
    });
});
