const JWT = require("jsonwebtoken");
const signToken = (req , res , next) => {
    console.log(req.user);
          const accessToken = JWT.sign({
            objectId:req.user.objectId
          } , process.env.ACCESS_TOKEN_SECRET);
          res.json({userName:req.user.userName , accessToken:accessToken});
}
module.exports = {
    signToken
}