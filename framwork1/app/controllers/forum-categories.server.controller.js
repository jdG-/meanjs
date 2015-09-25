'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ForumCategory = mongoose.model('ForumCategory'),
	ForumThread = mongoose.model('ForumThread'),
	ForumReply = mongoose.model('ForumReply'),
	_ = require('lodash');

/**
 * Create a Forum category
 */
exports.create = function(req, res) {

    var mainCategoryId = req.body.subCategoryId;

    delete req.body.subCategoryId;

    var forumCategory = new ForumCategory(req.body);
	forumCategory.user = req.user;

	forumCategory.save(function(err, doc) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            if (mainCategoryId) {
                ForumCategory.findByIdAndUpdate({_id: mainCategoryId}, {$push: {subCategories: doc._id}}, function (err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        res.jsonp(forumCategory);
                    }
                });
            } else {
                res.jsonp(forumCategory);
            }
		}
	});
};

/**
 * Show the current Forum category
 */
exports.read = function(req, res) {
    ForumCategory.findOne({_id: req.forumCategory._id}).populate('user').populate('subCategories').deepPopulate('subCategories.user').populate('threads').exec(function(err, category) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
			ForumThread.find({categoryId: category._id}).populate('user').populate('replies').exec(function (err, threads) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					category.threads = threads;
					res.jsonp(category);
				}
			});
        }
    });
};

/**
 * Update a Forum category
 */
exports.update = function(req, res) {
	var forumCategory = req.forumCategory ;

	forumCategory = _.extend(forumCategory , req.body);

    ForumCategory.findByIdAndUpdate({ _id: forumCategory._id}, {$set: {name: req.body.name}}, function(err, category) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(category);
        }
    });
};

/**
 * Delete an Forum category
 */
exports.delete = function(req, res) {
	var forumCategory = req.forumCategory ;

	ForumReply.remove({category: forumCategory._id}, function(err){
		ForumThread.remove({categoryId: forumCategory._id}, function(err){
			forumCategory.subCategories.forEach(function(elem, index, array) {
				ForumCategory.remove({_id: elem}, function(err){
					ForumReply.remove({category: elem}, function(err) {
						ForumThread.remove({categoryId: elem}, function (err) {
						});
					});
				});
			});
		});
	});



	forumCategory.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(forumCategory);
		}
	});
};

/**
 * List of Forum categories
 */
exports.list = function(req, res) { 
	ForumCategory.find({main: true}).sort('-created').populate('user', 'displayName').exec(function(err, forumCategories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(forumCategories);
		}
	});
};

exports.listMain = function (req, res) {
    ForumCategory.find({main: true}).sort('-created').exec(function(err, forumCategories) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(forumCategories);
        }
    });
};

/**
 * Forum category middleware
 */
exports.forumCategoryByID = function(req, res, next, id) { 
	ForumCategory.findById(id).populate('user', 'displayName').exec(function(err, forumCategory) {
		if (err) return next(err);
		if (! forumCategory) return next(new Error('Failed to load Forum category ' + id));
		req.forumCategory = forumCategory ;
		next();
	});
};

/**
 * Forum category authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.forumCategory.user.id !== req.user.id && req.user.roles.indexOf('admin') === -1) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
