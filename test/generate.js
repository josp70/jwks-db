/* eslint no-process-env: "off" */
/* global describe, it, before, after */

const MongoClient = require('mongodb');
const assert = require('assert');
const jwksDb = require('../index');

describe('GENERATE', () => {
  const payload = {
    admin: true,
    sub: 'yo'
  };

  before('connect to db', () =>
         MongoClient.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test_jwks')
         .then(jwksDb.connect));

  it('should generate a compact JWS', () =>
     jwksDb.generateJWS(payload)
     .then((token) => assert.notEqual(token, null, 'token must be not null')));

  it('should recover back the payload', () =>
     jwksDb.generateJWS(payload)
     .then(jwksDb.verifyJWS)
     .then((result) => assert.deepEqual(payload, result.payload,
                                        'decoded payload does not match')));

  after('close db', () => jwksDb.getDb().close());
});
