'use strict';

//Forum categories service used to communicate Forum categories REST endpoints
angular.module('forum').factory('ForumCategories', ['$resource',
	function($resource) {
		return $resource('forum-categories/:forumCategoryId', { forumCategoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
