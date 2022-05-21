const refreshRouter = require("express").Router();

const UserToken = require("../models/userToken.model");

const jwt = require("jsonwebtoken");

const verifyRefreshToken = require("../utils/verifyRefreshToken");

const { refreshTokenValidator } = require("../utils/validationSchema");

refreshRouter.post("/", async (req, res) => {
  const { error } = refreshTokenValidator(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: true, message: "Invalid Refresh Token" });

  verifyRefreshToken(req.body.refreshToken)
    .then(({ tokenDetails }) => {
      const payload = {
        _id: tokenDetails._id,
        roles: tokenDetails.roles,
        userName: tokenDetails.userName,
      };
      const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: "15m" }
      );
      res.status(200).json({
        error: false,
        accessToken,
        refreshToken:req.body.refreshToken,
        message: "Acess Token Created Sucessfully",
      });
    })
    .catch((err) => res.status(400).json({ error: true, message: err }));
});

//logout

refreshRouter.post("/delete", async (req, res) => {
  try {
    const { error } =  refreshTokenValidator(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: "Invalid Refresh Token" });

        const userToken= UserToken.findOne({token:req.body.refreshToken});
        if(!userToken)
        return res.status(200).json({error:false,message:"Logged Out Successfully"})
        await userToken.deleteOne()
        res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});


module.exports=refreshRouter;
