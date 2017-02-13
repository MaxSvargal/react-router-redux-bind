import { ROUTER_ACTION } from './actions'

const routerMiddleware = history =>
  () => next => action => {
    if (action.type !== ROUTER_ACTION) return next(action)
    const { payload: { method, args } } = action
    history[method](...args)
  }

export default routerMiddleware
