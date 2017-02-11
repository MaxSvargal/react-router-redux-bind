import { ROUTER_ACTION } from './actions'

const routerMiddleware = history =>
  () => next => action => {
    if (action.type !== ROUTER_ACTION) return next(action)
    history[action.payload.method](...action.payload.args)
  }

export default routerMiddleware
