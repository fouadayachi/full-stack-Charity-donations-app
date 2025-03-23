import express from 'express';
import { getDashboardData } from '../controllers/dashboard.controller.js';


const dashRouter = express.Router();

dashRouter.get("/getStats",getDashboardData);


export default dashRouter;