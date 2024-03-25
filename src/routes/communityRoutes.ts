import express from "express";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import { communityController } from "../controllers/communityController";
const router = express.Router();

router.post("/", ensureAuthenticated, communityController.createCommunity);

router.get("/:communityName", communityController.getCommunity);

export default router;
