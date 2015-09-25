'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var forumThreads = require('../../app/controllers/forum-threads.server.controller');

	// Forum threads Routes
	app.route('/forum-threads')
		.get(users.requiresLogin, forumThreads.list)
		.post(users.requiresLogin, forumThreads.create);

	app.route('/forum-threads/:forumThreadId')
		.get(users.requiresLogin, forumThreads.read)
		.put(users.requiresLogin, forumThreads.hasAuthorization, forumThreads.update)
		.delete(users.requiresLogin, forumThreads.hasAuthorization, forumThreads.delete);

	// Finish by binding the Forum thread middleware
	app.param('forumThreadId', forumThreads.forumThreadByID);
};
