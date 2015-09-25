'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ForumCategory = mongoose.model('ForumCategory'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, forumCategory;

/**
 * Forum category routes tests
 */
describe('Forum category CRUD tests', function() {
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

		// Save a user to the test db and create new Forum category
		user.save(function() {
			forumCategory = {
				name: 'Forum category Name'
			};

			done();
		});
	});

	it('should be able to save Forum category instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Forum category
				agent.post('/forum-categories')
					.send(forumCategory)
					.expect(200)
					.end(function(forumCategorySaveErr, forumCategorySaveRes) {
						// Handle Forum category save error
						if (forumCategorySaveErr) done(forumCategorySaveErr);

						// Get a list of Forum categories
						agent.get('/forum-categories')
							.end(function(forumCategoriesGetErr, forumCategoriesGetRes) {
								// Handle Forum category save error
								if (forumCategoriesGetErr) done(forumCategoriesGetErr);

								// Get Forum categories list
								var forumCategories = forumCategoriesGetRes.body;

								// Set assertions
								(forumCategories[0].user._id).should.equal(userId);
								(forumCategories[0].name).should.match('Forum category Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Forum category instance if not logged in', function(done) {
		agent.post('/forum-categories')
			.send(forumCategory)
			.expect(401)
			.end(function(forumCategorySaveErr, forumCategorySaveRes) {
				// Call the assertion callback
				done(forumCategorySaveErr);
			});
	});

	it('should not be able to save Forum category instance if no name is provided', function(done) {
		// Invalidate name field
		forumCategory.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Forum category
				agent.post('/forum-categories')
					.send(forumCategory)
					.expect(400)
					.end(function(forumCategorySaveErr, forumCategorySaveRes) {
						// Set message assertion
						(forumCategorySaveRes.body.message).should.match('Please fill Forum category name');
						
						// Handle Forum category save error
						done(forumCategorySaveErr);
					});
			});
	});

	it('should be able to update Forum category instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Forum category
				agent.post('/forum-categories')
					.send(forumCategory)
					.expect(200)
					.end(function(forumCategorySaveErr, forumCategorySaveRes) {
						// Handle Forum category save error
						if (forumCategorySaveErr) done(forumCategorySaveErr);

						// Update Forum category name
						forumCategory.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Forum category
						agent.put('/forum-categories/' + forumCategorySaveRes.body._id)
							.send(forumCategory)
							.expect(200)
							.end(function(forumCategoryUpdateErr, forumCategoryUpdateRes) {
								// Handle Forum category update error
								if (forumCategoryUpdateErr) done(forumCategoryUpdateErr);

								// Set assertions
								(forumCategoryUpdateRes.body._id).should.equal(forumCategorySaveRes.body._id);
								(forumCategoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Forum categories if not signed in', function(done) {
		// Create new Forum category model instance
		var forumCategoryObj = new ForumCategory(forumCategory);

		// Save the Forum category
		forumCategoryObj.save(function() {
			// Request Forum categories
			request(app).get('/forum-categories')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Forum category if not signed in', function(done) {
		// Create new Forum category model instance
		var forumCategoryObj = new ForumCategory(forumCategory);

		// Save the Forum category
		forumCategoryObj.save(function() {
			request(app).get('/forum-categories/' + forumCategoryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', forumCategory.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Forum category instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Forum category
				agent.post('/forum-categories')
					.send(forumCategory)
					.expect(200)
					.end(function(forumCategorySaveErr, forumCategorySaveRes) {
						// Handle Forum category save error
						if (forumCategorySaveErr) done(forumCategorySaveErr);

						// Delete existing Forum category
						agent.delete('/forum-categories/' + forumCategorySaveRes.body._id)
							.send(forumCategory)
							.expect(200)
							.end(function(forumCategoryDeleteErr, forumCategoryDeleteRes) {
								// Handle Forum category error error
								if (forumCategoryDeleteErr) done(forumCategoryDeleteErr);

								// Set assertions
								(forumCategoryDeleteRes.body._id).should.equal(forumCategorySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Forum category instance if not signed in', function(done) {
		// Set Forum category user 
		forumCategory.user = user;

		// Create new Forum category model instance
		var forumCategoryObj = new ForumCategory(forumCategory);

		// Save the Forum category
		forumCategoryObj.save(function() {
			// Try deleting Forum category
			request(app).delete('/forum-categories/' + forumCategoryObj._id)
			.expect(401)
			.end(function(forumCategoryDeleteErr, forumCategoryDeleteRes) {
				// Set message assertion
				(forumCategoryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Forum category error error
				done(forumCategoryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ForumCategory.remove().exec();
		done();
	});
});