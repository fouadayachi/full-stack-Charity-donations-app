import express from 'express';
import { addDonation, confirmDonation, getDonations, cancelDonation } from '../controllers/donation.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const donationRouter = express.Router();

donationRouter.post('/add', addDonation);
donationRouter.put('/confirm/:id', confirmDonation);
donationRouter.put('/cancel/:id', cancelDonation);
donationRouter.get('/getDonations', verifyToken, getDonations);

export default donationRouter;