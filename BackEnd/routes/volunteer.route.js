import express from 'express';
import { addVolunteer, confirmVolunteer, getVolunteers } from '../controllers/volunteer.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const volunteerRouter = express.Router();

volunteerRouter.post('/add',addVolunteer);
volunteerRouter.put('/confirm/:id',confirmVolunteer);
volunteerRouter.get('/getVolunteers',verifyToken,getVolunteers);

export default volunteerRouter;