'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var forumCategories = require('../../app/controllers/forum-categories.server.controller');

	// Forum categories Routes
    app.route('/forum-categories-main')
        .get(users.requiresLogin, forumCategories.listMain);

	app.route('/forum-categories')
		.get(users.requiresLogin, forumCategories.list)
		.post(users.requiresLogin, users.isAdmin, forumCategories.create);

	app.route('/forum-categories/:forumCategoryId')
		.get(users.requiresLogin, forumCategories.read)
		.put(users.requiresLogin, forumCategories.hasAuthorization, forumCategories.update)
		.delete(users.requiresLogin, forumCategories.hasAuthorization, forumCategories.delete);

	// Finish by binding the Forum category middleware
	app.param('forumCategoryId', forumCategories.forumCategoryByID);
};
