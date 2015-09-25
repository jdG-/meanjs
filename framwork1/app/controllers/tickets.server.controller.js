'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Ticket = mongoose.model('Ticket'),
    Reply = mongoose.model('TicketReply'),
	_ = require('lodash');

/**
 * Create a Ticket
 */
exports.create = function(req, res) {
	var ticket = new Ticket(req.body);
	ticket.user = req.user;

	ticket.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ticket);
		}
	});
};

/**
 * Show the current Ticket
 */
exports.read = function(req, res) {
	res.jsonp(req.ticket);
};

/**
 * Update a Ticket
 */
exports.update = function(req, res) {
	var ticket = req.ticket ;

	ticket = _.extend(ticket , req.body);

	ticket.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ticket);
		}
	});
};

/**
 * List of Tickets
 */
exports.list = function(req, res) {
	if (req.user.roles.indexOf('admin') !== -1) {
		Ticket.find().sort('-created').populate('user').populate('admin', 'username').exec(function (err, tickets) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(tickets);
			}
		});
	} else {
		Ticket.find({user: req.user._id}).sort('-created').populate('user').populate('admin', 'username').exec(function (err, tickets) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(tickets);
			}
		});
	}
};

/**
 * Ticket middleware
 */
exports.ticketByID = function(req, res, next, id) { 
	Ticket.findById(id).populate('user', 'displayName').populate('admin').exec(function(err, ticket) {
		if (err) return next(err);
		if (! ticket) return next(new Error('Failed to load Ticket ' + id));
		req.ticket = ticket ;
		next();
	});
};

/**
 * Ticket authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.ticket.user.id !== req.user.id && req.user.roles.indexOf('admin') === -1) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


/**
 * Get all replies from a Ticket Id
 */
exports.getReplies = function(req, res, next) {
    Reply.find({ticketId: req.ticket._id}).sort('created').populate('user', 'displayName').exec(function(err, replies) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(replies);
        }
    });
};
//
///**
// * Reply to a Ticket Id
// */
exports.createReply = function(req, res, next) {
    
    var reply = new Reply(req.body);

    reply.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(reply);
        }
    });
};
