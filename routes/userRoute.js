const express = require("express");
const router = express.Router();
// const fetchuser = require("../middleware/fetchUser.js");
const { getOnlineStatus } = require("../controller/userController.js");
const {
  getNonFriendsList,
  updateprofile,
} = require("../controller/authController.js");
const userController = require("../controller/userController.js");
const auth = require("../middleware/auth.js");

router.get("/online-status/:id", getOnlineStatus);
router.get("/non-friends", getNonFriendsList);
router.put("/update", updateprofile);
router.post("/fcm-token", auth, userController.updateFCMToken);

module.exports = router;
