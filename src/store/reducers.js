import { combineReducers } from 'redux'
import { SEARCH_REQUESTED, SEARCH_RESPONSE_RECEIVED, REQUEST_CLIENT, RECEIVE_CLIENT, 
          REQUEST_DASHBOARD_CLIENT_DATA, RECEIEVE_DASHBOARD_CLIENT_DATA } from './actions.js'
import { needs } from './reducers/needReducers.js';
import _ from 'lodash'

function searchResultsByNeedId(state = {}, action) {
  let nextResultObj;
  switch (action.type) {
    case SEARCH_REQUESTED:
      nextResultObj = {...state[action.needId], loaded: false};
      return {...state, [action.needId]: nextResultObj};
    case SEARCH_RESPONSE_RECEIVED:
      nextResultObj = {...state[action.needId], result: action.providers, loaded: true};
      return {...state, [action.needId]: nextResultObj}
    default:
      return state
  }
}

function clients(state = {byId: {}, dashboard: {index: [], loaded: false} }, action) {
  let nextById;
  switch (action.type) {
    case REQUEST_CLIENT:
      nextById = { ...state.byId, [action.id]: { loaded: false } }
      return {...state, byId: nextById }
    case RECEIVE_CLIENT:
      nextById = {...state.byId, [action.id]: { ...action.client, loaded: true }}
      return {...state, byId: nextById }
    case REQUEST_DASHBOARD_CLIENT_DATA:
      return {...state, dashboard: {index: [], loaded: false}}
    case RECEIEVE_DASHBOARD_CLIENT_DATA:
      return {...state, dashboard: { index: action.clients, loaded: true } }   
    default:
      return state
  }
}
export const rootReducer = combineReducers({
  searchResultsByNeedId,
  clients,
  needs
});
