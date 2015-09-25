'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ForumThread = mongoose.model('ForumThread'),
    ForumCategory = mongoose.model('ForumCategory'),
	ForumReply = mongoose.model('ForumReply'),
	_ = require('lodash');

/**
 * Create a Forum thread
 */
exports.create = function(req, res) {
	var forumThread = new ForumThread(req.body);
	forumThread.user = req.user;

	forumThread.save(function(err, doc) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
        } else {
            ForumCategory.findByIdAndUpdate({_id: req.body.categoryId}, {$push: {threads: doc._id}}, function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {

                    res.jsonp(forumThread);
                }
            });
        }
	});
};

/**
 * Show the current Forum thread
 */
exports.read = function(req, res) {
    ForumThread.findOne({_id: req.forumThread._id}).populate('user').populate('replies').deepPopulate('replies.comments').exec(function(err, thread) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
			ForumReply.find({thread: thread._id}).populate('user').populate('comments').deepPopulate('comments.user').exec(function (err, replies) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					thread.replies = replies;
					res.jsonp(thread);
				}
			});
        }
    });
};

/**
 * Update a Forum thread
 */
exports.update = function(req, res) {
	var forumThread = req.forumThread ;

	forumThread = _.extend(forumThread , req.body);

	forumThread.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(forumThread);
		}
	});
};

/**
 * Delete an Forum thread
 */
exports.delete = function(req, res) {
	var forumThread = req.forumThread ;

    ForumReply.remove({thread: req.forumThread._id}, function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            forumThread.remove(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(forumThread);
                }
            });
        }
    });

};

/**
 * List of Forum threads
 */
exports.list = function(req, res) { 
	ForumThread.find().sort('-created').populate('user', 'displayName').exec(function(err, forumThreads) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(forumThreads);
		}
	});
};

/**
 * Forum thread middleware
 */
exports.forumThreadByID = function(req, res, next, id) { 
	ForumThread.findById(id).populate('user', 'displayName').exec(function(err, forumThread) {
		if (err) return next(err);
		if (! forumThread) return next(new Error('Failed to load Forum thread ' + id));
		req.forumThread = forumThread ;
		next();
	});
};

/**
 * Forum thread authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    console.log(req.user);
    console.log(req.forumCategory);
	if (req.forumThread.user.id !== req.user.id  && req.user.roles.indexOf('admin') === -1) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
