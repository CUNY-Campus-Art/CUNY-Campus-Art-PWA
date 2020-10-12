
import { createStore, combineReducers, Middleware, applyMiddleware } from 'redux'

import { composeWithDevTools } from 'redux-devtools-extension'
import ReduxThunk from 'redux-thunk'
import * as promiseMiddleware from 'redux-promise';
import { createLogger } from 'redux-logger'


import artDisplay from './artdisplay'

const rootReducer = combineReducers({
  artDisplay
})

/*  Type Checking Middlewares */
export type RootState = ReturnType<typeof rootReducer>
export const exampleMiddleware: Middleware<
  {}, // legacy type parameter added to satisfy interface signature
  RootState
> = store => next => action => {
  // code here
}


const middleware = composeWithDevTools(applyMiddleware(
  ReduxThunk,
  createLogger({ collapsed: true })
))

const store = createStore(rootReducer, middleware)

export default store
