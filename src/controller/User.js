const userModel = require("../models/User");
const auth = require("../common/auth");
const {
  transporter,
  mailOptions,
  randomStringGenerate,
} = require("../common/nodeMail");
const dotenv = require("dotenv");
dotenv.config();

const getUsers = async (req, res) => {
  try {
    let user = await userModel.find();
    res.status(200).send({
      message: "User Data Fetched Succesffully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      req.body.password = await auth.hashPassword(req.body.password);
      const result = await userModel.create(req.body);
      res.status(201).send({
        message: "User Created Successfully",
        result,
      });
    } else {
      res
        .status(500)
        .send({ message: `User with ${req.body.email} already exists` });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    console.log(user);
    if (user) {
      let passCheck = await auth.hashCompare(req.body.password, user.password);
      if (passCheck) {
        res.status(200).send({
          message: "Login Successful",
        });
      } else {
        res.status(500).send({
          message: "Invalid Password",
        });
      }
    } else {
      res.status(400).send({
        message: `Account with ${req.body.email} does not exist`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {
      const randomString = randomStringGenerate();
      const path = process.env.FRONT_END_URL + "/otp/" + user._id;
      mailOptions.to = user.email;
      mailOptions.html = `Hi ${user.userName} Please find the OTP ${randomString} in the following link to reset your password
      <a href=${path}> Reset password link`;
      const updatedUser = await userModel.updateOne(
        { email: req.body.email },
        { $set: { OTP: randomString } },
        { new: true }
      );
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: " + error);
          res.status(500).send({
            message: "Failed to send email.",
            errorMsg: error.message,
          });
        } else {
          console.log("Email sent: " + info.response);
          res.status(201).send({
            message: "Email Sent Successfully.",
          });
        }
      });
    } else {
      res.status(400).send({
        message: `Account with ${req.body.email} does not exist`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const verifyOTP = async (req, res) => {

  console.log("restPage OTP--",req.body)
  try {
    let user = await userModel.findOne({_id:req.body.id})
    if(user){
      if(user.OTP === req.body.OTP){

        res.status(200).send({
          message:"OTP verified."
        });
      }
        else{
          res.status(400).send({
            message:"Pls check your OTPand try again"
          })
        }     
    }
    else{
      res.status(400).send({
        message:"user does not exist"
      })
    }

  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    let user = await userModel.findOne({ _id:req.body.id });
    if (user) {
      req.body.password = await auth.hashPassword(req.body.password);
      user.password = req.body.password;
      await user.save();
      res.status(200).send({
        message: "Password updated Succesfully",
      });
    } else {
      res.status(400).send({
        message: `Account with ${req.body.email} does not exist`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { createUser, getUsers, login, resetPassword, forgotPassword,verifyOTP };
