const jwt = require('jsonwebtoken');
function authenticateToken (req , res , next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(`token is ${token}`);
    if (token == null) return res.sendStatus(401);
    jwt.verify(token , process.env.ACCESS_TOKEN_SECRET , (err , userObj) => {
        if(err) return res.sendStatus(403);
        req.user = userObj;
        next();
    })
}
const signToken = (req , res , next) => {
    console.log(req.user);
          const accessToken = jwt.sign({
            objectId:req.user.objectId
          } , process.env.ACCESS_TOKEN_SECRET);
          res.json({userName:req.user.userName , accessToken:accessToken});
}

module.exports = {
    authenticateToken,
    signToken
};