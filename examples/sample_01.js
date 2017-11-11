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
