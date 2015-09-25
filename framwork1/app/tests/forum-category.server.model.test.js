'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ForumCategory = mongoose.model('ForumCategory');

/**
 * Globals
 */
var user, forumCategory;

/**
 * Unit tests
 */
describe('Forum category Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			forumCategory = new ForumCategory({
				name: 'Forum category Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return forumCategory.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			forumCategory.name = '';

			return forumCategory.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ForumCategory.remove().exec();
		User.remove().exec();

		done();
	});
});