var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Stories = require('../models/stories');
var Verify = require('./verify');

var storyRouter = express.Router();
storyRouter.use(bodyParser.json());

storyRouter.route('/')
    .get(function (req, res, next) {
        Stories.find({}, function (err, story) {
            if (err) throw err;
            res.json(story);
        });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        console.log(req.body);
        Stories.create(req.body, function (err, story) {
            if (err) throw err;
            console.log('sprint created!');
            var id = story._id;

            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the story with id: ' + id);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Stories.remove({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

storyRouter.route('/:storyId')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Stories.findById(req.params.storyId, function (err, story) {
            if (err) throw err;
            res.json(story);
        });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Stories.findByIdAndUpdate(req.params.storyId, {
            $set: req.body
        }, {
            new: true
        }, function (err, story) {
            if (err) throw err;
            res.json(story);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Stories.findByIdAndRemove(req.params.storyId, function (err, resp) {        if (err) throw err;
            res.json(resp);
        });
    });

module.exports = storyRouter;