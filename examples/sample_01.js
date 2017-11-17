const jwks = require('../index.js');
const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/test_jwks')
  .then((db) => {
    console.log('db connected');
    jwks.connect(db).then((ks) => {
      console.log(ks.toJSON());
      const all = ks.all({kty: 'RSA'});

      console.log(all[0]);
      db.close()
        .then(() => {
          console.log('db closed');
        });
    });
  });
