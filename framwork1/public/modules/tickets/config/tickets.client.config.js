'use strict';

// Configuring the Articles module
angular.module('tickets').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tickets', 'tickets', 'dropdown', '/tickets(/create)?');
		Menus.addSubMenuItem('topbar', 'tickets', 'List Tickets', 'tickets');
		Menus.addSubMenuItem('topbar', 'tickets', 'New Ticket', 'tickets/create');
	}
]);