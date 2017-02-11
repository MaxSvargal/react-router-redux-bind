import { LOCATION_CHANGE } from './actions'

const routerReducer =
  (state = { location: { pathname: null }, match: null }, { type, payload }) =>
    type === LOCATION_CHANGE ? payload : state

export default routerReducer
