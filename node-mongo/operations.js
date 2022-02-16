const assert = require('assert');

exports.insertDocument = (db, document, collection, callback) => { // encapsula o método para ser exportado
    const coll = db.collection(collection); // define coll como a coleção resgatada do banco
    return coll.insert(document);
    
};

exports.findDocuments = (db, collection, callback) => { 
    const coll = db.collection(collection);
    return coll.find({}).toArray();
};

exports.removeDocument = (db, document, collection, callback) => { 
    const coll = db.collection(collection);
    return coll.deleteOne(document);
    
};

exports.updateDocument = (db, document, update, collection, callback) => { 
    const coll = db.collection(collection);
    return coll.updateOne(document, { $set: update}, null); 
};