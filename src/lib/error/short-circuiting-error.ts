export class ShortCircuitingError extends Error {
    private static readonly STAMP = 'TinyieldShortCircuitingError';

    constructor(message: string) {
        /* istanbul ignore next */
        super(`[${new Date().toDateString()}] - ${ShortCircuitingError.STAMP}: ${message}`);
        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        // tslint:disable-next-line
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = ShortCircuitingError.name; // stack traces display correctly now
    }
}
