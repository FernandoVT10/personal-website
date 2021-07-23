import { Technology, ITechnology } from "../../models";

import { AuthenticationError, ValidationError } from "apollo-server-express";

interface Parameters {
  name: string
}

export default async (_: null, args: Parameters, context: { loggedIn: boolean }): Promise<ITechnology> => {
  if(!context.loggedIn) throw new AuthenticationError("You don't have enough permissions");

  const { name } = args;

  if(await Technology.exists({ name })) {
    throw new ValidationError(`The technology "${name}" already exists`);
  }

  return await Technology.create({ name });
}
