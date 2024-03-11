import express, { Application } from "express";
import morgan from "morgan";
import authRouter from "./routes/authRoutes";

const app: Application = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/v1/auth", authRouter);

app.all("*", (req, res) => {
  res.status(400).json({
    error: {
      code: "NOT_FOUND",
      message: "No api route found with this path.",
    },
  });
});

export default app;
