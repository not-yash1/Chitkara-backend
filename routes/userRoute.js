import express from "express";
import captureIpAddress from "../middlewares/captureIP.js";
import { loginUser, logoutUser, myProfile, registerUser } from "../controllers/userController.js";

export const userRoute = express.Router();

userRoute.route("/register").post(registerUser);

userRoute.route("/login").post(loginUser);

userRoute.route("/logout").get(logoutUser);

userRoute.route("/me").get(myProfile);