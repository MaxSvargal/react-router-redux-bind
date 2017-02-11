const React = require('react')
const ReactTestUtils = require('react-addons-test-utils')
const configureStore = require('redux-mock-store').default
const ReactRouter = require('react-router')
const createHistory = require('history').createMemoryHistory
const { ConnectedRouter, routerMiddleware, router } = require('./index.js')

const history = createHistory()
const renderer = ReactTestUtils.createRenderer()
const mockStore = configureStore([ routerMiddleware(history) ])
const routes = [ { path: '/', exact: true }, { path: '/foo/:id' } ]

describe('ReactRouterReduxBind', () => {
  let store
  let element
  let component
  let result

  beforeEach(() => {
    store = mockStore({})
    element = React.createElement(ConnectedRouter, { history, store, routes })
    component = renderer.render(element)
    result = renderer.getRenderOutput()
  })

  test('should render ReactRouter correctly', () => {
    expect(result.type).toBe(ReactRouter.Router)
    expect(result.props).toEqual({ history })
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
})
