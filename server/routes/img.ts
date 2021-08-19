import { Router } from "express";

import ImageController from "../utils/controllers/ImageController";

const router = Router();

router.get("/:imageKey", async (req, res) => {
  const { imageKey } = req.params;

  try {
    const image = await ImageController.getImage(imageKey);
    res.setHeader("Content-Type", image.ContentType);
    res.send(image.Body);
  } catch {
    res.sendStatus(404);
  }
});


export default router;
