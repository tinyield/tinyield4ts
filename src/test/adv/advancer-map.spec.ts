import {of, Query} from '../../lib/query';
import {Beverage, getDinnerBeverages} from '../model/beverage';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';

describe('AdvancerMap', () => {
    let dinnerBeverages: Beverage[];
    let dinnerBeveragesQuery: Query<Beverage>;

    beforeEach(() => {
        dinnerBeverages = getDinnerBeverages();
        dinnerBeveragesQuery = of(dinnerBeverages);
    });

    describe('when "map" is called', () => {
        let mapped: Query<string>;
        let expectation: string[];

        beforeEach(() => {
            expectation = dinnerBeverages.map(element => element.name);
            mapped = dinnerBeveragesQuery.map(element => element.name);
        });

        it('should return a new sequence', () => {
            expect(mapped).not.toEqual(dinnerBeveragesQuery as any);
        });

        describe('when the sequence is iterated', () => {
            let actual: string[];

            beforeEach(() => {
                actual = getResultFromIteration(mapped);
            });

            it('should report the mapped elements', () => {
                assertSameArray(actual, expectation);
            });
        });

        describe('when the sequence is traversed', () => {
            let actual: string[];

            beforeEach(() => {
                actual = getResultFromTraversal(mapped);
            });

            it('should report the mapped elements', () => {
                assertSameArray(actual, expectation);
            });
        });
    });
});
