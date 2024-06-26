import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Import Routers
import userRouter from "./routes/auth.routes.js";
import contactRouter from "./routes/contact.routes.js";

// Import custom middlewares
import { sendErrorResponse } from "./middlewares/general.middlewares.js";

let isDBConnected = false;

// ENV setup & DB Connection
dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then((res) => {
    console.log("Connected to the database.");
    isDBConnected = true;
  })
  .catch((err) => console.log("Couldn't connect to the Database.", err));

// Create server & use necessary middlewares
const app = express();
app.use(cors({ origin: process.env.FRONTEND_ENDPOINT }));
app.use(express.json());
app.use(express.static("static"));

// path to validate application is working
app.get("/", (req, res) =>
  res.json({
    success: true,
    data: { appRunning: true, dbConnected: isDBConnected },
  })
);

// use api routes
app.use("/api/users/", userRouter);
app.use("/api/contact/", contactRouter);

// use custom middlewares
app.use(sendErrorResponse);

// Bind server to PORT & start listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
