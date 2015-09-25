'use strict';

angular.module('users').controller('AdminController', ['$scope', 'Users', 'Groups', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, Users, Groups, $stateParams, $http, $location, Authentication) {
		// Find all groups

		$scope.authentication = Authentication;

		$scope.groups = Groups.query();

		$scope.users = '';

		// Find a list of Users
		$scope.find = function() {
			$scope.users = Users.query();
		};

		// Find existing User
		$scope.findOne = function() {
			$http.get('/user/' + $stateParams.userId).success(function (res) {
				$scope.userToUpdate = res;
				$scope.isAdmin = $scope.userToUpdate.roles.indexOf('admin') !== -1;
			}).error(function (err) {
				$scope.error = err;
			});
		};

		// Update existing User
		$scope.update = function() {
			$scope.success = $scope.error = null;

			var user = new Users($scope.userToUpdate);

			if ($scope.isAdmin === true) {
				user.roles.push('admin');
			} else {
				var i = user.roles.indexOf('admin');
				if (i !== -1) {
					user.roles.splice(i, 1);
				}
			}
			$http.put('/user/' + $stateParams.userId, user).success(function (res) {

				if ($scope.authentication.user._id === res._id) {
					$scope.authentication.user = res;
				}

				$location.path('/user/list');
			}).error(function (err) {
				$scope.error = err.message;
			});
		};

		$scope.delete = function (id) {
			$http.delete('/user/' + id).success(function (res) {
				for (var i in $scope.users) {
					if ($scope.users[i]._id === id) {
						$scope.users.splice(i, 1);
					}
				}
				$location.path('/user/list');

			}).error(function (err) {
				$scope.error = err;
			});
		};
	}
]);
