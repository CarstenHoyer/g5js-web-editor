export function renderIndex() {
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="keywords" content="g5.js, g5.js web editor, p5.js, web editor, code editor, gcode, plotter" />
      <meta name="description" content="A web editor for g5.js, a JavaScript library build on top of p5.js to enable creative gcode editing." />
      <title>g5.js Web Editor</title>
      ${process.env.NODE_ENV === 'production' ? `<link rel='stylesheet' href='${assetsManifest['/app.css']}' />` : ''}
      <link href='https://fonts.googleapis.com/css?family=Inconsolata' rel='stylesheet' type='text/css'>
      <link href='https://fonts.googleapis.com/css?family=Montserrat:400,700' rel='stylesheet' type='text/css'>
      <link rel='shortcut icon' href='https://raw.githubusercontent.com/processing/p5.js-website-OLD/master/favicon.ico' type='image/x-icon'/ >
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
      <script src='${process.env.NODE_ENV === 'production' ? `${assetsManifest['/app.js']}` : '/app.js'}'></script>
      <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-XXXXX', 'auto');
        ga('send', 'pageview');

      </script>
    </body>
  </html>
  `;
}
