var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findOne({postedBy: req.decoded._doc._id})
            .populate('postedBy')
            .populate('dishes')
            .exec(function (err, favorite) {
                if (err) throw err;
                res.json(favorite);
            });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Favorites.findOne({postedBy: req.decoded._doc._id}, function (err, favorite) {
            if (err) throw err;
            req.body.postedBy = req.decoded._doc._id;
            if (!favorite) {
                favorite = new Favorites();
                favorite.postedBy = req.body.postedBy;
            }
            if (!req.body in favorite.dishes) {
                favorite.dishes.push(req.body);
            }
            favorite.save(function (err, favorite) {
                if (err) throw err;
                console.log('Updated Favorites!');
                res.json(favorite);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Favorites.remove({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

favoriteRouter.route('/:favoriteId')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findById(req.params.favoriteId)
            .populate('postedBy')
            .populate('dishes')
            .exec(function (err, dish) {
                if (err) throw err;
                res.json(dish);
            });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Favorites.findByIdAndUpdate(req.params.favoriteId, {
            $set: req.body
        }, {
            new: true
        }, function (err, favorite) {
            if (err) throw err;
            res.json(favorite);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Favorites.findByIdAndRemove(req.params.favoriteId, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });


module.exports = favoriteRouter;