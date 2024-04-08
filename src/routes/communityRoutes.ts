import express from "express";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import { communityController } from "../controllers/communityController";
import { communityValidators } from "../validators/communityValidators";

const router = express.Router();

router.get("/:communityName", communityController.getCommunity);

router.use(ensureAuthenticated);

router.post("/", communityValidators.create, communityController.createCommunity);
router.post("/:communityName/member", communityController.joinCommunity);

export default router;
