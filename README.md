jwks-db
=========
![build status](https://gitlab.com/jorge.suit/jwks-db/badges/master/build.svg)

Helper package to manage JWKS and persit to db. It depends on
node-jose and mongodb to persist the keystore.

## Installation

  `npm install jwks-db`

## Usage

```javascript
const jwks = require('jwks-db');
const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/msvc_user').then(db=>{
    console.log('db connected');
    jwks.connect(db).then(ks => {
        console.log(ks.toJSON());
        const all = ks.all({ kty: 'RSA' });

        console.log(all[0]);
        db.close().then(_=>{
            console.log('db closed');
        });
    });
});
```

## Linting

npm run lint

## Tests

npm test

## Contributing

In lieu of a formal style guide, take care to maintain the existing
coding style. Add unit tests for any new or changed
functionality. Lint and test your code.
