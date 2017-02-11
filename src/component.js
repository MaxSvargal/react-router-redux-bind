
import { Component, PropTypes, createElement } from 'react'
import { Router } from 'react-router'
import { locationChange } from './actions'
import { getRouteMatch } from './helpers'

export default class ConnectedRouter extends Component {
  componentWillMount() {
    this.unlisten = this.props.history.listen(() => {
      const { store, routes, history: { location } } = this.props
      const match = getRouteMatch(routes, location.pathname)
      store.dispatch(locationChange({ location, match }))
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const { history, children } = this.props
    return createElement(Router, { history }, children)
  }
}

ConnectedRouter.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.shape({ dispatch: PropTypes.func }).isRequired,
  routes: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    exact: PropTypes.bool,
    component: PropTypes.function
  }))
}
