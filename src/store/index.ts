
import { createStore, combineReducers, Middleware, applyMiddleware } from 'redux'

import { composeWithDevTools } from 'redux-devtools-extension'
import ReduxThunk from 'redux-thunk'
import * as promiseMiddleware from 'redux-promise';
import { createLogger } from 'redux-logger'


import artDisplay from './artdisplay'
import user from './user'


const rootReducer = combineReducers({
  artDisplay,
  user
})

/*  Type Checking Middlewares */
export type RootState = ReturnType<typeof rootReducer>

const middleware = composeWithDevTools(applyMiddleware(
  ReduxThunk,
  createLogger({ collapsed: true })
))

const store = createStore(rootReducer, middleware)

export default store
