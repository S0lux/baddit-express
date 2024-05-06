import express from "express";
import { commentController } from "../controllers/commentController";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const router = express.Router();

router.get("/", commentController.getCommentsWithQueries);

router.use(ensureAuthenticated);

router.post("/", commentController.createComment);

export default router;
