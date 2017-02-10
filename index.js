const React = require('react')
const ReactRouter = require('react-router')

const LOCATION_CHANGE = 'LOCATION_CHANGE'
const ROUTER_ACTION = 'ROUTER_ACTION'

const ConnectedRouter = React.createClass({
  propTypes: {
    history: React.PropTypes.object.isRequired,
    store: React.PropTypes.shape({
      dispatch: React.PropTypes.func
    }).isRequired,
    routes: React.PropTypes.arrayOf(React.PropTypes.shape({
      path: React.PropTypes.string,
      exact: React.PropTypes.bool,
      component: React.PropTypes.function
    }))
  },

  componentWillMount() {
    const locationHandle = () =>
      this.props.store.dispatch(locationChange({
        location: this.props.history.location,
        match: getRouteMatch(this.props.routes, this.props.history.location.pathname)
      }))

    this.unlisten = this.props.history.listen(locationHandle)
  },

  componentWillUnmount() {
    this.unlisten()
  },

  render() {
    return React.createElement(
      ReactRouter.Router,
      { history: this.props.history },
      this.props.children
    )
  }
})

const getRouteMatch = function getRouteMatch(routes, pathname) {
  return !routes ? null : routes
    .map(r => ReactRouter.matchPath(pathname, r.path, { exact: true }))
    .filter(r => r !== null)[0] || null
}

const routerMiddleware = function routerMiddleware(history) {
  return () => next => action => {
    if (action.type !== ROUTER_ACTION) return next(action)
    history[action.payload.method](...action.payload.args)
  }
}

const routerReducer = function routerReducer(state = { location: { pathname: null }, match: null }, action) {
  return action.type === LOCATION_CHANGE ? action.payload : state
}

const locationChange = function locationChange(payload) {
  return { type: LOCATION_CHANGE, payload }
}

const setLocation = function setLocation(url, routes) {
  return {
    type: LOCATION_CHANGE,
    payload: {
      location: {
        pathname: url
      },
      match: getRouteMatch(routes, url)
    }
  }
}

const updateLocation = function updateLocation(method) {
  return (...args) => ({
    type: ROUTER_ACTION,
    payload: { method, args }
  })
}

const push = updateLocation('push')
const replace = updateLocation('replace')
const go = updateLocation('go')
const goBack = updateLocation('goBack')
const goForward = updateLocation('goForward')

exports.LOCATION_CHANGE = LOCATION_CHANGE
exports.ROUTER_ACTION = ROUTER_ACTION
exports.ConnectedRouter = ConnectedRouter
exports.getRouteMatch = getRouteMatch
exports.setLocation = setLocation
exports.routerReducer = routerReducer
exports.routerMiddleware = routerMiddleware
exports.router = { push, replace, go, goBack, goForward }
