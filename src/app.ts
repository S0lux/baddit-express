import express, { Application } from "express";
import morgan from "morgan";
import authRouter from "./routes/authRoutes";

const app: Application = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/v1/auth", authRouter);

export default app;
