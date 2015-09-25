'use strict';

//Forum replies service used to communicate Forum replies REST endpoints
angular.module('forum').factory('ForumReplies', ['$resource',
	function($resource) {
		return $resource('forum-replies/:forumReplyId', { forumReplyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
