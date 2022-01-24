const { Schema, model, Types } = require("mongoose");
const dateFormatter = require("../utils/dateFormatter");

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dateFormatter(createdAtVal)
        },
    },
    { toJSON: { getters: true } }
);

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dateFormatter(createdAtVal)
        },
        username: {
            type: String,
            required: true
        },
        reactions: [ReactionSchema]
    },
    {
        toJSON:
            { virtuals: true, getters: true },
            id: false //dont send id
    }
);

ThoughtSchema.virtual("reactionsCount").get(function(){ //can't be an arrow function to make .this work properly
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);
module.exports = Thought;