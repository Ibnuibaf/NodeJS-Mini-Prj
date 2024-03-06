import userModel from "../models/user.model.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

dotenv.config();

function isValidEmail(email) {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

function isValidPassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

async function sendVerificationMail(email, token) {
  try {
    const verificationUrl = `http://localhost:3000/api/user/verify?token=${token}`;
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.verifyAppEmail,
        pass: process.env.verifyAppPassword,
      },
    });
    const mailOptions = {
      from: process.env.verifyAppEmail,
      to: email,
      subject: "Verify Your Profile in Ecfile",
      html: `<p>Hey There!. Click Here to Verify your Account on Ecfile <br> 
        <b><a href="${verificationUrl}">Verify My Account</a></b> </p><br>`,
    };
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log("Error occurred");
        console.log(err);
        return {
          status: 500,
          data: {
            success: false,
            message: "server error",
          },
        };
      } else {
        console.log("Code is sent");
      }
    });
    return {
      status: 200,
      data: {
        success: true,
        message: "Verification Mail Sent to email address",
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        success: false,
        message: error.message,
      },
    };
  }
}

export const userRegister = async (req, res) => {
  try {
    console.log(req.body);
    const { email, name, password, phone, verificationType } = req.body;
    if (!isValidEmail(email)) {
      return res
        .status(500)
        .send({ success: false, message: "Not a valid Email, try Again" });
    }
    if (!isValidPhone(phone)) {
      return res.status(500).send({
        success: false,
        message: "Not a valid PhoneNumber, try Again",
      });
    }
    if (!isValidPassword(password)) {
      return res.status(500).send({
        success: false,
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one digit.",
      });
    }
    if (!verificationType) {
      return res.status(500).send({
        success: false,
        message: "Please Provide a Verification Method",
      });
    }
    const userExist = await userModel.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    if (userExist) {
      return res.status(500).send({
        success: false,
        message: "User Exist with same credentials",
      });
    }
    const cryptedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: cryptedPassword,
      phone,
    });
    if (verificationType == "mail") {
      const token = JWT.sign(
        { _id: user._id, email, name, phone },
        "itsaseceret"
      );
      const response = await sendVerificationMail(user.email, token);
      res.status(response.status).send(response.data);
    } else if (verificationType == "otp") {
      const token = JWT.sign(
        { _id: user._id, email, name, phone },
        "itsaseceret"
      );
      const response = await sendVerificationMail(user.email, token);
      res.status(response.status).send(response.data);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const userLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await userModel.findOne({ phone });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User not found, Register User",
      });
    }
    if (!bcrypt.compare(password, user.password)) {
      return res.status(500).send({
        success: false,
        message: "Password is Wrong",
      });
    }
    if (user.blocked) {
      return res.status(500).send({
        success: false,
        message: "User is Blocked By Admin",
      });
    }
    const token = JWT.sign(
      { _id: user._id, email: user.email, name: user.name, phone: user.phone },
      "itsaseceret"
    );

    res.status(200).send({ success: true, message: "User Logged In", token });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const userVerification = async (req, res) => {
  try {
    const { token } = req.query;
    const userDetails = JWT.verify(token, "itsaseceret");
    const user = await userModel.findById(userDetails._id);
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "Something went wrong, user not found",
      });
    }
    user.verified = true;
    await user.save();
    res.status(200).send({ success: true, message: "User has verified", user });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const adminLogin = (req, res) => {
  try {
    const { name, password } = req.body;
    const adminName = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (name == adminName && password == adminPassword) {
      const token = JWT.sign({ name, password }, "itsaseceret");
      res.status(200).send({ success: true, message: "Admin LoggedIn", token });
    } else {
      res.status(500).send({ success: false, message: "Wrong credentials !" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, { password: 0 });
    res.status(200).send({ success: true, message: "Users Fetched", users });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const restrictUsers = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "Something went wrong, user not found",
      });
    }
    user.blocked = !user.blocked;
    await user.save();
    res.status(200).send({ success: true, message: "User Status Updated" });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const userUpdate = async (req, res) => {
  try {
    const userDetails = JWT.verify(req.headers["authorization"], "itsaseceret");
    const { name } = req.body;
    const user = await userModel.findById(userDetails._id);
    user.name = name;
    await user.save();
    const token = JWT.sign(
      { _id: user._id, email: user.email, name: user.name, phone: user.phone },
      "itsaseceret"
    );
    res
      .status(200)
      .send({ success: true, message: "User Name Updated", token });
  } catch (error) {
    res.status(500).send(error);
  }
};
