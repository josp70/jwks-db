const jose = require('node-jose');

let keystore = jose.JWK.createKeyStore();
let verify;

function initKeyStore() {
    console.log('initKeyStore()');
    return keystore.generate("RSA", 1024);
};

exports.connect = function(db=null) {
    if(db == null) {
	return initKeyStore().then(_=>{return keystore});
    } else {
	return db.collection('jwks').count().then(n => {
	    if(n === 0) {
		return initKeyStore().then(_ => {
		    return db.collection('jwks').insertOne({
			ks: keystore.toJSON(true)
		    }).then(_=> {return keystore;});
		});
	    } else {
		return db.collection('jwks')
		    .findOne({}, {fields: {_id:0}}).then(doc => {
			return jose.JWK.asKeyStore(doc.ks)
			    .then(function(result) {
				// {result} is a jose.JWK.KeyStore
				keystore = result;
				return keystore;
			    });
		    });
	    }
	});
    }
};

exports.get = function() {
    return keystore;
};

exports.generateJWS = function(payload) {
    return jose.JWS
	.createSign({format: 'compact'},
		   keystore.all({kty: 'RSA'})[0])
	.update(JSON.stringify(payload)).final();
};

exports.verifyJWS = function(token) {
    if(verify == null) {
	verify = jose.JWS.createVerify(keystore);
    }
    return verify.verify(token).then(result => {
	return {
	    header: result.header,
	    payload: JSON.parse(result.payload.toString())
	};
    });
};
