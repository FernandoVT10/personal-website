export default (template: string, variables: object): string => {
  Object.keys(variables).forEach(key => {
    template = template.replace(`{${key}}`, variables[key]);
  });

  return template;
}
