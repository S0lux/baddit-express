import express from "express";
import { commentController } from "../controllers/commentController";
import ensureEmailVerified from "../middlewares/ensureEmailVerified";

const router = express.Router();

router.get("/", commentController.getCommentsWithQueries);

router.use(ensureEmailVerified);

router.post("/", commentController.createComment);

export default router;
