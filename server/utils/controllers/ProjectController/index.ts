import getOne from "./getOne";
import getAll from "./getAll";
import getRelatedProjects from "./getRelatedProjects";

import createOne from "./createOne";
import updateOne from "./updateOne";
import deleteOne from "./deleteOne";

import { ISize } from "../ImageController";

export const PROJECT_IMAGES_SIZES: ISize[] = [
  { width: 622, height: 350 },
  { width: 1024, height: 576 }
];

export default {
  getOne,
  getAll,
  getRelatedProjects,
  createOne,
  updateOne,
  deleteOne
}
