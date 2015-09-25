'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ticket Schema
 */
var TicketSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Ticket name',
		trim: true
	},
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
	admin: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	close: {
		type: Boolean,
		default: false
	}
});

mongoose.model('Ticket', TicketSchema);
