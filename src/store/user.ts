import { StrapiApiConnection } from './util'
import { fetchPastArtworks, addUnsolvedArtworks } from './artdisplay'
/************ Type Checking State ************/

export interface Image {
  url: string,
  alternativeText: string
}


export interface User {
  user_name: string,
  first_name: string,
  last_name: string,
  email: string,
  profile_picture: any,
  campusName: string,
  campusId: any,
  scanned_artworks: [],
  total_points: number,
  liked_artworks: [],
  disliked_artworks: [],
  solved_artworks: [],
  unsolved_artworks: []
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

// INITIAL STATE


const getUnsolvedArtworks = async (user: any) => {

  let artworks = await con.getArtworkWithCluesforCampusById(1)

  let solvedArtworksIds = user.solved_artworks.map((artwork: any) => artwork.id);

  // Filter out solved artwords and artworks that don't have a clue attached
  let unsolvedArtworks = artworks.filter((artwork: any) => !solvedArtworksIds.includes(artwork.id) && artwork.clue)
  localStorage.setItem('unsolved', JSON.stringify(unsolvedArtworks));
  return unsolvedArtworks;

}

export const formatUser = async (user: any) => {
  let formattedUser = {
    user_name: con.user.username,
    first_name: con.user.first_name,
    last_name: con.user.last_name,
    email: con.user.email,
    profile_picture: con.user.profile_picture,
    campus: con.user.campus ? con.user.campus.campus_name : '',
    campusId: con.user.campus ? con.user.campus.campusid : '',
    campusName: con.user.campus ? con.user.campus.campus_name : '',
    scanned_artworks: con.user.scanned_artworks ? con.user.scanned_artworks : [],
    total_points: con.user.total_points,
    liked_artworks: con.user.liked_artworks ? con.user.like_artworks : [],
    disliked_artworks: con.user.dislike_artworks ? con.user.dislike_artworks : [],
    solved_artworks: con.user.solved_artworks ? con.user.solved_artworks : [],
    unsolved_artworks: []
  }

  formattedUser.unsolved_artworks = await getUnsolvedArtworks(formattedUser)

  return formattedUser;
}


export const initializeUser = (user: any) => async (dispatch: any) => {
  await con.syncRemoteToLocalUser()
  let user = await formatUser(con.user)
  dispatch(addUnsolvedArtworks(user.unsolved_artworks))
  dispatch(getUser(user))
  dispatch(fetchPastArtworks(user))

}

// Checks local storage to see if user was previously logged in. If so, retrieves, user info based on local storage. Otherwise, the default user is set to empty
let con: StrapiApiConnection = new StrapiApiConnection();

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

export const getUser = (user: any) => ({ type: GET_USER, payload: user })
export const removeUser = () => ({ type: REMOVE_USER })
export const loginError = () => ({ type: LOGIN_ERROR })
export const signupError = () => ({ type: SIGNUP_ERROR })

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
  let status = await con.createUser(email, pw, username, firstName, lastName, campusId, file)

  // If user is successfully signed up, the con object will internally get assigned a user
  if (con.user) {
    let newUser = await formatUser(con.user)
    //dispatch((newUser.unsolved_artworks))
    dispatch(getUser(newUser))
    dispatch(addUnsolvedArtworks(newUser.unsolved_artworks))
    dispatch(getUser(newUser))
    dispatch(fetchPastArtworks(newUser))
    // save specific fields from user
    console.log('You have been successfully logged in. You will be redirected in a few seconds...')

  }


  //If there is a user assigned that means user was successfully added to database, so return true
  return con.user ? true : false;
}


/* modified loginAndGetToken functioning most recent 12/9 */
export const fetchUser = (id: string, pw: string) => async (dispatch: any) => {
  try {
    let returnData: any = await con.loginUser(id, pw)

    if (returnData.status === 200) {

      con.user = returnData.data.user;
      con.authToken = returnData.data.jwt;
      let user = await formatUser(con.user)
      dispatch(addUnsolvedArtworks(user.unsolved_artworks))
      dispatch(getUser(user))
      dispatch(fetchPastArtworks(user))

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
    dispatch(removeUser())
    // history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

const defaultUser =
{
  user: currentUser ? currentUser: '',
  error: '',
  total_points: currentUser ? currentUser.total_points: '',
  solved_artworks: currentUser ? currentUser.solved_artworks: '',
  //unsolved_artworks: currentUser.unsolved_artworks
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
    // case ADD_UNSOLVED_ARTWORKS:
    //   return {...state, unsolved_artworks: action.payload}
    default:
      return state
  }
}
