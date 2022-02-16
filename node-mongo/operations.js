const assert = require('assert');

exports.insertDocument = (db, document, collection, callback) => { // encapsula o método para ser exportado
    const coll = db.collection(collection); // define coll como a coleção resgatada do banco
    coll.insert(document, (err, result) => {
        assert.equal(err, null);
        console.log("Inserted " + result.result.n + " documents into the collection " + collection); // result é uma propriedade objeto da resposta que contém os dados referentes às séries de operações. Dessa forma, 'n' é uma dessas propriedades que indica o número de operações realizadas
        callback(result);
    });
    
};

exports.findDocuments = (db, collection, callback) => { 
    const coll = db.collection(collection);
    coll.find({}).toArray((err, docs) => { // find({}) indica para buscar em todo o arquivo json, toArray() organiza o resultado em um array
        assert.equal(err, null);
        callback(docs); // docs é simplesmente passado através do callback
        
    });
};

exports.removeDocument = (db, document, collection, callback) => { 
    const coll = db.collection(collection);
    coll.deleteOne(document, (err, result) => {
        assert.equal(err, null);
        console.log("Removed the document ", document);
        callback(result);
    });
    
};

exports.updateDocument = (db, document, update, collection, callback) => { 
     const coll = db.collection(collection);
    coll.updateOne(document, { $set: update}, null, (err, result) => { // {$set: update} indica quais campos serão alterados
        assert.equal(err, null);
        console.log("Updated the document with ", update);
        callback(result);
    }); 
};