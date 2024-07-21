import express from "express";
import captureIpAddress from "../middlewares/captureIP.js";
import { loginUser, registerUser } from "../controllers/userController.js";

export const userRoute = express.Router();

userRoute.route("/register").post(captureIpAddress, registerUser);

userRoute.route("/login").post(captureIpAddress, loginUser);