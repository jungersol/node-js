/*
var express = require('express');
var router = express.Router();

const config = require("../config/index");

*/

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', config });
});

module.exports = router;
*/

var express = require("express");
var router = express.Router();

const fs = require("fs");

let routes = fs.readdirSync(__dirname);

for(let route of routes){
  if(route.includes(".js") && route != "index.js"){
    //console.log(route)
    //console.log(__dirname);
    router.use("/"+route.replace(".js",""), require("./"+route));

  }
}

module.exports = router;