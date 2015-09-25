'use strict';

module.exports = function(app) {
    // Root routing
    var contact = require('../../app/controllers/contact.server.controller');
    app.route('/contact').post(contact.send);
};
