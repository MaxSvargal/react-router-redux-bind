const React = require('react')
const ReactTestUtils = require('react-addons-test-utils')
const configureStore = require('redux-mock-store').default
const ReactRouter = require('react-router')
const createHistory = require('history').createMemoryHistory

const {
  ConnectedRouter,
  routerMiddleware,
  router,
  routerReducer,
  setLocation
} = require('./index.js')

const routes = [ { path: '/', exact: true }, { path: '/foo/:id' } ]
const children = React.createElement('div')

describe('ReactRouterReduxBind', () => {
  let history
  let renderer
  let store
  let element
  let component
  let result

  beforeEach(() => {
    history = createHistory()
    renderer = ReactTestUtils.createRenderer()
    store = configureStore([ routerMiddleware(history) ])({})
    element = React.createElement(ConnectedRouter, { history, store, routes }, children)
    component = renderer.render(element)
    result = renderer.getRenderOutput()
  })

  test('should render ReactRouter correctly', () => {
    expect(result.type).toBe(ReactRouter.Router)
    expect(result.props.history).toEqual(history)
    expect(result.props.children.type).toEqual('div')
  })

  test('should directly calls of history methods works correctly', () => {
    expect(result.props.history.length).toBe(1)
    expect(result.props.history.action).toBe('POP')
    expect(result.props.history.location.pathname).toBe('/')

    result.props.history.push('/foo/1?filter=0', { id: 1 })
    expect(result.props.history.length).toBe(2)
    expect(result.props.history.action).toBe('PUSH')
    expect(result.props.history.location.pathname).toBe('/foo/1')
  })

  test('should routerMiddleware work correctly', () => {
    store.dispatch(router.push({
      pathname: '/foo/1',
      search: '?the=query',
      state: { from: '/' }
    }))

    const action = store.getActions()[0]
    expect(action.type).toBe('LOCATION_CHANGE')
    expect(action.payload.location.pathname).toBe('/foo/1')
    expect(action.payload.location.search).toBe('?the=query')
    expect(action.payload.location.state).toEqual({ from: '/' })
    expect(action.payload.match).toEqual({
      isExact: true,
      params: { 'id': '1' },
      path: '/foo/:id',
      url: '/foo/1'
    })

    const history = result.props.history
    expect(history.action).toBe('PUSH')
    expect(history.location.pathname).toBe('/foo/1')
    expect(history.location.search).toBe('?the=query')
    expect(history.location.state).toEqual({ from: '/' })
  })

  test('should unlisten history after unmount', () => {
    renderer.unmount()
    router.push('/foo')
    expect(result.props.history.length).toBe(1)
  })

  test('should router actions works correctly', () => {
    expect(router.push('/foo')).toEqual(
      { type: 'ROUTER_ACTION', payload: { method: 'push', args: [ '/foo' ] } })

    expect(router.replace('/bar', { from: '/' })).toEqual(
      { type: 'ROUTER_ACTION', payload: { method: 'replace', args: [ '/bar', { from: '/' } ] } })

    expect(router.go(-2)).toEqual(
      { type: 'ROUTER_ACTION', payload: { method: 'go', args: [ -2 ] } })

    expect(router.goBack()).toEqual(
      { type: 'ROUTER_ACTION', payload: { method: 'goBack', args: [] } })

    expect(router.goForward()).toEqual(
      { type: 'ROUTER_ACTION', payload: { method: 'goForward', args: [] } })
  })

  test('should routerReducer return default value', () => {
    const action = { type: 'RANDOM', payload: {} }
    const expected = { location: { pathname: null }, match: null }
    expect(routerReducer(undefined, action)).toEqual(expected)
  })

  test('should routerReducer store location', () => {
    const action = {
      type: 'LOCATION_CHANGE',
      payload: {
        location: { pathname: '/foo' },
        match: { path: '/foo', url: '/foo' }
      }
    }
    expect(routerReducer({}, action)).toEqual(action.payload)
  })

  test('should setLocation work correctly', () => {
    const action = setLocation('/foo/1', routes)
    const expected = {
      type: 'LOCATION_CHANGE',
      payload: {
        location: { pathname: '/foo/1' },
        match: {
          isExact: true,
          path: '/foo/:id',
          url: '/foo/1',
          params: {
            id: '1'
          }
        }
      }
    }
    expect(action).toEqual(expected)
  })

  test('should setLocation return match as null when no match', () => {
    const action = setLocation('/bar', routes)
    const expected = {
      type: 'LOCATION_CHANGE',
      payload: {
        location: { pathname: '/bar' },
        match: null
      }
    }
    expect(action).toEqual(expected)
  })

  test('should setLocation return match as null when no routes', () => {
    const action = setLocation('/bar')
    const expected = {
      type: 'LOCATION_CHANGE',
      payload: {
        location: { pathname: '/bar' },
        match: null
      }
    }
    expect(action).toEqual(expected)
  })
})
