'use strict';

(function() {
	// Forum threads Controller Spec
	describe('Forum threads Controller Tests', function() {
		// Initialize global variables
		var ForumThreadsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Forum threads controller.
			ForumThreadsController = $controller('ForumThreadsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Forum thread object fetched from XHR', inject(function(ForumThreads) {
			// Create sample Forum thread using the Forum threads service
			var sampleForumThread = new ForumThreads({
				name: 'New Forum thread'
			});

			// Create a sample Forum threads array that includes the new Forum thread
			var sampleForumThreads = [sampleForumThread];

			// Set GET response
			$httpBackend.expectGET('forum-threads').respond(sampleForumThreads);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.forumThreads).toEqualData(sampleForumThreads);
		}));

		it('$scope.findOne() should create an array with one Forum thread object fetched from XHR using a forumThreadId URL parameter', inject(function(ForumThreads) {
			// Define a sample Forum thread object
			var sampleForumThread = new ForumThreads({
				name: 'New Forum thread'
			});

			// Set the URL parameter
			$stateParams.forumThreadId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/forum-threads\/([0-9a-fA-F]{24})$/).respond(sampleForumThread);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.forumThread).toEqualData(sampleForumThread);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ForumThreads) {
			// Create a sample Forum thread object
			var sampleForumThreadPostData = new ForumThreads({
				name: 'New Forum thread'
			});

			// Create a sample Forum thread response
			var sampleForumThreadResponse = new ForumThreads({
				_id: '525cf20451979dea2c000001',
				name: 'New Forum thread'
			});

			// Fixture mock form input values
			scope.name = 'New Forum thread';

			// Set POST response
			$httpBackend.expectPOST('forum-threads', sampleForumThreadPostData).respond(sampleForumThreadResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Forum thread was created
			expect($location.path()).toBe('/forum-threads/' + sampleForumThreadResponse._id);
		}));

		it('$scope.update() should update a valid Forum thread', inject(function(ForumThreads) {
			// Define a sample Forum thread put data
			var sampleForumThreadPutData = new ForumThreads({
				_id: '525cf20451979dea2c000001',
				name: 'New Forum thread'
			});

			// Mock Forum thread in scope
			scope.forumThread = sampleForumThreadPutData;

			// Set PUT response
			$httpBackend.expectPUT(/forum-threads\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/forum-threads/' + sampleForumThreadPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid forumThreadId and remove the Forum thread from the scope', inject(function(ForumThreads) {
			// Create new Forum thread object
			var sampleForumThread = new ForumThreads({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Forum threads array and include the Forum thread
			scope.forumThreads = [sampleForumThread];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/forum-threads\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleForumThread);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.forumThreads.length).toBe(0);
		}));
	});
}());