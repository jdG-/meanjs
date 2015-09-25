'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate')(mongoose),
	Schema = mongoose.Schema;

/**
 * Forum reply Schema
 */
var ForumReplySchema = new Schema({
	content: {
		type: String,
		default: '',
		required: 'Please fill Forum reply content',
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
    comments: [{
        type: Schema.ObjectId,
        ref: 'ForumReply'
    }],
	thread: {
		type: Schema.ObjectId,
		ref: 'ForumThread'
	},
	category: {
		type: Schema.ObjectId,
		ref: 'ForumCategory'
	}
});

ForumReplySchema.plugin(deepPopulate, {
  whitelist: [
    'comments.user'
	]
});

mongoose.model('ForumReply', ForumReplySchema);
