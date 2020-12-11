
import { createStore, combineReducers, Middleware, applyMiddleware } from 'redux'

import { composeWithDevTools } from 'redux-devtools-extension'
import ReduxThunk from 'redux-thunk'
import { createLogger } from 'redux-logger'


import artDisplay from './artdisplay'
import user from './user'
import general from './general'


const rootReducer = combineReducers({
  artDisplay,
  user,
  general
})

/*  Type Checking Middlewares */
export type RootState = ReturnType<typeof rootReducer>

const middleware = composeWithDevTools(applyMiddleware(
  ReduxThunk,
  createLogger({ collapsed: true })
))

const store = createStore(rootReducer, middleware)

export default store
