const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';


//Permite o acesso ao banco
MongoClient.connect(url, (err, client) => {
    
    assert.equal(err, null); // checa se o err == null
    
    console.log('Connected correclty to server');
    
    const db = client.db(dbname);
    
    dboper.insertDocument(db, {name: "Vadonut", description: 'Test'}, 'dishes', (result) => { 
        
        console.log('Insert Document:\n', result.ops);
        
        dboper.findDocuments(db, 'dishes', (docs) => {
            console.log('Found Documents:\n', docs);
            
            dboper.updateDocument(db, {name: 'Vadonut'}, {description: 'Update Test'}, 'dishes', (result) => { // Não é preciso especificar todos os campos na hora atualizar, apenas um que identifique os alvos (ou nenhum pra todos) 
                
                console.log('Updated Document:\n', result.result);
                
                dboper.findDocuments(db, 'dishes', (docs) => {
                    console.log('Found Documents:\n', docs);
                    
                    db.dropCollection('dishes', (result) => {
                        console.log('Dropped Collection: ', result);
                        
                        client.close();
                    });
                    
                });
                
               
                
            });
            
        });
        
    });
   
    
});