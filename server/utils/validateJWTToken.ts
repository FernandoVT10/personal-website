import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { DASHBOARD_USERNAME, DASHBOARD_PASSWORD, JWT_SECRET_KEY } from "../config";

export default async (token: string): Promise<boolean> => {
  try {
    const data = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;

    const checkPassword = await bcrypt.compare(data.password, DASHBOARD_PASSWORD);
    if(data.username == DASHBOARD_USERNAME && checkPassword) {
      return true;
    }
  } catch {}

  return false;
}
