export function renderIndex() {
  const assetsManifest =
    process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="keywords" content="g5.js, g5.js web editor, p5.js, web editor, code editor, gcode, plotter" />
      <meta name="description" content="A web editor for g5.js, a JavaScript library build on top of p5.js to enable creative gcode editing." />
      <title>g5.js Web Editor</title>
      ${
        process.env.NODE_ENV === "production"
          ? `<link rel='stylesheet' href='${assetsManifest["/app.css"]}' />`
          : ""
      }
      <link href='https://fonts.googleapis.com/css?family=Inconsolata' rel='stylesheet' type='text/css'>
      <link href='https://fonts.googleapis.com/css?family=Montserrat:400,700' rel='stylesheet' type='text/css'>
      <script>
        if (!window.process) {
          window.process = {};
        }
        if (!window.process.env) {
          window.process.env = {};
        }
        window.process.env.NODE_ENV = '${process.env.NODE_ENV}';
        window.process.env.CLIENT = true;
      </script>
    </head>
    <body>
      <div id="root" class="root-app">
      </div>
      <script src='${
        process.env.NODE_ENV === "production"
          ? `${assetsManifest["/app.js"]}`
          : "/app.js"
      }'></script>
    </body>
  </html>
  `;
}
