import { createTransport } from "nodemailer";

import { MAIL_CONFIG } from "../config";

const transporter = createTransport({
  host: MAIL_CONFIG.host,
  port: parseInt(MAIL_CONFIG.port) | 0,
  auth: {
    user: MAIL_CONFIG.user,
    pass: MAIL_CONFIG.pass
  }
});

export default transporter;
