import express from "express";
import {
  getDonationsByEvent,
  getItemDonationsByEvent,
  getVolunteersByEvent,
} from "../controllers/contributions.controller.js";

const contributionsRouter = express.Router();

// Route to get donations by event ID
contributionsRouter.get("/donations/:eventId", getDonationsByEvent);

// Route to get item donations by event ID
contributionsRouter.get("/item-donations/:eventId", getItemDonationsByEvent);

// Route to get volunteers by event ID
contributionsRouter.get("/volunteers/:eventId", getVolunteersByEvent);

export default contributionsRouter;