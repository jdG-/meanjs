'use strict';

(function() {
	// Forum categories Controller Spec
	describe('Forum categories Controller Tests', function() {
		// Initialize global variables
		var ForumCategoriesController,
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

			// Initialize the Forum categories controller.
			ForumCategoriesController = $controller('ForumCategoriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Forum category object fetched from XHR', inject(function(ForumCategories) {
			// Create sample Forum category using the Forum categories service
			var sampleForumCategory = new ForumCategories({
				name: 'New Forum category'
			});

			// Create a sample Forum categories array that includes the new Forum category
			var sampleForumCategories = [sampleForumCategory];

			// Set GET response
			$httpBackend.expectGET('forum-categories').respond(sampleForumCategories);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.forumCategories).toEqualData(sampleForumCategories);
		}));

		it('$scope.findOne() should create an array with one Forum category object fetched from XHR using a forumCategoryId URL parameter', inject(function(ForumCategories) {
			// Define a sample Forum category object
			var sampleForumCategory = new ForumCategories({
				name: 'New Forum category'
			});

			// Set the URL parameter
			$stateParams.forumCategoryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/forum-categories\/([0-9a-fA-F]{24})$/).respond(sampleForumCategory);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.forumCategory).toEqualData(sampleForumCategory);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ForumCategories) {
			// Create a sample Forum category object
			var sampleForumCategoryPostData = new ForumCategories({
				name: 'New Forum category'
			});

			// Create a sample Forum category response
			var sampleForumCategoryResponse = new ForumCategories({
				_id: '525cf20451979dea2c000001',
				name: 'New Forum category'
			});

			// Fixture mock form input values
			scope.name = 'New Forum category';

			// Set POST response
			$httpBackend.expectPOST('forum-categories', sampleForumCategoryPostData).respond(sampleForumCategoryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Forum category was created
			expect($location.path()).toBe('/forum-categories/' + sampleForumCategoryResponse._id);
		}));

		it('$scope.update() should update a valid Forum category', inject(function(ForumCategories) {
			// Define a sample Forum category put data
			var sampleForumCategoryPutData = new ForumCategories({
				_id: '525cf20451979dea2c000001',
				name: 'New Forum category'
			});

			// Mock Forum category in scope
			scope.forumCategory = sampleForumCategoryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/forum-categories\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/forum-categories/' + sampleForumCategoryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid forumCategoryId and remove the Forum category from the scope', inject(function(ForumCategories) {
			// Create new Forum category object
			var sampleForumCategory = new ForumCategories({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Forum categories array and include the Forum category
			scope.forumCategories = [sampleForumCategory];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/forum-categories\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleForumCategory);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.forumCategories.length).toBe(0);
		}));
	});
}());