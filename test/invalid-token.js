/* eslint no-process-env: "off" */
/* global describe, it, before */

const assert = require('assert');
const jwksDb = require('../index');

describe('INVALID TOKEN', () => {
  const payload = {
    admin: true,
    sub: 'yo'
  };

  before('create keystore', jwksDb.connect);

  it('should fail with SyntaxError for a wrong JSON', () =>
     jwksDb.generateJWS(payload)
     .then((token) => jwksDb.verifyJWS(`xyz${token}`))
     .catch((error) => {
       assert.equal(error.constructor.name, 'SyntaxError',
                    'Expected SyntaxError when parsing JSON');
     }));

  it('should fail with Error for a wrong signature', () =>
     jwksDb.generateJWS(payload)
     .then((token) => jwksDb.verifyJWS(`${token}xyz`))
     .catch((error) => {
       const expectedMsg = 'no key found';

       assert.equal(error.message, expectedMsg,
                    `Expected ${expectedMsg} message`);
       assert.equal(error.constructor.name, 'Error',
                    'Expected Error for wrong signature');
     }));

});
