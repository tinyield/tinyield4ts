import {of, Query} from '../../lib/query';
import {Beverage, COFFEE, getDinnerBeverages} from '../model/beverage';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';
import {expect} from 'chai';

describe('Map', () => {
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
            expect(mapped).not.to.equal(dinnerBeveragesQuery as unknown);
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

        describe('when "filter" is called', () => {
            let filtered: Query<string>;
            let filterExpectation: string[];

            beforeEach(() => {
                filterExpectation = [COFFEE.name.toUpperCase()];
                filtered = mapped.filter(element => element.length > 4).map(element => element.toUpperCase());
            });

            it('should return a new sequence', () => {
                expect(filtered).not.to.equal(mapped);
            });

            describe('when the sequence is iterated', () => {
                let actual: string[];

                beforeEach(() => {
                    actual = getResultFromIteration(filtered);
                });

                it('should report the mapped elements', () => {
                    assertSameArray(actual, filterExpectation);
                });
            });

            describe('when the sequence is traversed', () => {
                let actual: string[];

                beforeEach(() => {
                    actual = getResultFromTraversal(filtered);
                });

                it('should report the mapped elements', () => {
                    assertSameArray(actual, filterExpectation);
                });
            });
        });
    });
});
