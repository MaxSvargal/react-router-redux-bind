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

  getRouteMatch(pathname) {
    return !this.props.routes ? null : this.props.routes
      .map(({ path }) => ReactRouter.matchPath(pathname, path, { exact: true }))
      .filter(r => r !== null)[0] || null
  },

  componentWillMount() {
    const locationHandle = () =>
      this.props.store.dispatch(locationChange({
        location: this.props.history.location,
        match: this.getRouteMatch(this.props.history.location.pathname)
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

const routerMiddleware = function routerMiddleware(history) {
  return () => next => action => {
    if (action.type !== ROUTER_ACTION) return next(action)
    history[action.payload.method](...action.payload.args)
  }
}

const routerReducer = function routerReducer(state = null, action) {
  return action.type === LOCATION_CHANGE ? action.payload : state
}

const locationChange = function locationChange(payload) {
  return { type: LOCATION_CHANGE, payload }
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

exports.ConnectedRouter = ConnectedRouter
exports.locationChange = locationChange
exports.routerReducer = routerReducer
exports.routerMiddleware = routerMiddleware
exports.router = { push, replace, go, goBack, goForward }
