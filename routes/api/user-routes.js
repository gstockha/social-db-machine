const router = require("express").Router();
const {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend
} = require("../../controllers/user-controller");

router.route("/").get(getUsers).post(createUser); // get all users, create a user
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser); // get a user, update a user, delete a user
router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend); // add or delete friend

module.exports = router;