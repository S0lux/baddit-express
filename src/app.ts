import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";

import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";

import passport from "passport";
import session from "express-session";

import RedisStore from "connect-redis";
import { createClient } from "redis";

const app: Application = express();

let redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient
  .connect()
  .catch(console.error)
  .then(() => console.log("Connected to Redis"));

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:",
});

// CORS
const corsOptions = require("./config/cors");
app.use(cors(corsOptions.corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(
  session({
    store: redisStore,
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.ENV === "PRODUCTION",
      httpOnly: true,
      //domain: process.env.COOKIE_DOMAIN,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// Initialize passport and local strategy
require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

// Register routes
app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);

// Catch-all route
app.all("*", (req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "No api route found with this path.",
    },
  });
});

export default app;
