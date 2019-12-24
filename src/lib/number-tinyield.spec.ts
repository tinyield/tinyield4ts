import {of, Tinyield} from './tinyield';
import {from, NumberTinyield} from './number-tinyield';

describe('NumberTinyield', () => {
    let countdown: number[];
    let source: Tinyield<number>;
    beforeEach(() => {
        countdown = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]; // Happy new year!
        source = of(countdown);
    });

    describe('when "from" is called', () => {
        let sequence: NumberTinyield;

        beforeEach(() => {
            sequence = from(source);
        });

        it('should return a sequence', () => {
            expect(sequence).toBeDefined('sequence is undefined');
            expect(sequence).not.toEqual(source as any);
        });

        describe('when "max" is called', () => {
            let actual: number;
            let expectation: number;

            beforeEach(() => {
                expectation = countdown[0];
                actual = sequence.max();
            });

            it('should return the max', () => {
                expect(actual).toEqual(expectation);
            });
        });
    });
});
