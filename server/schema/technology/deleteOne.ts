import { Technology, ITechnology } from "../../models";

import { AuthenticationError, UserInputError } from "apollo-server-express";

interface Parameters {
  technologyId: string
}

export default async (_: null, args: Parameters, context: { loggedIn: boolean }): Promise<ITechnology> => {
  if(!context.loggedIn) throw new AuthenticationError("You don't have enough permissions");

  const { technologyId } = args;

  const technology = await Technology.findById(technologyId);

  if(!technology) throw new UserInputError(`The technology "${technologyId}" doesn't exist`);

  return await technology.delete();
}
