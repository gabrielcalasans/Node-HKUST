const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';


//Permite o acesso ao banco
MongoClient.connect(url, (err, client) => {
    
    assert.equal(err, null); // checa se o err == null
    
    console.log('Connected correclty to server');
    
    const db = client.db(dbname);
    const collection = db.collection('dishes'); // acessa e atribui a collection dishes à variável collection
    
    collection.insertOne({"name": "Uthappizza", "description": "test"}, (err, result) => {
        assert.equal(err, null);
        
        console.log('After Insert:\n');
        console.log(result.ops); //OPS é uma propriedade q carrega quantas operações foram realizadas de maneira correta
        
        collection.find({}).toArray((err, docs) => { //Procura e armazena na variável docs, retorna erro em err
            assert.equal(err, null);
            
            console.log('Found:\n');
            console.log(docs);
            
            db.dropCollection('dishes', (err, result) => { // 'apaga' dishes
                assert.equal(err, null);
                
                client.close();
            });
        });
    });
    
});