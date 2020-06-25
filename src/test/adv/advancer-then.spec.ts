import {of, Query} from '../../lib/query';
import {Beverage, getDinnerBeverages} from '../model/beverage';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';

describe('AdvancerThen', () => {
    let dinnerBeverages: Beverage[];
    let dinnerBeveragesQuery: Query<Beverage>;

    beforeEach(() => {
        dinnerBeverages = getDinnerBeverages();
        dinnerBeveragesQuery = of(dinnerBeverages);
    });

    describe('when "then" is called', () => {
        let custom: Query<Beverage>;
        let expectation: Beverage[];

        beforeEach(() => {
            expectation = [];
            dinnerBeverages.forEach((value, index) => {
                if (index % 2 !== 0) {
                    expectation.push(value);
                }
            });
            custom = dinnerBeveragesQuery.then(previous => yld => {
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
            expect(custom).not.toEqual(dinnerBeveragesQuery);
        });

        describe('when the sequence is iterated', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = getResultFromIteration(custom);
            });

            it('should report elements', () => {
                assertSameArray(actual, expectation);
            });
        });

        describe('when the sequence is traversed', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = getResultFromTraversal(custom);
            });

            it('should report elements', () => {
                assertSameArray(actual, expectation);
            });
        });
    });
});
