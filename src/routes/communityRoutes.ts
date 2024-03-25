import express from "express";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import { communityController } from "../controllers/communityController";
import { communityValidators } from "../validators/communityValidators";
const router = express.Router();

router.post(
  "/",
  communityValidators.create,
  ensureAuthenticated,
  communityController.createCommunity
);

router.get("/:communityName", communityController.getCommunity);

export default router;
