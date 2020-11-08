let express = require("express");
let bodyParser = require("body-parser");
let leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());
leaderRouter.route('/').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
})
.get((req, res)=>{
    res.end("Will send all the leaders to you");
})

.post((req, res)=>{
    res.end(`will add the leader ${req.body.name} with details ${req.body.description}`);
})
.put((req, res)=>{
    res.statusCode = 403;
    res.end("PUT operation not supported on /leaders");
})
.delete((req, res)=>{
    res.end("Deleting all leaders");
})

leaderRouter.route('/:leaderID').get((req, res)=>{
    res.end(`Will send the details of ${req.params.leaderID}`);
})
.post((req, res)=>{
    res.statusCode = 403;
    res.end(`POST method not supported on ${req.params.leaderID}`);
})
.put((req, res)=>{
    res.write(`updating the leader ${req.params.leaderID} \n`);
    res.end(`will update the leader with name ${req.body.name} and details ${req.body.description}`);
})
.delete((req, res)=>{
    res.end(`Deleting leader ${req.params.leaderID}`);
})


module.exports = leaderRouter;