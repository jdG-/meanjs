'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ticket = mongoose.model('Ticket'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, ticket;

/**
 * Ticket routes tests
 */
describe('Ticket CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Ticket
		user.save(function() {
			ticket = {
				name: 'Ticket Name'
			};

			done();
		});
	});

	it('should be able to save Ticket instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ticket
				agent.post('/tickets')
					.send(ticket)
					.expect(200)
					.end(function(ticketSaveErr, ticketSaveRes) {
						// Handle Ticket save error
						if (ticketSaveErr) done(ticketSaveErr);

						// Get a list of Tickets
						agent.get('/tickets')
							.end(function(ticketsGetErr, ticketsGetRes) {
								// Handle Ticket save error
								if (ticketsGetErr) done(ticketsGetErr);

								// Get Tickets list
								var tickets = ticketsGetRes.body;

								// Set assertions
								(tickets[0].user._id).should.equal(userId);
								(tickets[0].name).should.match('Ticket Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Ticket instance if not logged in', function(done) {
		agent.post('/tickets')
			.send(ticket)
			.expect(401)
			.end(function(ticketSaveErr, ticketSaveRes) {
				// Call the assertion callback
				done(ticketSaveErr);
			});
	});

	it('should not be able to save Ticket instance if no name is provided', function(done) {
		// Invalidate name field
		ticket.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ticket
				agent.post('/tickets')
					.send(ticket)
					.expect(400)
					.end(function(ticketSaveErr, ticketSaveRes) {
						// Set message assertion
						(ticketSaveRes.body.message).should.match('Please fill Ticket name');
						
						// Handle Ticket save error
						done(ticketSaveErr);
					});
			});
	});

	it('should be able to update Ticket instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ticket
				agent.post('/tickets')
					.send(ticket)
					.expect(200)
					.end(function(ticketSaveErr, ticketSaveRes) {
						// Handle Ticket save error
						if (ticketSaveErr) done(ticketSaveErr);

						// Update Ticket name
						ticket.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Ticket
						agent.put('/tickets/' + ticketSaveRes.body._id)
							.send(ticket)
							.expect(200)
							.end(function(ticketUpdateErr, ticketUpdateRes) {
								// Handle Ticket update error
								if (ticketUpdateErr) done(ticketUpdateErr);

								// Set assertions
								(ticketUpdateRes.body._id).should.equal(ticketSaveRes.body._id);
								(ticketUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tickets if not signed in', function(done) {
		// Create new Ticket model instance
		var ticketObj = new Ticket(ticket);

		// Save the Ticket
		ticketObj.save(function() {
			// Request Tickets
			request(app).get('/tickets')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Ticket if not signed in', function(done) {
		// Create new Ticket model instance
		var ticketObj = new Ticket(ticket);

		// Save the Ticket
		ticketObj.save(function() {
			request(app).get('/tickets/' + ticketObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', ticket.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Ticket instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ticket
				agent.post('/tickets')
					.send(ticket)
					.expect(200)
					.end(function(ticketSaveErr, ticketSaveRes) {
						// Handle Ticket save error
						if (ticketSaveErr) done(ticketSaveErr);

						// Delete existing Ticket
						agent.delete('/tickets/' + ticketSaveRes.body._id)
							.send(ticket)
							.expect(200)
							.end(function(ticketDeleteErr, ticketDeleteRes) {
								// Handle Ticket error error
								if (ticketDeleteErr) done(ticketDeleteErr);

								// Set assertions
								(ticketDeleteRes.body._id).should.equal(ticketSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Ticket instance if not signed in', function(done) {
		// Set Ticket user 
		ticket.user = user;

		// Create new Ticket model instance
		var ticketObj = new Ticket(ticket);

		// Save the Ticket
		ticketObj.save(function() {
			// Try deleting Ticket
			request(app).delete('/tickets/' + ticketObj._id)
			.expect(401)
			.end(function(ticketDeleteErr, ticketDeleteRes) {
				// Set message assertion
				(ticketDeleteRes.body.message).should.match('User is not logged in');

				// Handle Ticket error error
				done(ticketDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Ticket.remove().exec();
		done();
	});
});