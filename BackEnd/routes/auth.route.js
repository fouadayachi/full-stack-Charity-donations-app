import express from 'express';
import {  checkAuth, login, logOut, signUp } from '../controllers/auth.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const authRouter = express.Router();

authRouter.post("/login",login);
authRouter.post("/signup",signUp);
authRouter.post("/logout",logOut);
authRouter.post("/authentication",verifyToken,checkAuth);


export default authRouter;