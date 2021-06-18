import { Technology, ITechnology } from "../../models";

export default async (): Promise<ITechnology[]> => {
  const technologies = await Technology.find();

  return technologies;
}
