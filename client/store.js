import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import { clearState, loadState } from './persistState'

const __process = (typeof global !== 'undefined' ? global : window).process

export default function configureStore(initialState) {
  const enhancers = [
    applyMiddleware(thunk)
  ]

  let composeEnhancers = compose
  if (__process.env.CLIENT && __process.env.NODE_ENV === 'development') {
    // Enable DevTools only when rendering on client and during development.
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  }

  const savedState = loadState()
  clearState()

  const store = createStore(
    rootReducer,
    savedState != null ? savedState : initialState,
    composeEnhancers(...enhancers)
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default // eslint-disable-line global-require
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
