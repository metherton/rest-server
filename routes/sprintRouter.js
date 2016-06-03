var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Sprints = require('../models/sprints');
var Verify = require('./verify');

var sprintRouter = express.Router();
sprintRouter.use(bodyParser.json());

sprintRouter.route('/')
    .get(function (req, res, next) {
        Sprints.find({}, function (err, sprint) {
            if (err) throw err;
            res.json(sprint);
        });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        console.log(req.body);
        Sprints.create(req.body, function (err, sprint) {
            if (err) throw err;
            console.log('sprint created!');
            var id = sprint._id;

            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the sprint with id: ' + id);
            console.log(res);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Sprints.remove({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

sprintRouter.route('/:sprintId')
    .get(function (req, res, next) {
        Sprints.find({}, function (err, sprint) {
            if (err) throw err;
            console.log('sprint0', sprint[0]);
            res.json(sprint[0]);
        });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Sprints.findByIdAndUpdate(req.params.sprintId, {
            $set: req.body
        }, {
            new: true
        }, function (err, sprint) {
            if (err) throw err;
            res.json(sprint);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Sprints.findByIdAndRemove(req.params.sprintId, function (err, resp) {        if (err) throw err;
            res.json(resp);
        });
    });

module.exports = sprintRouter;