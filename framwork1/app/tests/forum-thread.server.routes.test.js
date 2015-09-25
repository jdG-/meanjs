'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ForumThread = mongoose.model('ForumThread'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, forumThread;

/**
 * Forum thread routes tests
 */
describe('Forum thread CRUD tests', function() {
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

		// Save a user to the test db and create new Forum thread
		user.save(function() {
			forumThread = {
				name: 'Forum thread Name'
			};

			done();
		});
	});

	it('should be able to save Forum thread instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Forum thread
				agent.post('/forum-threads')
					.send(forumThread)
					.expect(200)
					.end(function(forumThreadSaveErr, forumThreadSaveRes) {
						// Handle Forum thread save error
						if (forumThreadSaveErr) done(forumThreadSaveErr);

						// Get a list of Forum threads
						agent.get('/forum-threads')
							.end(function(forumThreadsGetErr, forumThreadsGetRes) {
								// Handle Forum thread save error
								if (forumThreadsGetErr) done(forumThreadsGetErr);

								// Get Forum threads list
								var forumThreads = forumThreadsGetRes.body;

								// Set assertions
								(forumThreads[0].user._id).should.equal(userId);
								(forumThreads[0].name).should.match('Forum thread Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Forum thread instance if not logged in', function(done) {
		agent.post('/forum-threads')
			.send(forumThread)
			.expect(401)
			.end(function(forumThreadSaveErr, forumThreadSaveRes) {
				// Call the assertion callback
				done(forumThreadSaveErr);
			});
	});

	it('should not be able to save Forum thread instance if no name is provided', function(done) {
		// Invalidate name field
		forumThread.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Forum thread
				agent.post('/forum-threads')
					.send(forumThread)
					.expect(400)
					.end(function(forumThreadSaveErr, forumThreadSaveRes) {
						// Set message assertion
						(forumThreadSaveRes.body.message).should.match('Please fill Forum thread name');
						
						// Handle Forum thread save error
						done(forumThreadSaveErr);
					});
			});
	});

	it('should be able to update Forum thread instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Forum thread
				agent.post('/forum-threads')
					.send(forumThread)
					.expect(200)
					.end(function(forumThreadSaveErr, forumThreadSaveRes) {
						// Handle Forum thread save error
						if (forumThreadSaveErr) done(forumThreadSaveErr);

						// Update Forum thread name
						forumThread.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Forum thread
						agent.put('/forum-threads/' + forumThreadSaveRes.body._id)
							.send(forumThread)
							.expect(200)
							.end(function(forumThreadUpdateErr, forumThreadUpdateRes) {
								// Handle Forum thread update error
								if (forumThreadUpdateErr) done(forumThreadUpdateErr);

								// Set assertions
								(forumThreadUpdateRes.body._id).should.equal(forumThreadSaveRes.body._id);
								(forumThreadUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Forum threads if not signed in', function(done) {
		// Create new Forum thread model instance
		var forumThreadObj = new ForumThread(forumThread);

		// Save the Forum thread
		forumThreadObj.save(function() {
			// Request Forum threads
			request(app).get('/forum-threads')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Forum thread if not signed in', function(done) {
		// Create new Forum thread model instance
		var forumThreadObj = new ForumThread(forumThread);

		// Save the Forum thread
		forumThreadObj.save(function() {
			request(app).get('/forum-threads/' + forumThreadObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', forumThread.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Forum thread instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Forum thread
				agent.post('/forum-threads')
					.send(forumThread)
					.expect(200)
					.end(function(forumThreadSaveErr, forumThreadSaveRes) {
						// Handle Forum thread save error
						if (forumThreadSaveErr) done(forumThreadSaveErr);

						// Delete existing Forum thread
						agent.delete('/forum-threads/' + forumThreadSaveRes.body._id)
							.send(forumThread)
							.expect(200)
							.end(function(forumThreadDeleteErr, forumThreadDeleteRes) {
								// Handle Forum thread error error
								if (forumThreadDeleteErr) done(forumThreadDeleteErr);

								// Set assertions
								(forumThreadDeleteRes.body._id).should.equal(forumThreadSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Forum thread instance if not signed in', function(done) {
		// Set Forum thread user 
		forumThread.user = user;

		// Create new Forum thread model instance
		var forumThreadObj = new ForumThread(forumThread);

		// Save the Forum thread
		forumThreadObj.save(function() {
			// Try deleting Forum thread
			request(app).delete('/forum-threads/' + forumThreadObj._id)
			.expect(401)
			.end(function(forumThreadDeleteErr, forumThreadDeleteRes) {
				// Set message assertion
				(forumThreadDeleteRes.body.message).should.match('User is not logged in');

				// Handle Forum thread error error
				done(forumThreadDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ForumThread.remove().exec();
		done();
	});
});