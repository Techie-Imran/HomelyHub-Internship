import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import {router} from "./routes/userRoutes.js"
import { propertyRouter } from "./routes/propertyRouter.js";
import { bookingRouter } from "./routes/bookingRouter.js";
import { tripRouter } from "./routes/tripRouter.js";


import connectDB from "./utils/db.js";

dotenv.config();

const app = express();

//express.json
app.use(express.json({limit:"100mb"}))

//urlencoded
app.use(express.urlencoded({limit:"100mb", extended:true}))

//cookieParser
app.use(cookieParser())

const configuredOrigins = process.env.ORIGIN_ACCESS_URL
  ? process.env.ORIGIN_ACCESS_URL.split(",").map((url) => url.trim().replace(/\/+$/, ""))
  : [];

const defaultOrigins = [
  "http://localhost:5173",
  "https://homelyhubrent.netlify.app",
];

const allowedOrigins = Array.from(new Set([...configuredOrigins, ...defaultOrigins]));

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/+$/, "");
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

const port = process.env.PORT;


//test route
app.get("/",(req,res)=>{
    res.send("Homelyhub server is running")
})

app.use("/api/v1/rent/user",router)
app.use("/api/v1/rent/listing",propertyRouter)
app.use("/api/v1/rent/user/booking", bookingRouter)
app.use("/api/v1/rent/trip", tripRouter)


connectDB();

app.listen(port,()=>{
    console.log(`App is running on port no: ${port}`);
})