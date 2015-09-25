'use strict';

//Setting up route
angular.module('forum').config(['$stateProvider',
	function($stateProvider) {
		// Forum categories state routing
		$stateProvider.
		state('listForumCategories', {
			url: '/forum-categories',
			templateUrl: 'modules/forum/views/list-forum-categories.client.view.html'
		}).
		state('createForumCategory', {
			url: '/forum-categories/create',
			templateUrl: 'modules/forum/views/create-forum-category.client.view.html'
		}).
		state('viewForumCategory', {
			url: '/forum-categories/:forumCategoryId',
			templateUrl: 'modules/forum/views/view-forum-category.client.view.html'
		}).
		state('editForumCategory', {
			url: '/forum-categories/:forumCategoryId/edit',
			templateUrl: 'modules/forum/views/edit-forum-category.client.view.html'
		});
	}
]);
