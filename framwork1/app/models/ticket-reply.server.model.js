'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * TicketReply Schema
 */
var TicketReplySchema = new Schema({
	content: {
		type: String,
		default: '',
		required: 'Please fill Ticket content',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	ticketId: {
		type: Schema.ObjectId,
		ref: 'Ticket'
	}
});

mongoose.model('TicketReply', TicketReplySchema);
