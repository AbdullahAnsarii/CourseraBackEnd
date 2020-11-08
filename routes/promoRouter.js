//params is in link parameter after :
let express = require("express");
let bodyParser = require("body-parser");
let promoRouter = express.Router();
promoRouter.use(bodyParser.json());
promoRouter.route('/').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
})
.get((req, res)=>{
    res.end("Will send all the promotions to you");
})

.post((req, res)=>{
    res.end(`will add the promotion ${req.body.name} with details ${req.body.description}`);
})
.put((req, res)=>{
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
})
.delete((req, res)=>{
    res.end("Deleting all promotions");
})

promoRouter.route('/:promoID').get((req, res)=>{
    res.end(`Will send the details of ${req.params.promoID}`);
})
.post((req, res)=>{
    res.statusCode = 403;
    res.end(`POST method not supported on ${req.params.promoID}`);
})
.put((req, res)=>{
    res.write(`updating the promotion ${req.params.promoID} \n`);
    res.end(`will update the promotion with name ${req.body.name} and details ${req.body.description}`);
})
.delete((req, res)=>{
    res.end(`Deleting promotion ${req.params.promoID}`);
})


module.exports = promoRouter;