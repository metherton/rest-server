var express = require('express');
var router = express.Router();
var Verify    = require('./verify');

/* GET home page. */
//router.get('/*', Verify.verifyOrdinaryUser, function(req, res, next) {
  router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
