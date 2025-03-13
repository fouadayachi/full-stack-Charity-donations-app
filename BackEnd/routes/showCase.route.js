import express from 'express';
import { addShowCase, getShowCase, getShowCases } from '../controllers/showCase.controller.js';

const showCaseRouter = express.Router();

showCaseRouter.get('/getShowCases',getShowCases);
showCaseRouter.get('/getShowCase/:id',getShowCase);
showCaseRouter.post('/addShowCase',addShowCase);

export default showCaseRouter;
