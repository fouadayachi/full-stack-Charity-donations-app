import express from "express";
import multer from "multer";
import {
  addShowCase,
  getShowCase,
  getShowCases,
  getAllShowCases,
  deleteShowCase,
  updateShowCase, // Import the new function
} from "../controllers/showCase.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const showCaseRouter = express.Router();

showCaseRouter.post(
  "/addShowCase",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  addShowCase
);
showCaseRouter.put("/updateShowCase/:id",updateShowCase)
showCaseRouter.get("/getShowCases", getShowCases);
showCaseRouter.get("/getShowCase/:id", getShowCase);
showCaseRouter.get("/getAllShowCases", getAllShowCases);
showCaseRouter.delete("/deleteShowCase/:id", deleteShowCase);

export default showCaseRouter;
