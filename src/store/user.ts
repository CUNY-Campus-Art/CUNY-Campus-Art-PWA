 import axios from 'axios'
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { StringLiteral } from 'typescript'
import { RootState } from './index'

/************ Type Checking State ************/

export interface Image {
  url: string,
  alternativeText: string
}

export interface User {
  username: string
  firstName: string
  lastName: string
  email: string
  profilePicture: Image
}

/******* TYPE CHECKING ACTIONS AND ACTION CREATORS ******/

// ACTION TYPES
export const GET_USER = 'GET_USER'
export const REMOVE_USER = 'REMOVE_USER'

// INITIAL STATE
const defaultUser = {}

// ACTION CREATORS
interface getUserAction {
  type: typeof GET_USER
  payload: User
}

interface removeUserAction {
  type: typeof GET_USER
  payload: User
}


const getUser = (user: User) => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})

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

const axoisPostToStrapi = async (url: any, data:any, headerConfig:any) => {
  var returnedData:any = {status:-1};
  try {
    returnedData = await axios.post(url,data, headerConfig);
  } catch (error) {
    console.log(error);
    console.log(url);
    console.log(data);
    console.log(headerConfig);
  }

  if(returnedData.status === 200){
    return returnedData;
  }else{
    console.log('Error in axoisPostToStrapi');
    console.log(returnedData);
    return {status:-1}
  }
}


/* loginAndGetToken */
export const fetchUser =  (id:string, pw:string) => async (dispatch:any) => {
  const sendConfig = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const sendData = JSON.stringify({
    identifier: id,
    password: pw,
  })

  const returnData = await axoisPostToStrapi(strapiUrl + '/auth/local', sendData, sendConfig);

  if(returnData.status === 200){
    console.log( "THIS IS THE RETURN DATA FOR loginAndGetToken", returnData)
    console.log("This is the user information: ", returnData.data.user)
    dispatch(getUser(returnData.data.user))
    return returnData.data.jwt;
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

// export const logout = () => async dispatch => {
//   try {
//     await axios.post('/auth/logout')
//     dispatch(removeUser())
//     history.push('/login')
//   } catch (err) {
//     console.error(err)
//   }
// }

/*********** TYPE CHECKING REDUCERS **********/

export default function(state = defaultUser, action: any) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
