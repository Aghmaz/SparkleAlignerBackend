const express = require("express");
const router = express.Router();
// const fetchuser = require("../middleware/fetchUser.js");
const { getOnlineStatus } = require("../controller/userController.js");
const {
  getNonFriendsList,
  updateprofile,
} = require("../controller/authController.js");

router.get("/online-status/:id", getOnlineStatus);
router.get("/non-friends", getNonFriendsList);
router.put("/update", updateprofile);

module.exports = router;
