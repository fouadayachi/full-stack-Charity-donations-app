import express from "express";
import multer from "multer";
import {
  createPost,
  deleteEvent,
  getEvent,
  getEvents,
  getFilterEvents,
  saveEvent,
  unsaveEvent,
  updateEvent,
} from "../controllers/events.controller.js";
import verifyToken from "../middleware/auth.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });

const eventsRouter = express.Router();

eventsRouter.post(
  "/postEvent",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 10 }, // Adjust maxCount as needed
  ]),
  createPost
);
eventsRouter.put("/updateEvent/:id",updateEvent);
eventsRouter.post("/events/saveEvent", verifyToken, saveEvent);
eventsRouter.post("/events/unsaveEvent", verifyToken, unsaveEvent);
eventsRouter.get("/events", getEvents);
eventsRouter.get("/event/:id", getEvent);
eventsRouter.get("/events/filter", getFilterEvents);
eventsRouter.delete("/deleteEvent/:id", deleteEvent);

export default eventsRouter;
