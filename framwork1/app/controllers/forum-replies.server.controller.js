'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ForumReply = mongoose.model('ForumReply'),
	ForumThread = mongoose.model('ForumThread'),
	_ = require('lodash');

/**
 * Create a Forum reply
 */
exports.create = function(req, res) {
	var threadId = req.body.thread;

	//delete req.body.threadId;

	var forumReply = new ForumReply(req.body);
	forumReply.user = req.user;

	forumReply.save(function(err, doc) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            ForumThread.findByIdAndUpdate({_id: threadId}, {$push: {replies: doc._id}}, function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(forumReply);
                }
            });
		}
	});
};

/**
 * Create a Forum comment
 */
exports.createComment = function(req, res) {
	var replyId = req.body.replyId;

	delete req.body.replyId;

	var forumComment = new ForumReply(req.body);
	forumComment.user = req.user;

	forumComment.save(function (err, doc) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			ForumReply.findByIdAndUpdate({_id: replyId}, {$push: {comments: doc._id}}, function (err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(forumComment);
				}
			});
		}
	});
};

/**
 * Show the current Forum reply
 */
exports.read = function(req, res) {
	res.jsonp(req.forumReply);
};

/**
 * Update a Forum reply
 */
exports.update = function(req, res) {
	var forumReply = req.forumReply ;

	forumReply = _.extend(forumReply , req.body);

	forumReply.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(forumReply);
		}
	});
};

/**
 * Delete an Forum reply
 */
exports.delete = function(req, res) {
	var forumReply = req.forumReply ;

	forumReply.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(forumReply);
		}
	});
};

/**
 * List of Forum replies
 */
exports.list = function(req, res) { 
	ForumReply.find().sort('-created').populate('user', 'displayName').exec(function(err, forumReplies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(forumReplies);
		}
	});
};

/**
 * Forum reply middleware
 */
exports.forumReplyByID = function(req, res, next, id) { 
	ForumReply.findById(id).populate('user', 'displayName').exec(function(err, forumReply) {
		if (err) return next(err);
		if (! forumReply) return next(new Error('Failed to load Forum reply ' + id));
		req.forumReply = forumReply ;
		next();
	});
};

/**
 * Forum reply authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.forumCategory.user.id !== req.user.id && req.user.roles.indexOf('admin') === -1) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
