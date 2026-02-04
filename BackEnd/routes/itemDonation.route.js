import express from 'express';
import { addItemDonation, confirmItemDonation, getItemDonation, cancelItemDonation } from '../controllers/itemDonation.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const itemDonationRouter = express.Router();

itemDonationRouter.post('/add', addItemDonation);
itemDonationRouter.put('/confirm/:id', confirmItemDonation);
itemDonationRouter.put('/cancel/:id', cancelItemDonation);
itemDonationRouter.get('/getItemDonations', verifyToken, getItemDonation);

export default itemDonationRouter;