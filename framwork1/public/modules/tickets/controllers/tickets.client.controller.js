'use strict';

// Tickets controller
angular.module('tickets').controller('TicketsController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Tickets',
	function($scope, $stateParams, $http, $location, Authentication, Tickets) {
		$scope.authentication = Authentication;

	if (Authentication.user === '' || Authentication.user === undefined || Authentication.user === null) {
			$location.path('/signin');
		}

		$scope.authentication = Authentication;
        $scope.replies = [];
        $scope.close = 'all';

		// Create new Ticket
		$scope.create = function() {
			// Create new Ticket object
			var ticket = new Tickets ({
				name: this.name,
				content: this.content
			});

			// Redirect after save
			ticket.$save(function(response) {
				$location.path('tickets/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// Find a list of Tickets
		$scope.find = function() {
			$scope.tickets = Tickets.query();
		};

		// Find existing Ticket
		$scope.findOne = function() {
			$scope.ticket = Tickets.get({ 
				ticketId: $stateParams.ticketId
			});

            $http.get('/tickets/replies/' + $stateParams.ticketId).success(function (res) {
                $scope.replies = res;
            }).error(function (err) {
                $scope.error = err;
            });
		};

        // Open or Close a ticket
        $scope.openClose = function () {
            $scope.ticket.close = !$scope.ticket.close;

            var ticket = $scope.ticket;

            ticket.$update(function() {
                $location.path('tickets/' + ticket._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Submit a reply
        $scope.reply = function () {
            var content = {
                user: Authentication.user._id,
                ticketId: $stateParams.ticketId,
                content: $scope.content
            };
            $http.post('/tickets/replies/' + $stateParams.ticketId, content).success(function (res) {
                res.user = Authentication.user;
                $scope.replies.push(res);
                $scope.content = '';
            }).error(function (err) {
                $scope.error = err;
            });
        };

        $scope.findAdmins = function () {
            $http.get('/admins').success(function (res) {
                $scope.admins = res;
            }).error(function (err) {
                $scope.error = err;
            });
        };

        $scope.assign = function () {
            var ticket = $scope.ticket;
            ticket.admin = $scope.assigned;
            ticket.$update(function() {
                $location.path('tickets/' + ticket._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
	}
]);
