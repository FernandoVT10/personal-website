export default `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">

    <style>
      body {
        margin: 0;
        box-sizing: border-box;
      }

      #content {
        display: block;
        margin: auto;
        width: 600px;
        background: #292929;
        background: #0c0c0c;
        color: #dfdfdf;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        padding-bottom: 40px;
      }

      #header {
        padding: 20px;
        background: #0c0c0c;
      }

      #title {
        margin: 0;
        font-size: 20px;
        color: #64DFDF;
        text-decoration: none;
        font-weight: bold;
      }

      #name {
        color: #64DFDF;
      }

      #container {
        padding: 0 40px;
      }

      #message {
        margin: 0;
        margin-top: 20px;
        line-height: 1.5;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div id="content">
      <div id="header">
        <a href="{websiteURL}" id="title">Fernando Vaca Tamayo</a>
      </div>

      <div id="container">
        <h3 id="name">{name}</h3>

        <p id="message">{message}</p>
      </div>
    </div>
  </body>
</html>
`;
