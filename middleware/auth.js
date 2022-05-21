const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {

const token = req.header("x-access-token");

  if (!token)
    return res(403).json({
      error: true,
      message: "Access Denied:No Token Provided",
    });
  try {
    const tokenDetails = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req.user=tokenDetails;
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({error:true,message:"Access Denied:Invaild Token"})
  }
};


module.exports=auth;