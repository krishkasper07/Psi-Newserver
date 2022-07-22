const joi = require('joi')
const signUpValidater = (body) => {
  const schema = joi.object({
    userName: joi.string().required().min(3).label("User Name"),
    password: joi.string().required().min(4).label("Password"),
    name: joi.string().required().min(3).label("Name"),
    department: joi.string().required().label("Department")
  });
  return schema.validate(body);
};

const loginValidater = (body) => {
  const schema = joi.object({
    userName: joi.string().required().label("User Name"),
    password: joi.string().required().label("Password"),
  });
  return schema.validate(body);
};


const refreshTokenValidator = (body) => {
  const schema = joi.object({
    refreshToken: joi.string().required().label("Refresh Token")
  });
  return schema.validate(body);
};

module.exports = { signUpValidater, loginValidater, refreshTokenValidator };
