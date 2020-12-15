import axios from 'axios'
import { RootState } from './index'
import { StrapiApiConnection } from './util'

import { rerenderArtDisplays, fetchPastArtworks } from './artdisplay'
/************ Type Checking State ************/

export interface Image {
  url: string,
  alternativeText: string
}

export interface Campus {
  campus_name: string,
}

export interface User {
  user_name: string
  first_name: string
  last_name: string
  email: string
  profile_picture: Image
  campus: Campus,
}

export interface UserState {
  user: User,
  campus: any,
  authToken: string
}

/******* TYPE CHECKING ACTIONS AND ACTION CREATORS ******/

// ACTION TYPES
export const GET_USER = 'GET_USER'
export const REMOVE_USER = 'REMOVE_USER'
export const GET_ALL_CAMPUSES = 'GET_ALL_CAMPUSES'
export const LOGIN_ERROR = 'LOGIN_ERROR'
export const SIGNUP_ERROR = 'SIGNUP_ERROR'
export const ADD_POINTS = 'ADD_POINTS'
export const REMOVE_POINTS = 'REMOVE_POINTS'

// INITIAL STATE

// Checks local storage to see if user was previously logged in. If so, retrieves, user info based on local storage. Otherwise, the default user is set to empty


let con: StrapiApiConnection = new StrapiApiConnection();
if (con.user) {
  con.syncRemoteToLocalUser()
  //localStorage.setItem('user', JSON.stringify(con.user))
};

/*
As of now 11/17, integrated directly in util.js class
console.log(localStorage.getItem('user'))
if(localStorage.getItem('user')) {
  currentUser = JSON.parse(String(localStorage.getItem('user')));
  jwt = JSON.parse(String(localStorage.getItem('jwt')));
} else {
  con = new StrapiApiConnection(); // if doesn't already exist in local storage, create a new connection
}
*/

let currentUser = con.user;
let authToken = con.authToken;

// ACTION CREATORS
interface getUserAction {
  type: typeof GET_USER
  payload: User
}

interface removeUserAction {
  type: typeof REMOVE_USER
  payload: User
}

interface GotAllCampusesAction {
  type: typeof GET_ALL_CAMPUSES
  payload: Campus[]
}

interface LoginErrorAction {
  type: typeof LOGIN_ERROR
}

interface SignupErrorAction {
  type: typeof SIGNUP_ERROR
}

export const getUser = (user: User) => ({ type: GET_USER, user })
export const removeUser = () => ({ type: REMOVE_USER })
export const loginError = () => ({ type: LOGIN_ERROR })
export const signupError = () => ({ type: SIGNUP_ERROR })

/*** THUNK CREATORS TO FETCH INFO FROM DATABASE ****/
const strapiUrl = "https://dev-cms.cunycampusart.com";

// export const me = () => async dispatch => {
//   try {
//     const res = await axios.get('/auth/me')
//     dispatch(getUser(res.data || defaultUser))
//   } catch (err) {
//     console.error(err)
//   }
// }

export const signupNewUser = (email: string, pw: string, username: string, firstName: string = "", lastName: string = "", file: any = '') => async (dispatch: any) => {
  let status = await con.createUser(email, pw, username, firstName, lastName, file)
  console.log("success", con.user)

  let newUser = {
    user_name: con.user.username,
    first_name: con.user.first_name,
    last_name: con.user.last_name,
    email: con.user.email,
    profile_picture: con.user.profile_picture,
    campus: con.user.campus,
    total_points: con.user.total_points,
    liked_artworks: con.user.liked_artworks,
    disliked_artworks: con.user.dislike_artworks,
    solved_artworks: con.user.solved_artworks
  }

  dispatch(getUser(newUser))

  //If there is a user assigned that means user was successfully added to database, so return true
  return con.user ? true : false;
}


/* modified loginAndGetToken functioning most recent 12/9 */
export const fetchUser = (id: string, pw: string) => async (dispatch: any) => {
try {
  let returnData: any = await con.loginUser(id, pw)

  if (returnData.status === 200) {

    let user = {
      user_name: con.user.username,
      first_name: con.user.first_name,
      last_name: con.user.last_name,
      email: con.user.email,
      profile_picture: con.user.profile_picture,
      campus: con.user.campus ? con.user.campus.campus_name : '',
      campusId: con.user.campus ? con.user.campus.campusid : '',
      scanned_artworks: con.user.scanned_artworks,
      total_points: con.user.total_points,
      liked_artworks: con.user.liked_artworks,
      disliked_artworks: con.user.dislike_artworks,
      solved_artworks: con.user.solved_artworks
    }

    localStorage.setItem('jwt', JSON.stringify(returnData.data.jwt));
    localStorage.setItem('user', JSON.stringify(user)); // save specific fields from user
    console.log('You have been successfully logged in. You will be redirected in a few seconds...')
    dispatch(getUser(returnData.data.user))
    dispatch(fetchPastArtworks(returnData.data.user))
  }

  if (returnData.status === -1) {
    console.log('Incorrect username or password')
    dispatch(loginError())
  }
}
catch(error) {
   dispatch(loginError())
}

}

//This was added so that artwork could be added to database without any errors and duplicate con objets
export const addScannedArtDisplayToUserDB = (artworkId: any) => async (dispatch: any) => {
  await con.addScannedArtworkToUser([artworkId]);
  await con.syncRemoteToLocalUser();
  localStorage.setItem('user', JSON.stringify(con.user));
}

// export const auth = (email, password, method) => async dispatch => {
//   let res
//   try {
//     res = await axios.post(`/auth/${method}`, {email, password})
//   } catch (authError) {
//     return dispatch(getUser({error: authError}))
//   }

//   try {
//     dispatch(getUser(res.data))
//     history.push('/home')
//   } catch (dispatchOrHistoryErr) {
//     console.error(dispatchOrHistoryErr)
//   }
// }

// Clears local storage and removes user from s tate
export const logout = () => async (dispatch: any) => {
  try {
    //await axios.post('/auth/logout')
    localStorage.clear();
    //console.log(localStorage.getItem('user'), 'log out local storage clear')
    dispatch(removeUser())
    // history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

const defaultUser =
{
  user: currentUser,
  // campus: currentUser ? currentUser.campus.campus_name : '',
  authToken: authToken,
  error: '',
  total_points: currentUser.total_points,
  solved_artworks: '',
  unsolved_artworks: ''
}


/*********** TYPE CHECKING REDUCERS **********/

export default function (state = defaultUser, action: any) {
  switch (action.type) {
    case GET_USER:
      return { ...state, user: action.user, error: '' }
    case REMOVE_USER:
      return { ...state, user: '', authToken: '', campus: '', error: '' };
    case LOGIN_ERROR:
      return { ...state, error: 'Incorrect username or password' }
    default:
      return state
  }
}
