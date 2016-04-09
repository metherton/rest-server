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
            if (favorite.dishes.indexOf(req.body._id) == -1) {
                console.log('pusb it then ');
                favorite.dishes.push(req.body._id);
            }
            favorite.save(function (err, favorite) {
                if (err) throw err;
                console.log('Updated Favorites!');
                res.json(favorite);
            });
        });
    });

favoriteRouter.route('/:dishId')
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Favorites.findOne({postedBy: req.decoded._doc._id}, function (err, favorite) {
            if (err) throw err;
            if (favorite) {
                var dishToDelete = -1;
                for (var i = 0; i < favorite.dishes.length; i++) {
                    if (favorite.dishes[i] == req.params.dishId) {
                        dishToDelete = i;
                    }
                }
                favorite.dishes.splice(dishToDelete,1);
                favorite.save(function (err, favorite) {
                    if (err) throw err;
                    console.log('Updated Favorites!');
                    res.json(favorite);
                });
            }

        });
    });


module.exports = favoriteRouter;