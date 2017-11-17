/* eslint no-process-env: "off" */
/* global describe, it */

const MongoClient = require('mongodb');
const assert = require('assert');
const jwksDb = require('../index');

describe('CONNECT', () => {
  it('should create the keystore without database', () =>
     jwksDb.connect()
     .then((ks) => assert.notEqual(ks, null, 'keystore should not be null')));

  it('should create the keystore using a database', () =>
     MongoClient.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test_jwks')
     .then(jwksDb.connect)
     .then((ks) => {
       jwksDb.getDb().close();
       return ks;
     })
     .then((ks) => assert.notEqual(ks, null, 'keystore should not be null')));
});
