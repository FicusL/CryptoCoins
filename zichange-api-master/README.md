# zichain-ico-api

## Description

Zichain ICO API

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Notes

### Transactions

#### Deposit
| Data base | Impact on balance | User vision | Calculating for user |
|:---------:|:-----------------:|:-----------:|:--------------------:|
| amount    |          +        | from amount |                      |
| fee       |          -        | fee amount  |                      |
|           |                   | to amount   | from amount - fee    |
#### Exchange
| Data base   | Impact on balance | User vision |
|:-----------:|:-----------------:|:-----------:|
| from amount |          -        | from amount |
| fee         |                   | fee amount  |
| to amount   |          +        | to amount   |
Fee included in from amount
#### Withdrawal
| Data base | Impact on balance | User vision | Calculating for user |
|:---------:|:-----------------:|:-----------:|:--------------------:|
| amount    |          -        | from amount |                      |
| fee       |                   | fee amount  |                      |
|           |                   | to amount   | from amount - fee    |
Fee included in from amount