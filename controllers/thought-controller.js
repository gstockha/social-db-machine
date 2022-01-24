const { Thought, User } = require("../models");

const thoughtController = {

    getThoughts(req, res) { //find all thoughts
        Thought.find({}) //this empty object is necessary
            .populate({ path: "reactions", select: "-__v" }) //find all reactions
            .select("-__v") //remove this
            .then((thoughtsData) => res.json(thoughtsData))
            .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({ path: "reactions", select: "-__v" }) //find all relevant reactions
        .select("-__v")
        .then((thoughtData) => {
            if (!thoughtData) {
                res.status(404).json({ message: "Thought with this ID does not exist!" });
                return;
            }
            res.json(thoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    createThought({ params, body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
        return User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { thoughts: _id } }, //push to the thoughts list
            { new: true } //return new
        )
        })
        .then((thoughtData) => {
            if (!thoughtData) {
                res.status(404).json({ message: "Thought data was no good" });
                return;
            }
            res.json(thoughtData);
        })
        .catch((err) => res.json(err));
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidators: true,
        })
        .populate({ path: "reactions", select: "-__v" })
        .select("-___v")
        .then((thoughtData) => {
            if (!thoughtData) {
                res
                .status(404)
                .json({ message: "Thought with this ID does not exist!" });
                return;
            }
            res.json(thoughtData);
        })
        .catch((err) => res.json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id }) //pull id from params
        .then((thoughtData) => {
            if (!thoughtData) {
                res
                .status(404)
                .json({ message: "Thought with this ID does not exist!" });
                return;
            }
            res.json(thoughtData);
        })
        .catch((err) => res.status(400).json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
        .populate({ path: "reactions", select: "-__v" })
        .select("-__v")
        .then((thoughtData) => {
            if (!thoughtData) {
                res
                .status(404)
                .json({ message: "Thought with this ID does not exist!" });
                return;
            }
            res.json(thoughtData);
        })
        .catch((err) => res.status(400).json(err));
    },

    deleteReaction({ params }, res) { //pull the id from params
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then((thoughtData) => {
        if (!thoughtData) {
            res
            .status(404)
            .json({ message: "Thought with this ID does not exist!" });
            return;
        }
        res.json(thoughtData);
        })
        .catch((err) => res.status(400).json(err));
    }
};

module.exports = thoughtController;