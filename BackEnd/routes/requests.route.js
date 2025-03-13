import express from 'express';
import multer from 'multer';
import { addRequest } from '../controllers/requests.controller.js';
const upload = multer({ storage: multer.memoryStorage() });


const requestsRouter = express.Router();

requestsRouter.post("/addRequest",upload.array('images'),addRequest);


export default requestsRouter;