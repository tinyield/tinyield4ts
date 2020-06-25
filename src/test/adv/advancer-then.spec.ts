import {Query, Traverser} from '../..';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';

describe('AdvancerThen', () => {
    const arrange = [7, 7, 8, 9, 9, 11, 11, 7];

    function collapse<T>(src: Query<T>): Traverser<T> {
        return yld => {
            let prev: T;
            src.forEach(item => {
                if (prev === undefined || prev !== item) {
                    prev = item;
                    yld(item);
                }
            });
        };
    }

    describe('when "then" is called', () => {
        let custom: Query<number>;
        let expectation: number[];

        beforeEach(() => {
            expectation = [7, 9, 11, 7];
            custom = Query.of(arrange)
                .then(n => collapse(n))
                .filter(n => n % 2 !== 0);
        });

        it('should return a sequence', () => {
            expect(custom).toBeDefined();
        });

        describe('when the sequence is iterated', () => {
            let actual: number[];

            beforeEach(() => {
                actual = getResultFromIteration(custom);
            });

            it('should report elements', () => {
                assertSameArray(actual, expectation);
            });
        });

        describe('when the sequence is traversed', () => {
            let actual: number[];

            beforeEach(() => {
                actual = getResultFromTraversal(custom);
            });

            it('should report elements', () => {
                assertSameArray(actual, expectation);
            });
        });
    });
});
