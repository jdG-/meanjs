'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var forumReplies = require('../../app/controllers/forum-replies.server.controller');

	// Forum replies Routes
	app.route('/forum-replies')
		.get(users.requiresLogin, forumReplies.list)
		.post(users.requiresLogin, forumReplies.create);

	app.route('/forum-replies/:forumThreadId')
		.post(users.requiresLogin, forumReplies.createComment);

	app.route('/forum-replies/:forumReplyId')
		.get(users.requiresLogin, forumReplies.read)
		.put(users.requiresLogin, forumReplies.hasAuthorization, forumReplies.update)
		.delete(users.requiresLogin, forumReplies.hasAuthorization, forumReplies.delete);

	// Finish by binding the Forum reply middleware
	app.param('forumReplyId', forumReplies.forumReplyByID);
};
