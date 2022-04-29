import type { User } from ".";

/******* TYPE CHECKING ACTIONS AND ACTION CREATORS ******/

// ACTION TYPES
export const GET_USER = "GET_USER";
export const REMOVE_USER = "REMOVE_USER";
export const GET_ALL_CAMPUSES = "GET_ALL_CAMPUSES";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const SIGNUP_ERROR = "SIGNUP_ERROR";
export const ADD_POINTS = "ADD_POINTS";
export const REMOVE_POINTS = "REMOVE_POINTS";
export const ADD_UNSOLVED_ARTWORKS = "ADD_UNSOLVED_ARTWORKS";

// ACTION CREATORS
interface getUserAction {
  type: typeof GET_USER;
  payload: User;
}

interface removeUserAction {
  type: typeof REMOVE_USER;
  payload: User;
}

interface LoginErrorAction {
  type: typeof LOGIN_ERROR;
}

interface SignupErrorAction {
  type: typeof SIGNUP_ERROR;
}

interface AddPointsToUserAction {
  type: typeof ADD_POINTS;
  payload: number;
}

export const getUser = (user: any) => ({ type: GET_USER, payload: user });
export const removeUser = () => ({ type: REMOVE_USER });
export const loginError = () => ({ type: LOGIN_ERROR });
export const signupError = () => ({ type: SIGNUP_ERROR });
