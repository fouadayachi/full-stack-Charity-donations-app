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

const upload = multer({ 
  storage: multer.memoryStorage(), // Use memory storage for FormData
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

const eventsRouter = express.Router();

eventsRouter.post(
  "/postEvent",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 10 }, // Adjust maxCount as needed
  ]),
  createPost
);
eventsRouter.put(
  '/updateEvent/:id',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 10 },
    { name: 'targetItems', maxCount: 1 } // For the JSON blob
  ]),
  updateEvent
);
eventsRouter.post("/events/saveEvent", verifyToken, saveEvent);
eventsRouter.post("/events/unsaveEvent", verifyToken, unsaveEvent);
eventsRouter.get("/events", getEvents);
eventsRouter.get("/event/:id", getEvent);
eventsRouter.get("/events/filter", getFilterEvents);
eventsRouter.delete("/deleteEvent/:id", deleteEvent);

export default eventsRouter;
