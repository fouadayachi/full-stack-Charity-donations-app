import express from 'express';
import { createPost, getEvent, getEvents, getFilterEvents, saveEvent, unsaveEvent } from '../controllers/events.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const eventsRouter = express.Router();

eventsRouter.post('/postEvent',createPost);
eventsRouter.get('/events',getEvents);
eventsRouter.get('/event/:id',getEvent);
eventsRouter.get('/events/filter',getFilterEvents);
eventsRouter.post('/events/saveEvent',verifyToken,saveEvent);
eventsRouter.post('/events/unsaveEvent',verifyToken,unsaveEvent);


export default eventsRouter