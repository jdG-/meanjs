'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'gettextCatalog',
	function($scope, $http, $location, Authentication, gettextCatalog) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			if ($scope.userForm.firstName.$viewValue !== undefined && $scope.userForm.lastName.$viewValue !== undefined && $scope.userForm.email.$viewValue !== undefined && $scope.userForm.username.$viewValue !== undefined && $scope.userForm.password.$viewValue !== undefined && $scope.userForm.firstName.$error.required === undefined && $scope.userForm.lastName.$error.required === undefined && $scope.userForm.email.$error.pattern === undefined && $scope.userForm.password.$error.minlength === undefined && $scope.userForm.username.$error.required === undefined) {
				$http.post('/auth/signup', $scope.credentials).success(function(response) {
					// If successful we assign the response to the global user model
					$scope.authentication.user = response;

					// And redirect to the index page
					$location.path('/');
				}).error(function(response) {
					$scope.error = response.message;
				});
			} else if ($scope.userForm.firstName.$error.required === true || $scope.userForm.firstName.$viewValue === undefined) {
				$scope.error = gettextCatalog.getString('A first name is required');
			} else if ($scope.userForm.lastName.$error.required === true || $scope.userForm.lastName.$viewValue === undefined) {
				$scope.error = gettextCatalog.getString('A last name is required');
			} else if ($scope.userForm.email.$error.pattern === true || $scope.userForm.email.$viewValue === undefined) {
				$scope.error = gettextCatalog.getString('Email address is not valid');
			} else if ($scope.userForm.username.$error.required === true || $scope.userForm.username.$viewValue === undefined) {
				$scope.error = gettextCatalog.getString('An username is required');
			} else if ($scope.userForm.password.$error.minlength === true || $scope.userForm.password.$viewValue === undefined) {
				$scope.error = gettextCatalog.getString('Password should be longer');
			}
		};

		$scope.signin = function() {
			if ($scope.signinForm.username.$viewValue !== undefined && $scope.signinForm.password.$viewValue !== undefined&& $scope.signinForm.password.$error.minlength === undefined && $scope.signinForm.username.$error.required === undefined) {
				$http.post('/auth/signin', $scope.credentials).success(function (response) {
					// If successful we assign the response to the global user model
					$scope.authentication.user = response;

					// And redirect to the index page
					$location.path('/');
				}).error(function (response) {
					$scope.error = response.message;
				});
			} else if ($scope.signinForm.username.$error.required === true || $scope.signinForm.username.$viewValue === undefined) {
				$scope.error = gettextCatalog.getString('An username is required');
			} else if ($scope.signinForm.password.$error.minlength === true || $scope.signinForm.password.$viewValue === undefined) {
				$scope.error = gettextCatalog.getString('Password should be longer');
			}
		};
	}
]);
