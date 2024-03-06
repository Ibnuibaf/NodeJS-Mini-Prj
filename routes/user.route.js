import express from "express";
import {
  adminLogin,
  getUsers,
  restrictUsers,
  userLogin,
  userRegister,
  userUpdate,
  userVerification,
} from "../controllers/user.controller.js";
import {
  adminAuthorization,
  userAuthentication_IsLoggedIn,
  userAuthentication_IsNotLoggedIn,
} from "../middlewares/auth.middleware.js";
const userRouter = express.Router();


// ---  User Portal ----


userRouter.post(
  "/register",
  (req, res, next) => userAuthentication_IsNotLoggedIn(req, res, next),
  (req, res) => userRegister(req, res)
);
userRouter.post(
  "/login",
  (req, res, next) => userAuthentication_IsNotLoggedIn(req, res, next),
  (req, res) => userLogin(req, res)
);
userRouter.get(
  "/verify",
  (req, res, next) => userAuthentication_IsNotLoggedIn(req, res, next),
  (req, res) => userVerification(req, res)
);
userRouter.patch(
  "/update",
  (req, res, next) => userAuthentication_IsLoggedIn(req, res, next),
  (req, res) => userUpdate(req, res)
);





// ---   Admin Portal   ----

userRouter.post(
  "/admin/login",
  (req, res, next) => userAuthentication_IsNotLoggedIn(req, res, next),
  (req, res) => adminLogin(req, res)
);
userRouter.get(
  "/all",
  (req, res, next) => adminAuthorization(req, res, next),
  (req, res) => getUsers(req, res)
);
userRouter.patch(
  "/block",
  (req, res, next) => adminAuthorization(req, res, next),
  (req, res) => restrictUsers(req, res)
);

export default userRouter;
