import { getRouteMatch } from './helpers'

export const LOCATION_CHANGE = 'LOCATION_CHANGE'
export const ROUTER_ACTION = 'ROUTER_ACTION'

const updateLocation = method => (...args) =>
  ({ type: ROUTER_ACTION, payload: { method, args } })

const push = updateLocation('push')
const replace = updateLocation('replace')
const go = updateLocation('go')
const goBack = updateLocation('goBack')
const goForward = updateLocation('goForward')

export const router = { push, replace, go, goBack, goForward }

export const locationChange = payload =>
  ({ type: LOCATION_CHANGE, payload })

export const setLocation = (url, routes) => ({
  type: LOCATION_CHANGE,
  payload: {
    location: { pathname: url },
    match: getRouteMatch(routes, url)
  }
})
