import { StrapiApiConnection } from './util'
import { fetchPastArtworks, fetchUnsolvedArtworks } from './artdisplay'
import Axios from "axios";
import { hashPassword } from "./hashPassword";
/************ Type Checking State ************/

export interface Image {
  url: string,
  alternativeText: string
}

export interface User {
  id?: number,
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  profile_picture: any,
  campus?: any,
  campus_name: string,
  campus_id: any,
  scanned_artworks: any[],
  total_points: number,
  liked_artworks: any[],
  disliked_artworks: any[],
  solved_artworks: any[],
  unsolved_artworks?: any[]
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
export const ADD_UNSOLVED_ARTWORKS = 'ADD_UNSOLVED_ARTWORKS'
export const EDIT_USER = 'EDIT_USER'

// INITIAL STATE
console.log(window.localStorage)
// Checks local storage to see if user was previously logged in. If so, retrieves, user info based on local storage. Otherwise, the default user is set to empty
let con: StrapiApiConnection = new StrapiApiConnection();


export const initializeUser = (user: any) => async (dispatch: any) => {
  await con.syncRemoteToLocalUser()
  //user = await con.formatUser(user)

  console.log(user, "initialize user")
  dispatch(getUser(user))
  dispatch(fetchPastArtworks(user))
  dispatch(fetchUnsolvedArtworks(user))
}


let currentUser;

if (con.user) {
  initializeUser(con.user)
  currentUser = con.user
};


// ACTION CREATORS
interface getUserAction {
  type: typeof GET_USER
  payload: User
}

interface removeUserAction {
  type: typeof REMOVE_USER
  payload: User
}

interface LoginErrorAction {
  type: typeof LOGIN_ERROR
}

interface SignupErrorAction {
  type: typeof SIGNUP_ERROR
}

interface AddPointsToUserAction {
  type: typeof ADD_POINTS
  payload: number
}

interface EditUser {
  type: typeof EDIT_USER,
  payload: User
}

export const getUser = (user: any) => ({ type: GET_USER, payload: user })
export const removeUser = () => ({ type: REMOVE_USER })
export const loginError = () => ({ type: LOGIN_ERROR })
export const signupError = () => ({ type: SIGNUP_ERROR })
export const editUser = (user: any) => ({ type: EDIT_USER, payload: user })

// export const addUnsolvedArtworks = (artworks:any) => ({
//   type: ADD_UNSOLVED_ARTWORKS,
//   payload: artworks
// })

/*** THUNK CREATORS TO FETCH INFO FROM DATABASE ****/

// export const me = () => async dispatch => {
//   try {
//     const res = await axios.get('/auth/me')
//     dispatch(getUser(res.data || defaultUser))
//   } catch (err) {
//     console.error(err)
//   }
// }



export const signupNewUser = (email: string, pw: string, username: string, firstName: string = "", lastName: string = "", campusId: string, file: any = '') => async (dispatch: any) => {
  con = new StrapiApiConnection();

  let status = await con.createUser(email, pw, username, firstName, lastName, campusId, file)

  // If user is successfully signed up, the con object will internally get assigned a user
  if (con.user) {
    //dispatch((newUser.unsolved_artworks))
    dispatch(getUser(con.user))
    dispatch(fetchPastArtworks(con.user))
    dispatch(fetchUnsolvedArtworks(con.user))
    // save specific fields from user
    console.log('You have been successfully signed in. You will be redirected in a few seconds...')

  }


  //If there is a user assigned that means user was successfully added to database, so return true
  return con.user ? true : false;
}


/* modified loginAndGetToken functioning most recent 12/9 */
export const fetchUser = (id: string, pw: string) => async (dispatch: any) => {
  try {
    let returnData: any = await con.loginUser(id, pw)

    if (returnData.status === 200) {
      // Clearing local storage if user logs in
      // TO DO: Have scanned artworks added to past art displays before clearing local storage
      //localStorage.clear()

      dispatch(getUser(con.user))
      dispatch(fetchPastArtworks(con.user))
      dispatch(fetchUnsolvedArtworks(con.user))


      console.log('You have been successfully logged in. You will be redirected in a few seconds...')

    }

    if (returnData.status === -1) {
      console.log('Incorrect username or password')
      dispatch(loginError())
    }
  }
  catch (error) {
    dispatch(loginError())
  }

}

//This was added so that artwork could be added to database without any errors and duplicate con objets
export const addScannedArtDisplayToUserDB = (user: any, artworkId: any) => async (dispatch: any) => {
  con.user = user
  await con.addScannedArtworkToUser([artworkId])
  await con.syncRemoteToLocalUser()
  dispatch(fetchUnsolvedArtworks(con.user))
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
  window.localStorage.clear();
  try {
    //await axios.post('/auth/logout')
    dispatch(removeUser())
    // history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

export const editUserThunk = async (changes: any, dispatch: any) => {

  try {

    const sendConfig = {
      headers: {
        Authorization: 'Bearer ' + localStorage.jwt,
        'Content-Type': 'application/json',
      },
    }

    if (changes.password) {
      const hashedPassword = await hashPassword(changes.password);
      console.log(hashedPassword);
      changes = {
        password: hashedPassword
      }
    }

    let { data } = await Axios.put("https://dev-cms.cunycampusart.com/users/profile", changes, sendConfig);
    console.log(data);


    let user = await con.formatUser(data);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch(editUser(user));
    if(changes.password) return 'password change success'

  }
  catch (error) {
    console.error(error);
  }
}

const defaultUser =
{
  user: currentUser ? currentUser : '',
  error: '',
  total_points: currentUser ? currentUser.total_points : '',
  solved_artworks: currentUser ? currentUser.solved_artworks : [],
  //unsolved_artworks: currentUser ? currentUser.unsolved_artworks : []
}


/*********** TYPE CHECKING REDUCERS **********/

export default function (state = defaultUser, action: any) {
  switch (action.type) {
    case GET_USER:
      return { ...state, user: action.payload, error: '' }
    case REMOVE_USER:
      return { user: '', authToken: '', error: '', total_points: '', solved_artworks: [] };
    case LOGIN_ERROR:
      return { ...state, error: 'Incorrect username or password' }
    case EDIT_USER:
      return { ...state, user: action.payload }
    // case ADD_UNSOLVED_ARTWORKS:
    //   return {...state, unsolved_artworks: action.payload}
    default:
      return state
  }
}
