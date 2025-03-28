import express from 'express';
import { addVolunteer, confirmVolunteer, getVolunteers, cancelVolunteer } from '../controllers/volunteer.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const volunteerRouter = express.Router();

volunteerRouter.post('/add', addVolunteer);
volunteerRouter.put('/confirm/:id', confirmVolunteer);
volunteerRouter.put('/cancel/:id', cancelVolunteer);
volunteerRouter.get('/getVolunteers', verifyToken, getVolunteers);

export default volunteerRouter;