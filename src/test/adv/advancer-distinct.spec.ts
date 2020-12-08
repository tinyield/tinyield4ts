import {of, Query} from '../../lib/query';
import {BEER, Beverage, getDinnerBeverages, getPackOfBeer} from '../model/beverage';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';
import {expect} from 'chai';

describe('AdvancerDistinct', () => {
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

    describe('when "distinct" is called', () => {
        let distinct: Query<Beverage>;
        let distinctBeer: Query<Beverage>;
        let expectation: Beverage[];
        let beerPackExpectation: Beverage[];

        beforeEach(() => {
            expectation = dinnerBeverages;
            beerPackExpectation = [BEER];
            distinct = dinnerBeveragesQuery.distinct();
            distinctBeer = beerPackQuery.distinctByKey('name');
        });

        it('should return a new sequences', () => {
            expect(distinct).not.to.equal(dinnerBeveragesQuery);
            expect(distinctBeer).not.to.equal(beerPackQuery);
        });

        describe('when the sequences are iterated', () => {
            let actual: Beverage[];
            let beerPackActual: Beverage[];

            beforeEach(() => {
                actual = getResultFromIteration(distinct);
                beerPackActual = getResultFromIteration(distinctBeer);
            });

            it('should report the distinct elements', () => {
                assertSameArray(actual, expectation);
                assertSameArray(beerPackActual, beerPackExpectation);
            });
        });

        describe('when the sequences are traversed', () => {
            let actual: Beverage[];
            let beerPackActual: Beverage[];

            beforeEach(() => {
                actual = getResultFromTraversal(distinct);
                beerPackActual = getResultFromTraversal(distinctBeer);
            });

            it('should report the distinct elements', () => {
                assertSameArray(actual, expectation);
                assertSameArray(beerPackActual, beerPackExpectation);
            });
        });
    });
});
