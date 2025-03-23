import express from 'express';
import multer from 'multer';
import { acceptRequest, addRequest, getAllRequests, refuseRequest } from '../controllers/requests.controller.js';
const upload = multer({ storage: multer.memoryStorage() });


const requestsRouter = express.Router();

requestsRouter.post("/addRequest",upload.array('images'),addRequest);
requestsRouter.get("/getAllRequests",getAllRequests);
requestsRouter.put("/acceptRequest/:id",acceptRequest);
requestsRouter.put("/refuseRequest/:id",refuseRequest);


export default requestsRouter;