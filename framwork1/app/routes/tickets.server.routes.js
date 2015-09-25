'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tickets = require('../../app/controllers/tickets.server.controller');

	// Tickets Routes
	app.route('/tickets')
		.get(users.requiresLogin, tickets.list)
		.post(users.requiresLogin, tickets.create);

	app.route('/tickets/:ticketId')
		.get(users.requiresLogin, tickets.read)
		.put(users.requiresLogin, tickets.hasAuthorization, tickets.update);

    app.route('/tickets/replies/:ticketId')
        .get(users.requiresLogin, tickets.hasAuthorization, tickets.getReplies)
        .post(users.requiresLogin, tickets.hasAuthorization, tickets.createReply);

	// Finish by binding the Ticket middleware
	app.param('ticketId', tickets.ticketByID);
};
