'use strict';

// Configuring the Articles module
angular.module('forum').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Forum', 'forum', 'dropdown', '/forum-categories(/create)?');
        Menus.addSubMenuItem('topbar', 'forum', 'List Categories', 'forum-categories');
        Menus.addSubMenuItem('topbar', 'forum', 'New Category', 'forum-categories/create', '', false, ['admin']);
    }
]);
