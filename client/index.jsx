import React from 'react'
import { render } from 'react-dom'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import configureStore from './store'
import routes from './routes'

require('./styles/main.scss')

const initialState = window.__INITIAL_STATE__

const store = configureStore(initialState)

const AppWrapper = () => (
  <Provider store={store}>
    <Router>
      {routes(store)}
    </Router>
  </Provider>
)

const HotApp = hot(AppWrapper)

render(
  <HotApp />,
  document.getElementById('root')
)
