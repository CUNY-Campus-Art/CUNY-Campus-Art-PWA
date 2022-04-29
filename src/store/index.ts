import { createStore, combineReducers, applyMiddleware } from "redux";

import { composeWithDevTools } from "redux-devtools-extension";
import ReduxThunk from "redux-thunk";
import { createLogger } from "redux-logger";

import general from "./general/generalReducer";
import user from "./user/userReducer";
import artDisplay from "./artdisplay/artdisplayReducer";

const rootReducer = combineReducers({
  general,
  user,
  artDisplay,
});

/*  Type Checking Middlewares */
export type RootState = ReturnType<typeof rootReducer>;

const middleware = composeWithDevTools(
  applyMiddleware(ReduxThunk, createLogger({ collapsed: true }))
);

const store = createStore(rootReducer, middleware);

export default store;
