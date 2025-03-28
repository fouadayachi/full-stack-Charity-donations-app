import express from 'express';
import { changePassword, checkAuth, getAllUsers, login, logOut, signUp, updateUserProfile } from '../controllers/auth.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const authRouter = express.Router();

authRouter.post("/login",login);
authRouter.post("/signup",signUp);
authRouter.post("/logout",logOut);
authRouter.post("/authentication",verifyToken,checkAuth);
authRouter.get("/getAllUsers",getAllUsers);
authRouter.put("/updateProfile", verifyToken, updateUserProfile);
authRouter.put("/changePassword", verifyToken, changePassword);

export default authRouter;