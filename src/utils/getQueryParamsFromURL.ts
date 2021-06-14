const getQueryParamsFromURL = (url: string): { [key: string]: string } => {
  const params = {};

  const query = url.substring(1);
  const variables = query.split("&");

  variables.forEach(variable => {
    const [key, value] = variable.split("=");
    params[key] = value;
  });

  return params;
}

export default getQueryParamsFromURL;
