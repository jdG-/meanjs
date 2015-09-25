'use strict';

angular.module('core').controller('ContactController', ['$scope', '$http', 'Authentication', 'gettextCatalog',
	function($scope, $http, Authentication, gettextCatalog) {
		$scope.auth = Authentication;
		$scope.success = false;
		$scope.error = false;

		if ($scope.auth.user) {
			$scope.contact = {
				name: $scope.auth.user.displayName,
				email: $scope.auth.user.email,
				message: $scope.message
			};
		} else {
			$scope.contact = {
				name: $scope.name,
				email: $scope.email,
				message: $scope.message
			};
		}

		$scope.sendMsg = function () {
			$http.post('/contact', $scope.contact).success(function() {
				$scope.success = true;
			}).error(function () {
				$scope.error = true;
			});
		};
	}
]);
