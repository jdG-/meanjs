'use strict';

//Setting up route
angular.module('forum').config(['$stateProvider',
	function($stateProvider) {
		// Forum threads state routing
		$stateProvider.
		state('createForumThread', {
			url: '/forum-threads/create/:categoryId',
			templateUrl: 'modules/forum/views/create-forum-thread.client.view.html'
		}).
		state('viewForumThread', {
			url: '/forum-threads/:forumThreadId',
			templateUrl: 'modules/forum/views/view-forum-thread.client.view.html'
		}).
		state('editForumThread', {
			url: '/forum-threads/:forumThreadId/edit',
			templateUrl: 'modules/forum/views/edit-forum-thread.client.view.html'
		});
	}
]);
