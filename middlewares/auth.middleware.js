import JWT from "jsonwebtoken";
import userModel from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const adminName = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

export const userAuthentication_IsLoggedIn = async (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      return res.status(500).send({
        success: false,
        message: "User is not logged In",
      });
    }
    const userDetails = JWT.verify(req.headers["authorization"], "itsaseceret");
    const isUserExist = await userModel.findById(userDetails._id);
    if (!isUserExist) {
      return res.status(500).send({
        success: false,
        message: "User is not logged In",
      });
    } else {
      next()
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const userAuthentication_IsNotLoggedIn = async (req, res, next) => {
  try {
    if (req.headers["authorization"]) {
      return res.status(500).send({
        success: false,
        message: "User already Logged In",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const adminAuthorization = (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      return res.status(500).send({
        success: false,
        message: "Admin is not logged In",
      });
    }
    const adminDetails = JWT.verify(
      req.headers["authorization"],
      "itsaseceret"
    );
    if (
      adminDetails.name == adminName &&
      adminDetails.password == adminPassword
    ) {
      next();
    } else {
      return res.status(500).send({
        success: false,
        message: "Admin is not logged In",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
