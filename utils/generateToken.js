const jwt=require('jsonwebtoken')

const UserToken=require('../models/userToken.model');

const generateTokens=async(user)=>{
try {
    const payload={_id:user._id,userName:user.userName,department:user.department};

    const accessToken=jwt.sign(
        payload,process.env.ACCESS_TOKEN_PRIVATE_KEY,
        {expiresIn:"15m"}
    );

    const refreshToken=jwt.sign(
        payload,process.env.REFRESH_TOKEN_PRIVATE_KEY,
        {expiresIn:"1d"}
    );

    const userToken=await UserToken.findOne({userId:user._id});
    if(userToken) await userToken.deleteOne();

    await new UserToken({userId:user._id,token:refreshToken}).save();

    return Promise.resolve({accessToken,refreshToken});
    
} catch (error) {
    return Promise.reject(error)
}
}
module.exports=generateTokens;
