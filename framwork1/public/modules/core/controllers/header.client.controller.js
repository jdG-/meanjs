'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$cookies', 'Authentication', 'Menus', 'gettextCatalog',
	function($scope, $cookies, Authentication, Menus, gettextCatalog) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$scope.languages = [ {
			isoCode: 'en',
			countryCode: 'gb'
		}, {
			isoCode: 'fr',
			countryCode: 'fr'
		}];

		gettextCatalog.debug = true;
		var getLang = $cookies.get('lang') ? $cookies.get('lang') : 'en';
		gettextCatalog.setCurrentLanguage(getLang);

		$scope.setLanguage = function (lang) {
			$cookies.put('lang', lang);
			gettextCatalog.setCurrentLanguage(lang);
		};

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
