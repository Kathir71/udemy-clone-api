const userModel = require("../models/userModel");
const JWT = require("jsonwebtoken");
const signToken = (data) => {
  const accessToken = JWT.sign(data, process.env.ACCESS_TOKEN_SECRET);
  return accessToken;
};
const SignUp = (req, res) => {
  const { userName, userEmail, userPassword, userImg } = req.body;
  console.log(userName);
  //find if email already exists
  userModel
    .find()
    .where("userEmail")
    .equals(userEmail)
    .then((response) => {
      if (response.length > 0)
        res.status(452).json({ msg: "Email already registered" });
      else {
        const newUser = new userModel({
          userName: userName,
          userEmail: userEmail,
          userPassword: userPassword,
          userImg: userImg,
        });
        console.log(newUser);
        newUser
          .save()
          .then((response) => {
            console.log(response);
            const token = signToken({
              userId: response._id,
            });
            console.log(response);
            res.json({ userName: userName, accessToken: token });
          })
          .catch((err) => {
            console.log("Saving error");
            console.log(err);
            res.status(500).json({ msg: "failure" });
          });
      }
    })
};
const Login = (req, res) => {
  const { userEmail, userPassword } = req.body;
  console.log(userModel);
  userModel
    .findOne()
    .where("userEmail")
    .equals(userEmail)
    .where("userPassword")
    .equals(userPassword)
    .then((response) => {
      const accessToken = signToken({
        userId: response._id,
      });
      console.log(response);
      res.status(200).json({ userName: response.userName, accessToken });
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: "Invalid credentials" });
    });
};
module.exports = {
  SignUp,
  Login,
};
