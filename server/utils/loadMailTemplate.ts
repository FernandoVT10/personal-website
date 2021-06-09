import { readFileSync } from "fs";

export default (templateName: string, variables: object): string => {
  const data = readFileSync(`${__dirname}/mailTemplates/${templateName}.html`);
  let template = data.toString();

  Object.keys(variables).forEach(key => {
    template = template.replace(`{${key}}`, variables[key]);
  });

  return template;
}
