import { ROUTER_ACTION } from './actions'

const routerMiddleware = history =>
  () => next => action => {
    const { type, payload: { method, args } } = action
    if (type !== ROUTER_ACTION) return next(action)
    history[method](...args)
  }

export default routerMiddleware
