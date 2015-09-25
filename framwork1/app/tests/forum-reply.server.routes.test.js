'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ForumReply = mongoose.model('ForumReply'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, forumReply;

/**
 * Forum reply routes tests
 */
describe('Forum reply CRUD tests', function() {
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

		// Save a user to the test db and create new Forum reply
		user.save(function() {
			forumReply = {
				name: 'Forum reply Name'
			};

			done();
		});
	});

	it('should be able to save Forum reply instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Forum reply
				agent.post('/forum-replies')
					.send(forumReply)
					.expect(200)
					.end(function(forumReplySaveErr, forumReplySaveRes) {
						// Handle Forum reply save error
						if (forumReplySaveErr) done(forumReplySaveErr);

						// Get a list of Forum replies
						agent.get('/forum-replies')
							.end(function(forumRepliesGetErr, forumRepliesGetRes) {
								// Handle Forum reply save error
								if (forumRepliesGetErr) done(forumRepliesGetErr);

								// Get Forum replies list
								var forumReplies = forumRepliesGetRes.body;

								// Set assertions
								(forumReplies[0].user._id).should.equal(userId);
								(forumReplies[0].name).should.match('Forum reply Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Forum reply instance if not logged in', function(done) {
		agent.post('/forum-replies')
			.send(forumReply)
			.expect(401)
			.end(function(forumReplySaveErr, forumReplySaveRes) {
				// Call the assertion callback
				done(forumReplySaveErr);
			});
	});

	it('should not be able to save Forum reply instance if no name is provided', function(done) {
		// Invalidate name field
		forumReply.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Forum reply
				agent.post('/forum-replies')
					.send(forumReply)
					.expect(400)
					.end(function(forumReplySaveErr, forumReplySaveRes) {
						// Set message assertion
						(forumReplySaveRes.body.message).should.match('Please fill Forum reply name');
						
						// Handle Forum reply save error
						done(forumReplySaveErr);
					});
			});
	});

	it('should be able to update Forum reply instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Forum reply
				agent.post('/forum-replies')
					.send(forumReply)
					.expect(200)
					.end(function(forumReplySaveErr, forumReplySaveRes) {
						// Handle Forum reply save error
						if (forumReplySaveErr) done(forumReplySaveErr);

						// Update Forum reply name
						forumReply.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Forum reply
						agent.put('/forum-replies/' + forumReplySaveRes.body._id)
							.send(forumReply)
							.expect(200)
							.end(function(forumReplyUpdateErr, forumReplyUpdateRes) {
								// Handle Forum reply update error
								if (forumReplyUpdateErr) done(forumReplyUpdateErr);

								// Set assertions
								(forumReplyUpdateRes.body._id).should.equal(forumReplySaveRes.body._id);
								(forumReplyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Forum replies if not signed in', function(done) {
		// Create new Forum reply model instance
		var forumReplyObj = new ForumReply(forumReply);

		// Save the Forum reply
		forumReplyObj.save(function() {
			// Request Forum replies
			request(app).get('/forum-replies')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Forum reply if not signed in', function(done) {
		// Create new Forum reply model instance
		var forumReplyObj = new ForumReply(forumReply);

		// Save the Forum reply
		forumReplyObj.save(function() {
			request(app).get('/forum-replies/' + forumReplyObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', forumReply.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Forum reply instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Forum reply
				agent.post('/forum-replies')
					.send(forumReply)
					.expect(200)
					.end(function(forumReplySaveErr, forumReplySaveRes) {
						// Handle Forum reply save error
						if (forumReplySaveErr) done(forumReplySaveErr);

						// Delete existing Forum reply
						agent.delete('/forum-replies/' + forumReplySaveRes.body._id)
							.send(forumReply)
							.expect(200)
							.end(function(forumReplyDeleteErr, forumReplyDeleteRes) {
								// Handle Forum reply error error
								if (forumReplyDeleteErr) done(forumReplyDeleteErr);

								// Set assertions
								(forumReplyDeleteRes.body._id).should.equal(forumReplySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Forum reply instance if not signed in', function(done) {
		// Set Forum reply user 
		forumReply.user = user;

		// Create new Forum reply model instance
		var forumReplyObj = new ForumReply(forumReply);

		// Save the Forum reply
		forumReplyObj.save(function() {
			// Try deleting Forum reply
			request(app).delete('/forum-replies/' + forumReplyObj._id)
			.expect(401)
			.end(function(forumReplyDeleteErr, forumReplyDeleteRes) {
				// Set message assertion
				(forumReplyDeleteRes.body.message).should.match('User is not logged in');

				// Handle Forum reply error error
				done(forumReplyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ForumReply.remove().exec();
		done();
	});
});