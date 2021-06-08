import { join } from "path";

import { config } from "dotenv";

config();

export const PUBLIC_DIRECTORY = join(__dirname, "../public/");

export const WEBSITE_URL = process.env.WEBSITE_URL;

export const MY_EMAIL = process.env.MY_EMAIL;

export const MAIL_CONFIG = {
  port: process.env.MAIL_PORT,
  host: process.env.MAIL_HOST,
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS
}
