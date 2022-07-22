const userRouter = require('express').Router();

const User = require('../models/user.model');

const bcrypt = require('bcrypt');

const { loginValidater, signUpValidater } = require('../utils/validationSchema')

const generateTokens = require('../utils/generateToken');

//signUp Route
userRouter.post("/signUp", async (req, res) => {
  try {
    const { error } = signUpValidater(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const user = await User.findOne({ userName: req.body.userName });

    if (user)
      return res.status(400).json({
        error: true,
        message: "User Name You Have Given Is Already Choosen",
      });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    await new User({
      ...req.body,
      password: hashPassword,
    }).save();

    res
      .status(201)
      .json({ error: true, message: "Your Account Created Sucessfully.." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

//Login Route
userRouter.post("/login", async (req, res) => {
  try {
    const { error } = loginValidater(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const user = await User.findOne({ userName: req.body.userName });
    if (!user)
      return res
        .status(401)
        .json({ error: true, message: "Invaild UserName Or Password" });

    const validatePassword = await bcrypt.compare(req.body.password, user.password)

    if (!validatePassword)
      return res
        .status(401)
        .json({ error: true, message: "Invaild UserName Or Password" });

    //If EveryThing satisfied GenerateTokens

    const { accessToken, refreshToken } = await generateTokens(user)

    res.status(200)
      .json({
        error: false,
        accessToken,
        refreshToken,
        message: "Login Sucessfull"
      })

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

module.exports = userRouter;
