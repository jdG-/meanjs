'use strict';

//Forum threads service used to communicate Forum threads REST endpoints
angular.module('forum').factory('ForumThreads', ['$resource',
	function($resource) {
		return $resource('forum-threads/:forumThreadId', { forumThreadId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
