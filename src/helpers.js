import { matchPath } from 'react-router'

export const getRouteMatch = (routes, pathname) =>
  !routes ? null : routes
    .map(r => matchPath(pathname, r.path, { exact: true }))
    .filter(r => r !== null)[0] || nulle
