import express from 'express';
import { addDonation, confirmDonation, getDonations } from '../controllers/donation.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const donationRouter = express.Router();

donationRouter.post('/add',addDonation);
donationRouter.put('/confirm/:id',confirmDonation);
donationRouter.get('/getDonations',verifyToken,getDonations);

export default donationRouter;