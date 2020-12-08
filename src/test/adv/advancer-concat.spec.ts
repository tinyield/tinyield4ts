import {of, Query} from '../../lib/query';
import {Beverage, getDinnerBeverages, getPackOfBeer} from '../model/beverage';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';
import {expect} from 'chai';

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
            expect(concat).not.to.equal(beerPackQuery as unknown);
            expect(concat).not.to.equal(dinnerBeveragesQuery as unknown);
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
