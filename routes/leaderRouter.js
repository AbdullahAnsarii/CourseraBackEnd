let express = require("express");
let bodyParser = require("body-parser");
let mongoose = require('mongoose');
let Leaders = require("../models/leaders");
let authenticate = require('../authenticate');

let leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());
leaderRouter.route('/').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
})
.get((req, res, next)=>{
    Leaders.find({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((authenticate.verifyUser), (req, res, next)=>{
    Leaders.create(req.body)
    .then((leader) => {
        console.log('Leader Created ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((authenticate.verifyUser), (req, res, next)=>{
    res.statusCode = 403;
    res.end("PUT operation not supported on /leaders");
})
.delete((authenticate.verifyUser), (req, res, next)=>{
    Leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
})

leaderRouter.route('/:leaderID').get((req, res, next)=>{
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((authenticate.verifyUser), (req, res, next)=>{
    res.statusCode = 403;
    res.end(`POST method not supported on ${req.params.leaderID}`);
})
.put((authenticate.verifyUser), (req, res, next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderID, {
        $set: req.body
    }, { new: true })
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((authenticate.verifyUser), (req, res, next)=>{
    Leaders.findByIdAndRemove(req.params.leaderID)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = leaderRouter;