const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const jayMessageSchema = new Schema({
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'conversations',
    },
    
    author: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
   
    body: {
        type: String,
        required: true,
    },
   
    date: {
        type: String,
        default: Date.now,
    },
});

module.exports =JayMessage= mongoose.model('jaymessages', jayMessageSchema);
