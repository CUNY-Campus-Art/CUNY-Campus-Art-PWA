
import { createStore, combineReducers, applyMiddleware } from 'redux'

import { composeWithDevTools } from 'redux-devtools-extension'
import ReduxThunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import general from './general'
import user from './user'
import artDisplay from './artdisplay'

const rootReducer = combineReducers({
  general,
  user,
  artDisplay
})

/*  Type Checking Middlewares */
export type RootState = ReturnType<typeof rootReducer>

const middleware = composeWithDevTools(applyMiddleware(
  ReduxThunk,
  createLogger({ collapsed: true })
))

const store = createStore(rootReducer, middleware)


export default store
