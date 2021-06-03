const router = require("express").Router();
const userCtrl = require("../controllers/user");
const authUser = require("../middleware/authUser");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const isOwner = require("../middleware/isOwner");

router.post("/signup", authUser.checkPseudo, authUser.valid, userCtrl.signup);
router.post("/login", authUser.valid, userCtrl.login);
router.get("/accounts", auth, userCtrl.getAllUsers);
router.put("/accounts/:id", auth, isOwner, multer, userCtrl.updateAccount);
router.get("/accounts/:id", auth, userCtrl.getAccount);
router.delete("/accounts/:id", auth, isOwner, userCtrl.deleteAccount);

module.exports = router;
