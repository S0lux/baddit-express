import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";

import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import communityRouter from "./routes/communityRoutes";
import postRouter from "./routes/postRoutes";
import commentRouter from "./routes/commentRoutes";

import passport from "passport";
import session from "express-session";
import handleError from "./middlewares/handleError";

import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";

const app: Application = express();

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// CORS
const { corsOptions } = require("./config/cors");
app.use(cors(corsOptions));

// Basic middlewares
app.use(morgan("dev"));
app.use(express.json());

// Session configuration
const { sessionOptions } = require("./config/session");
app.use(session(sessionOptions));

// Initialize passport and local strategy
require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

// Register routes
app.use("/v1/auth", authRouter);
app.use("/v1/users", userRouter);
app.use("/v1/communities", communityRouter);
app.use("/v1/posts", postRouter);
app.use("/v1/comments", commentRouter);

app.use(handleError);

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
