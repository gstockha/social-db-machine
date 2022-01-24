const { User } = require("../models");

const userController = {

    getUsers(req, res) {
        User.find({})
        .populate({ path: "thoughts", select: "-__v" }) //get all thoughts and friends, remove the stupid thing
        .populate({ path: "friends", select: "-__v" })
        .select("-__v")
        .then((userData) => res.json(userData))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    createUser({ body }, res) {
        User.create(body)
        .then((userData) => res.status(400).json(userData)) //201 is good here
        .catch((err) => res.status(400).json(err));
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({ path: "thoughts", select: "-__v" })
        .populate({ path: "friends", select: "-__v" })
        .select("-__v") //get rid of this
        .then((userData) => {
            if (!userData) {
                res.status(404).json({ message: "User with this ID does not exist!" });
                return;
            }
            res.json(userData);
        })
        .catch((err) => res.status(400).json(err));
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidators: true,
        })
        .then((userData) => {
            if (!userData) {
                res.status(400).json({ message: "No user found with this id" });
                return;
            }
            res.json(userData);
        })
        .catch((err) => res.status(400).json(err));
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then((userData) => {
            if (!userData) {
                res.status(400).json({ message: "User with this ID does not exist!" });
                return;
            }
            res.json(userData);
        })
        .catch((err) => res.status(400).json(err));
    },

    addFriend({ params }, res) {
        User.findByIdAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .populate({ path: "friends", select: "-__v" })
        .select("-__v")
        .then((userData) => {
            if (!userData) {
                res.status(400).json({ message: "User with this ID does not exist!" });
                return;
            }
            res.json(userData);
        })
        .catch((err) => res.json(err));
    },

    removeFriend({ params }, res) {
        User.findByIdAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true } //dont forget validators
        )
        .populate({ path: "friends", select: "-__v" })
        .select("-__v")
            .then((userData) => {
            if (!userData) {
                res.status(400).json({ message: "User with this ID does not exist!" });
                return;
            }
            res.json(userData);
        })
        .catch((err) => res.json(err));
    }
};

module.exports = userController;