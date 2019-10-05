import Express from 'express'

// Webpack requirements
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import serverRoutes from './routes/server.routes'
import config from '../webpack/config.dev'

const app = new Express()

const corsOriginsWhitelist = [
  /g5js\.org$/,
]

// Run Webpack dev server in development mode
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));

  corsOriginsWhitelist.push(/localhost/);
}

app.use('/', serverRoutes);

// Handle missing routes.
app.get('*', (req, res) => {
  res.status(404);
  res.send(`<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
    </head>
    <body>
      404 Not Found
    </body>
  </html>`);
})

// start app
app.listen(process.env.PORT, (error) => {
  if (!error) {
    console.log(`G5 web editor is running on port: ${process.env.PORT}!`)
  }
})

export default app
