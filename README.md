# Tinyield4ts

[![npm version](https://badge.fury.io/js/tinyield4ts.svg)](https://badge.fury.io/js/tinyield4ts)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=tinyield_tinyield4ts&metric=alert_status)](https://sonarcloud.io/dashboard?id=tinyield_tinyield4ts)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=tinyield_tinyield4ts&metric=coverage)](https://sonarcloud.io/dashboard?id=tinyield_tinyield4ts)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=tinyield_tinyield4ts&metric=bugs)](https://sonarcloud.io/dashboard?id=tinyield_tinyield4ts)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=tinyield_tinyield4ts&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=tinyield_tinyield4ts)
 
A _Minimalistic_, _extensible_ and _lazy_ sequence implementation for Typescript and Javascript.

## Usage

An auxiliary `collapse()` method, which merges series of adjacent elements is written 
with Tinyield in the following way:

```typescript
import {Query, Traverser} from 'tinyield4ts';

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
```

This method can be chained in a sequence like this:

```typescript
const arrange = [7, 7, 8, 9, 9, 11, 11, 7];
const actual = [];
Query.of(arrange)
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
