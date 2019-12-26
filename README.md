# Tinyield4ts

A minimalistic extensible lazy sequence implementation for Typescript and Javascript.

[![npm version](https://badge.fury.io/js/tinyield4ts.svg)](https://badge.fury.io/js/tinyield4ts)
 
## Usage

An auxiliary `collapse()` method, which merges series of adjacent elements is written 
with Tinyield in the following way:

```typescript
import {Tinyield, Traverser} from 'tinyield4ts';

function collapse<T>(src: Tinyield<T>): Traverser<T> {
    return yld => {
        let prev: T = null;
        src.forEach(item => {
            if (prev === null || prev !== item) {
                prev = item;
                yld(item);
            }
        });
    };
}
```

This method can be chained in a sequence like this:

```typescript
const arrange = [7, 7, 8, 9, 9, 11, 11, 7];
const actual = [];
Tinyield.of(arrange)
    .then(n => collapse(n))
    .filter(n => n % 2 !== 0)
    .forEach(actual.push);
```


## Installation

```shell
$ npm i tinyield4ts
```

## License

This project is licensed under [Apache License,
version 2.0](https://www.apache.org/licenses/LICENSE-2.0)
