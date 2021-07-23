import { Technology, ITechnology } from "../../models";

import { AuthenticationError, ValidationError, UserInputError } from "apollo-server-express";

interface Parameters {
  technologyId: string
  name: string
}

export default async (_: null, args: Parameters, context: { loggedIn: boolean }): Promise<ITechnology> => {
  if(!context.loggedIn) throw new AuthenticationError("You don't have enough permissions");

  const { technologyId, name } = args;

  const technology = await Technology.findById(technologyId);

  if(!technology) throw new UserInputError(`The technology "${technologyId}" doesn't exist`);

  if(await Technology.exists({ name })) {
    throw new ValidationError(`The technology "${name}" already exists`);
  }

  technology.name = name;

  return await technology.save();
}
