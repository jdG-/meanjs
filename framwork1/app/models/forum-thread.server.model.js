'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate')(mongoose),
	Schema = mongoose.Schema;

/**
 * Forum thread Schema
 */
var ForumThreadSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Forum thread name',
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
    categoryId: {
        type: Schema.ObjectId,
        ref: 'ForumCategory'
    },
    replies: [{
        type: Schema.ObjectId,
        ref: 'ForumReply'
    }]
});

ForumThreadSchema.plugin(deepPopulate, {
  whitelist: [
    'replies.user',
    'replies.comments'
	]
});

mongoose.model('ForumThread', ForumThreadSchema);
