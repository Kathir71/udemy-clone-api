const JWT = require("jsonwebtoken");
const signToken = (data) => {
          const accessToken = JWT.sign( data, process.env.ACCESS_TOKEN_SECRET);
          return accessToken;
}