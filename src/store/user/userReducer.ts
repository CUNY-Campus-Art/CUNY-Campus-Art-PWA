import { StrapiApiConnection } from "../util";

import {
  GET_USER,
  REMOVE_USER,
  GET_ALL_CAMPUSES,
  LOGIN_ERROR,
  SIGNUP_ERROR,
  ADD_POINTS,
  REMOVE_POINTS,
  ADD_UNSOLVED_ARTWORKS,
  initializeUser,
} from "./index";

// INITIAL STATE
// Checks local storage to see if user was previously logged in. If so, retrieves, user info based on local storage. Otherwise, the default user is set to empty
let con: StrapiApiConnection = new StrapiApiConnection();

let currentUser;

if (con.user) {
  initializeUser(con.user);
  currentUser = con.user;
}

const defaultUser = {
  user: currentUser ? currentUser : "",
  error: "",
  total_points: currentUser ? currentUser.total_points : "",
  solved_artworks: currentUser ? currentUser.solved_artworks : "",
  //unsolved_artworks: currentUser.unsolved_artworks
};

/*********** TYPE CHECKING REDUCERS **********/

export default function (state = defaultUser, action: any) {
  switch (action.type) {
    case GET_USER:
      return { ...state, user: action.payload, error: "" };
    case REMOVE_USER:
      return {
        user: "",
        authToken: "",
        error: "",
        total_points: "",
        solved_artworks: [],
      };
    case LOGIN_ERROR:
      return { ...state, error: "Incorrect username or password" };
    // case ADD_UNSOLVED_ARTWORKS:
    //   return {...state, unsolved_artworks: action.payload}
    default:
      return state;
  }
}
