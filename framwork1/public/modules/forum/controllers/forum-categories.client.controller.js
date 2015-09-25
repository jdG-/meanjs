'use strict';

// Forum categories controller
angular.module('forum').controller('ForumCategoriesController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'ForumCategories',
	function($scope, $stateParams, $location, $http, Authentication, ForumCategories) {
		$scope.authentication = Authentication;

        if (Authentication.user === '' || Authentication.user === undefined || Authentication.user === null) {
            $location.path('/signin');
        }

        $http.get('/forum-categories-main').success(function (res) {
            $scope.mainCategories = res;
        }).error(function (err) {
            $scope.error = err;
        });


		// Create new Forum category
		$scope.create = function() {
			// Create new Forum category object
            var main = true;

            if ($scope.subCategory !== undefined) {
                main = false;
            }

			var forumCategory = new ForumCategories ({
				name: this.name,
                main: main,
                subCategoryId: $scope.subCategory
                // send mainCategoryId
			});

			// Redirect after save
			forumCategory.$save(function(response) {
				$location.path('forum-categories/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Forum category
		$scope.remove = function(forumCategory) {
			if ( forumCategory ) { 
				forumCategory.$remove();

				for (var i in $scope.forumCategories) {
					if ($scope.forumCategories [i] === forumCategory) {
						$scope.forumCategories.splice(i, 1);
					}
				}
				$location.path('forum-categories');
			} else {
				$scope.forumCategory.$remove(function() {
					$location.path('forum-categories');
				});
			}
		};

		// Update existing Forum category
		$scope.update = function() {
			var forumCategory = $scope.forumCategory;

			forumCategory.$update(function() {
				$location.path('forum-categories/' + forumCategory._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Forum categories
		$scope.find = function() {
			$scope.forumCategories = ForumCategories.query();
		};

		// Find existing Forum category
		$scope.findOne = function() {
			$scope.forumCategory = ForumCategories.get({ 
				forumCategoryId: $stateParams.forumCategoryId
			});
		};
	}
]);
