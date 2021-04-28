import { join } from "path";

import { config } from "dotenv";

config();

export const PUBLIC_DIRECTORY = join(__dirname, "../public/");

export const WEBSITE_URL = process.env.WEBSITE_URL;
