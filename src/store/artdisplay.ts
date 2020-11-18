import axios from 'axios'
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from './index'
import { StrapiApiConnection, axoisPostToStrapi } from './util'


let con:StrapiApiConnection = new StrapiApiConnection();


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



export interface User {
  user_name: string
  first_name: string
  last_name: string
  email: string
  profile_picture: Image
  scanned_artworks: Image[]
}

export interface ArtDisplaysState {
  currentArtDisplay: ArtDisplay
  pastArtDisplays: ArtDisplay[]
  allArtDisplays: ArtDisplay[]
  user: any
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
export const  RESET_ART_DISPLAYS = 'RESET_ART_DISPLAYS'
export const RERENDER_ART_DISPLAYS = 'RERENDER_ART_DISPLAYS'

// ACTION CREATORS
interface AddArtDisplayAction {
  type: typeof ADD_ART_DISPLAY,
  payload: ArtDisplay
}

interface ChangeCurrentArtDisplayAction {
  type: typeof CHANGE_CURRENT_ART_DISPLAY,
  payload: ArtDisplay
}

interface GotScannedArtDisplayAction {
  type: typeof GET_SCANNED_ART_DISPLAY,
  payload: ArtDisplay
}

//this would ideally pull from database, but for now will rely on localStorage until this history can be connected to User History. That is why I kept this naming to later set it up to fetch from database, updates everything something is scanned (Similar to AllArtworks but this is specific to user history)
interface GotPastArtDisplaysAction {
  type: typeof GET_PAST_ART_DISPLAYS,
  payload: ArtDisplay[]
}

interface GotAllArtDisplaysAction {
  type: typeof GET_ALL_ART_DISPLAYS
  payload: ArtDisplay[]
}

interface ResetArtDisplaysAction {
  type: typeof RESET_ART_DISPLAYS
}


interface RerenderArtDisplaysAction{
  type: typeof RERENDER_ART_DISPLAYS,
  payload: any
}

export type ArtDisplayActionTypes = AddArtDisplayAction | GotScannedArtDisplayAction | GotAllArtDisplaysAction | GotPastArtDisplaysAction | ChangeCurrentArtDisplayAction | ResetArtDisplaysAction | RerenderArtDisplaysAction

//This action only changes current art display, but does not modify state otherwise
export const changeCurrentArtDisplay = (differentArtDisplay: ArtDisplay) => ({ type: CHANGE_CURRENT_ART_DISPLAY, payload: differentArtDisplay })

//This action will ensure that artdisplay gets added, and that current display changes as well
export function addArtDisplay(newArtDisplay: ArtDisplay): ArtDisplayActionTypes {
  return {
    type: ADD_ART_DISPLAY,
    payload: newArtDisplay
  }
}

export function gotScannedArtDisplay(scannedArtDisplay: ArtDisplay): ArtDisplayActionTypes {
  return {
    type: GET_SCANNED_ART_DISPLAY,
    payload: scannedArtDisplay
  }
}


export function gotPastArtDisplays
  (artDisplays: ArtDisplay[]): ArtDisplayActionTypes {
  return {
    type: GET_PAST_ART_DISPLAYS,
    payload: artDisplays
  }
}
//Invoked after fetching all art displays from database
export function gotAllArtDisplays(artDisplays: ArtDisplay[]): ArtDisplayActionTypes {
  return {
    type: GET_ALL_ART_DISPLAYS,
    payload: artDisplays
  }
}

export function rerenderArtDisplays(userInfo:any): ArtDisplayActionTypes {
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

/*** THUNK CREATORS TO FETCH INFO FROM DATABASE ****/
const strapiUrl = "https://dev-cms.cunycampusart.com";


//Right now, this is not persistent. Will incorporate rely on local storage. Ideally supposed to be Invoked after fetching all user's past art displays from database

export const fetchPastArtworks = (userInfo:any) => async (dispatch: any) => {
  let data = ''
  dispatch(gotPastArtDisplays(userInfo.user.scanned_artworks))
  return data;
};

//retrieves Scanned Art from database
export const fetchScannedArtDisplay = (qrCodeText: string, user:any) => async (dispatch: any) => {
  try{
  //"cuny-campus-art-" -> 16 characters
  //"campus-art-" -> 11 characters
  let artworkId =
     qrCodeText.startsWith("cuny-campus-art-") ? qrCodeText.slice(16) :
     qrCodeText.startsWith("campus-art") ? qrCodeText.slice(11): '';


      const { data } = await axios.get(strapiUrl + '/artworks/' + artworkId);

  //const data = await con.getArtworkById(artworkId)

  console.log("getArtworkById", data);
  dispatch(gotScannedArtDisplay(data))

  return artworkId;
     }
     catch(error){
       console.log(error)
     }

  //updates database
};

/* fetchAllArtworks, in the Strapi API, this is named getAllArtworks */
export const fetchAllArtworks = () => async (dispatch: any) => {
  const { data } = await axios.get(strapiUrl + '/artworks');
  //filters out any empty artworks from the database
  const artDisplays = data.filter((artwork: ArtDisplay) => artwork.title && artwork.artist);
  console.log("fetchAllArtworks", artDisplays);
  dispatch(gotAllArtDisplays(artDisplays))
  return data;
};

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
  currentArtDisplay: defaultCurrentArtDisplay,
  pastArtDisplays:  con.user ? con.user.scanned_artworks: [defaultCurrentArtDisplay],
  allArtDisplays: [defaultCurrentArtDisplay],
  user: con.user
}



/*********** TYPE CHECKING REDUCERS **********/

export default function (state = initialState, action: ArtDisplayActionTypes) {
  switch (action.type) {
    //This changes the value of the current art to be displayed
    case CHANGE_CURRENT_ART_DISPLAY:
      return { ...state, currentArtDisplay: action.payload }
    //checks to see if artwork is already in history
    //duplicate items are not added
    //updates pastArtDisplay
    //will soon remove updating allArtDisplays as that is meant to be a definitive source
    case GET_SCANNED_ART_DISPLAY:
      return {
        ...state,
        currentArtDisplay: action.payload,
        pastArtDisplays: state.pastArtDisplays.some(artwork => artwork.id === action.payload.id) ? [...state.pastArtDisplays] : [...state.pastArtDisplays, action.payload],
        allArtDisplays: state.allArtDisplays.some(artwork => artwork.id === action.payload.id) ? [...state.allArtDisplays] : [...state.allArtDisplays, action.payload]
      }
    case GET_PAST_ART_DISPLAYS:
      return {...state }
    case GET_ALL_ART_DISPLAYS:
      return { ...state, allArtDisplays: [...state.allArtDisplays, ...action.payload] }
    case ADD_ART_DISPLAY:
      return {
        ...state, allArtDisplays: [...state.allArtDisplays, action.payload]
      }
    case RESET_ART_DISPLAYS:
      return {
        ...state,
        // allArtDisplays:[],
        // currentArtDisplay: [defaultCurrentArtDisplay],
        // pastArtDisplays: [defaultCurrentArtDisplay],
        user: '',
        currentArtDisplay: defaultCurrentArtDisplay,
        pastArtDisplays:
        //con.user ? [defaultCurrentArtDisplay, ...con.user.scanned_artworks]:
        [defaultCurrentArtDisplay],
        allArtDisplays: [defaultCurrentArtDisplay],
      }
    case RERENDER_ART_DISPLAYS:
      con = new StrapiApiConnection(action.payload[0], action.payload[1])
      return {
        ...state,
        user: con.user,
        pastArtDisplays: action.payload[0] ? [...action.payload[0].scanned_artworks]: [...state.pastArtDisplays]
      }
    default:
      return state
  }
}


/** add System reduce soon : https://redux.js.org/recipes/usage-with-typescript */
