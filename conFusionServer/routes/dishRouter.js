const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req, res, next) => {
    Dishes.find({})
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
    
})
.post((req, res, next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
    
})
.put((req, res, next) => {
    res.statusCode = 403; // Significa que a operação não é suportada
    res.end('PUT operation not supported on /dishes');
    
})
.delete((req, res, next) => {   
    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
    
});

dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId) // encontra o documento na coleção baseado no id da URL
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
    
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId);
    
})
.put((req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, { new: true })
    .then((dish) => {        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
    
})
.delete((req, res, next) => {   
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


// Handling with comments
//
//
dishRouter.route('/:dishId/comments')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err); // next é usado para que o erro não seja tratado pelo app.js, assim não quebra o fluxo
        }        
    }, (err) => next(err))
    .catch((err) => next(err));
    
})
.post((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null) {            
            dish.comments = dish.comments.concat(req.body); // NECESSARY BECAUSE .push IS DEPRECATED            
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err));            
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err); 
        }
    }, (err) => next(err))
    .catch((err) => next(err));
    
})
.put((req, res, next) => {
    res.statusCode = 403; // Significa que a operação não é suportada
    res.end('PUT operation not supported on /dishes/' + req.params.dishId + '/comments');    
})
.delete((req, res, next) => {   
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null) {            
            for (var i = (dish.comments.length - 1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save() // Salva a remoção dos comentários do documento
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err)); 
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err); 
        }        
    }, (err) => next(err))
    .catch((err) => next(err));
    
});

dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId) // encontra o documento na coleção baseado no id da URL
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId)); //retorna o comentário específico
        }
        else if(dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comments ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err); 
        }
    }, (err) => next(err))
    .catch((err) => next(err));
    
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId + '/comments/' + req.params.commentId);
    
})
.put((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating; // Não existe um método específico para atualizar dados de um sub-documento, então isso é usado      
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment; 
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err)); 
        }
        else if(dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comments ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err); 
        }
    }, (err) => next(err))
    .catch((err) => next(err));
    
})
.delete((req, res, next) => {   
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null) {            
            dish.comments.id(req.params.commentId).remove();           
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err)); 
        }
        else if(dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comments ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err); 
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = dishRouter;
