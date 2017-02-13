# react-router-redux-bind

[![Build Status](https://travis-ci.org/MaxSvargal/react-router-redux-bind.svg?branch=master)](https://travis-ci.org/MaxSvargal/react-router-redux-bind)
[![Coverage Status](https://coveralls.io/repos/github/MaxSvargal/react-router-redux-bind/badge.svg?branch=master)](https://coveralls.io/github/MaxSvargal/react-router-redux-bind?branch=master)
[![Dependencies Status](https://david-dm.org/MaxSvargal/react-router-redux-bind.svg)](https://david-dm.org/MaxSvargal/react-router-redux-bind)

Redux bindings for React Router Next v4

## Installation
`npm install --save react-router-redux-bind`


## Tutorial
A simple example of connecting to redux

```javascript
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import { Route } from 'react-router'

import {
  ConnectedRouter,
  routerMiddleware,
  routerReducer as router
} from 'react-router-redux-bind'

import reducers from './reducers'
import routes from './routes'

const history = createBrowserHistory()
const reducers = combineReducers({ ...reducers, router })
const middleware = routerMiddleware(history)
const store = createStore(reducers, applyMiddleware(middleware))

render(
  <Provider store={ store } >
    <ConnectedRouter history={ history } store={ store } routes={ routes } >
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('content')
)
```

## Actions
```javascript
import { router } from 'react-router-redux-bind'

store.dispatch(router.push('/'))
store.dispatch(router.replace({ pathname: '/foo/1', search: { from: '/' } }))
store.dispatch(router.go(-2)
store.dispatch(router.goBack()
store.dispatch(router.goForward()
```

## Routes
You can store a react-router match props through passing to `ConnectedRouter` a simple [route config](https://github.com/ReactTraining/react-router/blob/v4/packages/react-router-website/modules/examples/RouteConfig.js) looks like:

```javascript
export default [
  { path: '/', exact: true, component: require('containers/home') },
  { path: '/topics', component: require('containers/topics') }
  { path: '/topics/:id', component: require('containers/topic') }
]
```

And after action `LOCATION_CHANGE`
```javascript
store.dispatch(router.push('/topics/1'))

expect(store.getState()).toEqual({
  router: {
    location: {
      pathname: '/topics/1'
    },
    match: {
      params: {
        id: '1'
      },
      path: '/topics/:id',
      url: '/topics/1'
    }
  }
})
```

## Server side
Just use [`<StaticRouter />`](https://reacttraining.com/react-router/#staticrouter) and dispatch `setLocation` action creator, pass request url and [route config](https://github.com/ReactTraining/react-router/blob/v4/packages/react-router-website/modules/examples/RouteConfig.js).

```javascript
  const routes = require('./routes')
  const { request: { url } } = ctx // koa.js
  store.dispatch(setLocation(url, routes))
```


## Use it with [redux-saga](https://github.com/redux-saga/redux-saga)

```javascript
export function* saga() {
  while (true) {
    try {
      const { payload: { match: { path } } } = yield take(LOCATION_CHANGE)
      if (path === '/some') {
        const collection = yield call(fetchSomeCollection)
        yield put(setSomeCollection(collection))
        yield put(router.push('/another'))
      }
    } catch (err) {
      yield call(onError, err)
    }
  }
}
```
