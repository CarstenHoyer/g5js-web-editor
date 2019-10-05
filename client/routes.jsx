import { Route } from 'react-router'
import React from 'react'
import IDEView from './modules/IDE/pages/IDEView'
import { stopSketch } from './modules/IDE/actions/ide'

const onRouteChange = (store) => {
  store.dispatch(stopSketch());
};

const routes = (store) => (
  <div className="router">
    <Route path="/" component={IDEView} onChange={() => { onRouteChange(store) }} />
  </div>
)

export default routes
