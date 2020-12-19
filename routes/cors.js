let express = require('express');
let cors = require('cors');
let app = express();

let whiteList = ['http://localhost:3000', 'https://localhost:3443'];
let corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if(whiteList.indexOf(req.header('Origin')) !== -1){
        corsOptions = { origin: true };
    }
    else{
        corsOptions = { origin: false };
    }
}

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);