import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from "path";
import connectDB from './config/DB.js';
import authRouter from './routes/auth.route.js';
import donationRouter from './routes/donation.route.js';
import eventsRouter from './routes/events.route.js';
import itemDonationRouter from './routes/itemDonation.route.js';
import requestsRouter from './routes/requests.route.js';
import showCaseRouter from './routes/showCase.route.js';
import volunteerRouter from './routes/volunteer.route.js';
import dashRouter from './routes/dashboard.route.js';
import contributionsRouter from './routes/contributions.route.js';
dotenv.config();

const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}))
app.use(cookieParser());
app.use("/api/auth",authRouter);
app.use("/api/admin",eventsRouter);
app.use("/api/showcases",showCaseRouter);
app.use("/api/requests",requestsRouter);
app.use("/api/donations",donationRouter);
app.use("/api/volunteers",volunteerRouter);
app.use("/api/itemDonations",itemDonationRouter);
app.use("/api/dashboard",dashRouter);
app.use("/api/contributions",contributionsRouter);
connectDB();

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,"../FrontEnd/dist")));

    app.get("*",(req,res) => [
        res.sendFile(path.join(__dirname,"../FrontEnd" ,"dist","index.html"))
    ])
}
app.get("/",(req,res) => {
    res.send("Hello World");
});

const PORT = process.env.PORT || 5002;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});