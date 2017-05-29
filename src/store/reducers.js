import { combineReducers } from 'redux'
import { REQUEST_PROVIDERS, RECEIVE_PROVIDERS, REQUEST_CLIENT, RECEIVE_CLIENT } from './actions.js'

function providers(state = {}, action) {
  let nextResultObj;
  switch (action.type) {
    case REQUEST_PROVIDERS:
      nextResultObj = {...state[action.needId], loaded: false};
      return {...state, [action.needId]: nextResultObj};
    case RECEIVE_PROVIDERS:
      nextResultObj = {...state[action.needId], result: action.providers, loaded: true};
      return {...state, [action.needId]: nextResultObj}
    default:
      return state
  }
}

  // searchResultsByNeedId = {
  //   10: {
  //     result: [provider, provider, provider, ...],
  //     loaded: true
  //   }
  // }
  // This object can be flushed whenever a new client page is opened up

function clients(state = {loaded: false, items: {}}, action) {
  switch (action.type) {
    case REQUEST_CLIENT:
      return {...state, loaded: false}
    case RECEIVE_CLIENT:
      let nextItems = {...state.items, [action.id]: action.client}
      return {...state, items: nextItems, loaded: true}
    default:
      return state
  }
}

export const rootReducer = combineReducers({
  providers,
  clients
});
