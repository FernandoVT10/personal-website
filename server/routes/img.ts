import { Router, Request, Response, NextFunction } from "express";

import ImageController from "../utils/controllers/ImageController";

const router = Router();

export const getImageHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { imageKey } = req.params;

  try {
    const image = await ImageController.getImage(imageKey);
    res.setHeader("Content-Type", image.ContentType);
    res.send(image.Body);
  } catch {
    next();
  }
}

router.get("/:imageKey", getImageHandler);


export default router;
