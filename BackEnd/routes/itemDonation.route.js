import express from 'express';
import { addItemDonation, confirmItemDonation, getItemDonation } from '../controllers/itemDonation.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const itemDonationRouter = express.Router();

itemDonationRouter.post('/add',addItemDonation);
itemDonationRouter.put('/confirm/:id',confirmItemDonation);
itemDonationRouter.get('/getItemDonations',verifyToken,getItemDonation);

export default itemDonationRouter;