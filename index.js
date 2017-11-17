const jose = require('node-jose');

let keystore = jose.JWK.createKeyStore();
let verify = null;

const RSA_1024 = 1024;

function initKeyStore() {
    return keystore.generate('RSA', RSA_1024);
}

exports.connect = (db = null) => {
  if (db === null) {
    return initKeyStore().then(() => keystore);
  }
  return db.collection('jwks').count()
    .then((cnt) => {
      if (cnt === 0) {
        return initKeyStore()
          .then(() => db.collection('jwks').insertOne({
            ks: keystore.toJSON(true)
          }))
          .then(() => keystore);
      }
      return db.collection('jwks')
        .findOne({}, {fields: {_id: 0}})
        .then((doc) => jose.JWK.asKeyStore(doc.ks)
              .then((result) => {
                // {result} is a jose.JWK.KeyStore
                keystore = result;
                return keystore;
              }));
    });
};

exports.get = () => keystore;

exports.generateJWS = (payload) =>
  jose.JWS
  .createSign({format: 'compact'},
              keystore.all({kty: 'RSA'})[0])
  .update(JSON.stringify(payload))
  .final();

exports.verifyJWS = (token) => {
  if (verify === null) {
    verify = jose.JWS.createVerify(keystore);
  }
  return verify.verify(token)
    .then((result) => ({
        header: result.header,
        payload: JSON.parse(result.payload.toString())
      }));
};
