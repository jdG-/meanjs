'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate')(mongoose),
	Schema = mongoose.Schema;

/**
 * Forum category Schema
 */
var ForumCategorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Forum category name',
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
    subCategories: [{
        type: Schema.ObjectId,
        ref: 'ForumCategory'
    }],
    threads: [{
        type: Schema.ObjectId,
        ref: 'ForumThread'
    }],
    main: {
        type: Boolean,
        default: true
    }
});

ForumCategorySchema.plugin(deepPopulate, {
  whitelist: [
    'subCategories.user',
    'threads.user',
    'threads.replies'
  ]
});

mongoose.model('ForumCategory', ForumCategorySchema);
