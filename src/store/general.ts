import axios from 'axios'
import { StrapiApiConnection } from './util'


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


export interface ArtDisplaysState {
  allArtDisplays: ArtDisplay[]
  campuses: any[]
  // user: any
}

//Saving this for future use when we incorporate user
// export interface SystemState {
//   loggedIn: boolean
//   session: string
//   userName: string
// }


/******* TYPE CHECKING ACTIONS AND ACTION CREATORS ******/

// ACTION TYPES
export const CHANGE_CURRENT_ART_DISPLAY = 'CHANGE_CURRENT_ART_DISPLAY'
export const ADD_ART_DISPLAY = 'ADD_ART_DISPLAY'
export const GET_SCANNED_ART_DISPLAY = 'GET_SCANNED_ART_DISPLAY'
export const GET_ALL_ART_DISPLAYS = 'GET_SCANNED_ART_DISPLAYS'
export const GET_PAST_ART_DISPLAYS = 'GET_PAST_ART_DISPLAYS'
export const RESET_ART_DISPLAYS = 'RESET_ART_DISPLAYS'
export const RERENDER_ART_DISPLAYS = 'RERENDER_ART_DISPLAYS'
export const GET_ALL_CAMPUSES = 'GET_ALL_CAMPUSES'

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


interface RerenderArtDisplaysAction {
  type: typeof RERENDER_ART_DISPLAYS,
  payload: any
}

export type ArtDisplayActionTypes = GotAllArtDisplaysAction | ResetArtDisplaysAction | RerenderArtDisplaysAction | GotAllCampusesAction



//Invoked after fetching all art displays from database
export function gotAllArtDisplays(artDisplays: ArtDisplay[]): ArtDisplayActionTypes {
  return {
    type: GET_ALL_ART_DISPLAYS,
    payload: artDisplays
  }
}

export function rerenderArtDisplays(userInfo: any): ArtDisplayActionTypes {
  return {
    type: RERENDER_ART_DISPLAYS,
    payload: userInfo
  }
}


export function resetArtDisplays(): ArtDisplayActionTypes {
  return {
    type: RESET_ART_DISPLAYS
  }
}

//Invoked after fetching all campuses from database
export function gotAllCampuses(campuses: any): ArtDisplayActionTypes {
  return {
    type: GET_ALL_CAMPUSES,
    payload: campuses
  }
}



/*** THUNK CREATORS TO FETCH INFO FROM DATABASE ****/
const strapiUrl = "https://campus-art-backend.herokuapp.com";


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

  await dispatch(gotAllCampuses(data))
  //return data;

}

/****** SETTING UP INITIAL STATE ***********/

const defaultCurrentArtDisplay = {
  id: 'default',
  title: 'New York City',
  artist: 'Frédéric Thery',
  year: '2020',
  campus: 'Brooklyn College',
  primary_image: { url: 'https://media3.carredartistes.com/us/18076-large_default/xunique-contemporary-artwork-frederic-thiery-new-york-city.jpg.pagespeed.ic.45OGoX0QKY.jpg" alt="gallery 1', alternativeText: `Porte St Denis` },
  other_images: [
    { url: "https://thumbs.nosto.com/quick/carredaristesus/8/566319340/bf154f4dac1b717cbb33730d656942ab770c24901577ab681fd46cea97c5ecf3a/A", alternativeText: "Petit marché" },
    { url: "https://thumbs.nosto.com/quick/carredaristesus/8/566318950/ece2915fbc817e011d922b80c2b77700ff103a74a707724342da12f16f169d13a/A", alternativeText: "Porte St Denis" }

  ],
  description: 'Inspired by a painter father, Frédéric was interested from a very early age in drawing and painting. He studied fine arts at the University of Aix-en-Provence. After graduation, he moved to southern Spain where he discovered various crafts: leather work, silk painting, jewellery making…By g in contact with these artisans he learned to make leather accessories (belts, bags) and experimented with cold enamel work (producing the same aesthetic effect as enamel, but without firing). He attended a workshop on porcelain painting to learn this technique and soon he experienced the urge to paint on canvas.',
  qr_code: '',
}

//adding user so that it can retrieve info based on current user state
const initialState: ArtDisplaysState = {
  allArtDisplays: [defaultCurrentArtDisplay],
  campuses: []
}


/*********** TYPE CHECKING REDUCERS **********/

export default function (state = initialState, action: ArtDisplayActionTypes) {
  switch (action.type) {

    case GET_ALL_ART_DISPLAYS:
      return { ...state, allArtDisplays: [...state.allArtDisplays, ...action.payload] }
    case GET_ALL_CAMPUSES:
      return {
        ...state,
        campuses: action.payload
      }
    default:
      return state
  }
}


/** add System reduce soon : https://redux.js.org/recipes/usage-with-typescript */
