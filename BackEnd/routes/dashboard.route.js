import express from 'express';
import { getDashboardData, getPendingContributions } from '../controllers/dashboard.controller.js';

const dashRouter = express.Router();

dashRouter.get("/getStats", getDashboardData);
dashRouter.get("/getPendingContributions", getPendingContributions);

export default dashRouter;