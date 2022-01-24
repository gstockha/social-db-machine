const router = require("express").Router();
const {
    getThoughts,
    createThought,
    getThoughtById,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require("../../controllers/thought-controller");

router.route("/").get(getThoughts); // get thought
router.route("/:userId").post(createThought); // post thought
router.route("/:id").get(getThoughtById).put(updateThought).delete(deleteThought); // select 1, update, delete
router.route("/:thoughtId/reactions").post(addReaction); // post reaction
router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction); // delete reaction

module.exports = router;