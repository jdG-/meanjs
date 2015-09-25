'use strict';

//Setting up route
angular.module('tickets').config(['$stateProvider',
	function($stateProvider) {
		// Tickets state routing
		$stateProvider.
		state('listTickets', {
			url: '/tickets',
			templateUrl: 'modules/tickets/views/list-tickets.client.view.html'
		}).
		state('createTicket', {
			url: '/tickets/create',
			templateUrl: 'modules/tickets/views/create-ticket.client.view.html'
		}).
		state('viewTicket', {
			url: '/tickets/:ticketId',
			templateUrl: 'modules/tickets/views/view-ticket.client.view.html'
		});
	}
]);
