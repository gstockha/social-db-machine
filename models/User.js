const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            match: [/.+@.+\..+/] //fancy regex
        },
        thoughts: [{type: Schema.Types.ObjectId, ref: "Thought"}],
        friends: [{type: Schema.Types.ObjectId, ref: "User"}], //self-reference
    },
    { toJSON: { virtuals: true } }
);

UserSchema.virtual('friendsCount').get(function(){ //can't be an arrow function for .this to work properly
    return this.friends.length;
});

const User = model('User', UserSchema);
module.exports = User;