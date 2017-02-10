# react-router-redux-bind
Redux bindings for React Router Next v4

## Installation
`npm install --save react-router-redux-bind`


## Tutorial
A simple example connecting to redux

```javascript
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import { Route } from 'react-router'
import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux-bind'
import routes from './routes'

const history = createBrowserHistory()
const reducers = combineReducers({ ...reducer, router: routerReducer })
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

## Actions call
```javascript
import { router } from 'react-router-redux-bind'

store.dispatch(router.push('/'))
store.dispatch(router.replace({ pathname: '/foo/1', search: { from: '/' } }))
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
