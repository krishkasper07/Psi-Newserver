const router =require("express").Router();
const auth =require("../middleware/auth");
const roleCheck=require('../middleware/roleCheck');

router.get("/details", auth,roleCheck(["admin"]), (req, res) => {
	res.status(200).json({ message: "user authenticated." });
});

module.exports=router;