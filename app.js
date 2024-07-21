import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { userRoute } from './routes/userRoute.js';
import captureIpAddress from './middlewares/captureIP.js';


dotenv.config({ path: './config/config.env' });


export const app = express();

app.set('trust proxy', true);
app.use(captureIpAddress);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({ 
    origin: [process.env.LOCAL_URL, process.env.WEB_URL], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));


app.use("/api/v1", userRoute);

app.get('/', (req, res) => {
    res.send(`IP Address: ${req.userIp}`);
    console.log("IP Address is: ", req.userIp);
})