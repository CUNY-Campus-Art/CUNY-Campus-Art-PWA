import {
  GET_USER,
  REMOVE_USER,
  GET_ALL_CAMPUSES,
  LOGIN_ERROR,
  SIGNUP_ERROR,
  ADD_POINTS,
  REMOVE_POINTS,
  ADD_UNSOLVED_ARTWORKS,
  getUser,
  removeUser,
  loginError,
  signupError,
} from "./userActions";

import {
  formatUser, // this is more of a util function
  initializeUser,
  signupNewUser,
  fetchUser,
  addScannedArtDisplayToUserDB,
  logout,
} from "./userEffects";

export type { User, UserState } from "./userModels";

export {
  // User Actions
  GET_USER,
  REMOVE_USER,
  GET_ALL_CAMPUSES,
  LOGIN_ERROR,
  SIGNUP_ERROR,
  ADD_POINTS,
  REMOVE_POINTS,
  ADD_UNSOLVED_ARTWORKS,
  // User Action Creators
  getUser,
  removeUser,
  loginError,
  signupError,
  // User Thunks
  formatUser, // this is more of a util function
  initializeUser,
  signupNewUser,
  fetchUser,
  addScannedArtDisplayToUserDB,
  logout,
};
