/**
   general.ts

   This store will handle non-user specific data
*/

import axios from 'axios'
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from './index'
import { StrapiApiConnection, axoisPostToStrapi } from './util'


let con: StrapiApiConnection = new StrapiApiConnection();


/************ Type Checking State ************/

interface Image {
  url: string,
  alternativeText: string
}

export interface ArtDisplay {
  id: string
  title: string
  artist: string
  description: string
  primary_image: Image
  other_images: Image[]
  year: string
  qr_code: string
  campus: string
}

export interface Campus {

}

export interface User {
  user_name: string
  first_name: string
  last_name: string
  email: string
  profile_picture: Image
  scanned_artworks: Image[]
}

export interface GeneralState {
  campuses: any
}

//Saving this for future use when we incorporate user
// export interface SystemState {
//   loggedIn: boolean
//   session: string
//   userName: string
// }


/******* TYPE CHECKING ACTIONS AND ACTION CREATORS ******/

// ACTION TYPES
export const GET_ALL_CAMPUSES = 'CHANGE_CURRENT_ART_DISPLAY'
export const GET_ALL_ART_DISPLAYS = 'GET_SCANNED_ART_DISPLAYS'
export const RESET_ART_DISPLAYS = 'RESET_ART_DISPLAYS'

// ACTION CREATORS
interface GotAllCampusesAction {
  type: typeof GET_ALL_CAMPUSES
  payload: any
}

interface GotAllArtDisplaysAction {
  type: typeof GET_ALL_ART_DISPLAYS
  payload: ArtDisplay[]
}

interface ResetArtDisplaysAction {
  type: typeof RESET_ART_DISPLAYS
}

export type GeneralActionTypes = GotAllCampusesAction | GotAllArtDisplaysAction | ResetArtDisplaysAction

//Invoked after fetching all campuses from database
export function gotAllCampuses(campuses: any): GeneralActionTypes {
  return {
    type: GET_ALL_CAMPUSES,
    payload: campuses
  }
}

//Invoked after fetching all art displays from database
export function gotAllArtDisplays(artDisplays: ArtDisplay[]): GeneralActionTypes {
  return {
    type: GET_ALL_ART_DISPLAYS,
    payload: artDisplays
  }
}


export function resetArtDisplays(): GeneralActionTypes {
  return {
    type: RESET_ART_DISPLAYS
  }
}

/*** THUNK CREATORS TO FETCH INFO FROM DATABASE ****/
const strapiUrl = "https://dev-cms.cunycampusart.com";


/* fetchAllArtworks, in the Strapi API, this is named getAllArtworks */
export const fetchAllArtworks = () => async (dispatch: any) => {
  const { data } = await axios.get(strapiUrl + '/artworks');
  //filters out any empty artworks from the database
  const artDisplays = data.filter((artwork: ArtDisplay) => artwork.title && artwork.artist);
  console.log("fetchAllArtworks", artDisplays);
  dispatch(gotAllArtDisplays(artDisplays))
  return data;
};

export const fetchAllCampuses = () => async (dispatch: any) => {

  const data = await con.getAllCampuses();
  //filters out any empty artworks from the database
  dispatch(gotAllCampuses(data))
  return data;

}

/****** SETTING UP INITIAL STATE ***********/

// Adding Campuses so Signup form can grab all campuses and list them in a drop down
const initialState: GeneralState = {
  campuses:  []
}



/*********** TYPE CHECKING REDUCERS **********/

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_ALL_CAMPUSES:
      return {
        ...state,
        campuses: action.payload
      }
    default:
      return state
  }
}


/** add System reduce soon : https://redux.js.org/recipes/usage-with-typescript
 *
*/
