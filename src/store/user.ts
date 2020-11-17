 import axios from 'axios'
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { StringLiteral } from 'typescript'
import { RootState } from './index'
import { StrapiApiConnection, axoisPostToStrapi } from './util'

import { rerenderArtDisplays} from './artdisplay'
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

// INITIAL STATE

// Checks local storage to see if user was previously logged in. If so, retrieves, user info based on local storage. Otherwise, the default user is set to empty


let con:StrapiApiConnection = new StrapiApiConnection();

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

const defaultUser =
{
    user: currentUser,
   // campus: currentUser ? currentUser.campus.campus_name : '',
    authToken: currentUser ? authToken : ''
}

// ACTION CREATORS
interface getUserAction {
  type: typeof GET_USER
  payload: User
}

interface removeUserAction {
  type: typeof REMOVE_USER
  payload: User
}


export const getUser = (user: User) => ({type: GET_USER, user})
export const removeUser = () => ({type: REMOVE_USER})

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



/* loginAndGetToken
Function calls to strapi api to login a user and get authentication token that will be used for
other calls to create, update, delete entries in database.
Accepts:
 - id - user id (email, username)
 - pw - password for the respective account
Returns: authentication token if call is completed succesfully or -1 if there was a error.
*/
export const loginAndGetToken = (id:string , pw:string) => async (dispatch:any) =>{
  const sendConfig = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const sendData = JSON.stringify({
    identifier: id,
    password: pw,
  })

  const returnData:any = await axoisPostToStrapi(strapiUrl + '/auth/local',sendData, sendConfig);

  if(returnData.status === 200){
    return returnData.data.jwt;
  }else{
    return -1;
  }
}



/* loginAndGetToken functioning most recent 11/17 */
export const fetchUser =  (id:string, pw:string) => async (dispatch:any) => {

  let returnData:any = await con.loginUser(id,pw);


  if(returnData.status === 200){
    console.log( "THIS IS THE RETURN DATA FOR loginAndGetToken", returnData)
    console.log("This is the user information: ", returnData.data.user)

    console.log("THIS IS HOW OUR CON OBJECT LOOKS LIKE", con);
    localStorage.setItem('jwt', JSON.stringify(returnData.data.jwt));
    localStorage.setItem('user', JSON.stringify(returnData.data.user));
    console.log('You have been successfully logged in. You will be redirected in a few seconds...');
    dispatch(getUser(returnData.data.user))
    return [returnData.data.jwt, returnData.data.user];
  }else{
    return -1;
  }
}



/* loginAndGetToken modified - relies on old cold */
export const fetchUserOld =  (id:string, pw:string) => async (dispatch:any) => {



  const sendConfig = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const sendData = JSON.stringify({
    identifier: id,
    password: pw,
  })

  const returnData:any = await axoisPostToStrapi(strapiUrl + '/auth/local', sendData, sendConfig);

  if(returnData.status === 200){
    console.log( "THIS IS THE RETURN DATA FOR loginAndGetToken", returnData)
    console.log("This is the user information: ", returnData.data.user)

    console.log("THIS IS HOW OUR CON OBJECT LOOKS LIKE", con);
    localStorage.setItem('jwt', JSON.stringify(returnData.data.jwt));
    localStorage.setItem('user', JSON.stringify(returnData.data.user));
    console.log('You have been successfully logged in. You will be redirected in a few seconds...');
    dispatch(getUser(returnData.data.user))

    return [returnData.data.jwt, returnData.data.user];
  }else{
    return -1;
  }
}

// export const fetchUser = (id:string, pw:string) => async (dispatch: any) => {
//    await loginAndGetToken (id, pw);

// }


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
export const logout = () => async (dispatch:any) => {
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




/*********** TYPE CHECKING REDUCERS **********/

export default function(state = defaultUser, action: any) {
  switch (action.type) {
    case GET_USER:
      return {...state, user: action.user}
    case REMOVE_USER:
      return {user: '', authToken: '', campus: ''};
    default:
      return state
  }
}
