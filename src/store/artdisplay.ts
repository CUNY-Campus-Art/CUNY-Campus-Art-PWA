import axios from 'axios'
import { Action } from 'redux'
import {ThunkAction} from 'redux-thunk'
import { RootState } from './index'


/************ Type Checking State ************/

interface Image {
  src: string,
  alt: string
}

export interface ArtDisplay {
  id: string
  titleOfArtwork: string
  nameOfArtist: string
  year: string
  campus: string
  primaryImage: Image
  otherImages: Image[]
  description: string
  qrCodeURL: string
}

export interface ArtDisplaysState {
  currentArtDisplay: ArtDisplay
  allArtDisplays: ArtDisplay []
}


//Saving this for future use when we incorporate user
// export interface SystemState {
//   loggedIn: boolean
//   session: string
//   userName: string
// }


/******* TYPE CHECKING ACTIONS AND ACTION CREATORS ******/

// ACTION TYPES
export const ADD_ART_DISPLAY = 'ADD_ART_DISPLAY'
export const GET_SCANNED_ART_DISPLAY = 'GET_SCANNED_ART_DISPLAY'

// ACTION CREATORS
interface AddArtDisplayAction {
  type: typeof ADD_ART_DISPLAY,
  payload: ArtDisplay
}

interface GotScannedArtDisplayAction {
  type: typeof GET_SCANNED_ART_DISPLAY,
  payload: ArtDisplay
}

export type ArtDisplayActionTypes = AddArtDisplayAction | GotScannedArtDisplayAction

// TypeScript infers that this function is returning SendMessageAction
export function addArtDisplay(newArtDisplay: ArtDisplay): ArtDisplayActionTypes {
  return {
    type: ADD_ART_DISPLAY,
    payload: newArtDisplay
  }
}

export function gotScannedArtDisplay(scannedArtDisplay: ArtDisplay): ArtDisplayActionTypes {
  return {
    type: ADD_ART_DISPLAY,
    payload: scannedArtDisplay
  }
}

// THUNK CREATORS
export const fetchScannedArtDisplay= (qrCodeURL: string): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch => {
  try {
    const artDisplay = await axios.get(qrCodeURL)
    dispatch(gotScannedArtDisplay(artDisplay.data))

  } catch (error) {
    console.error(error)
  }
}

/****** SETTING UP INITIAL STATE ***********/
const defaultCurrentArtDisplay = {
  id: 'default',
  titleOfArtwork: 'New York City',
  nameOfArtist: 'Frédéric Thery',
  year: '2020',
  campus: 'New York City',
  primaryImage: {src: 'https://media3.carredartistes.com/us/18076-large_default/xunique-contemporary-artwork-frederic-thiery-new-york-city.jpg.pagespeed.ic.45OGoX0QKY.jpg" alt="gallery 1', alt: `Porte St Denis`},
  otherImages: [
    {src: "https://thumbs.nosto.com/quick/carredaristesus/8/566319340/bf154f4dac1b717cbb33730d656942ab770c24901577ab681fd46cea97c5ecf3a/A", alt: "Petit marché"},
    {src: "https://thumbs.nosto.com/quick/carredaristesus/8/566318950/ece2915fbc817e011d922b80c2b77700ff103a74a707724342da12f16f169d13a/A", alt: "Porte St Denis"}

],
  description: 'Inspired by a painter father, Frédéric was interested from a very early age in drawing and painting. He studied fine arts at the University of Aix-en-Provence. After graduation, he moved to southern Spain where he discovered various crafts: leather work, silk painting, jewellery making…By g in contact with these artisans he learned to make leather accessories (belts, bags) and experimented with cold enamel work (producing the same aesthetic effect as enamel, but without firing). He attended a workshop on porcelain painting to learn this technique and soon he experienced the urge to paint on canvas.',
  qrCodeURL: ''
}
const initialState: ArtDisplaysState = {
  currentArtDisplay: defaultCurrentArtDisplay,
  allArtDisplays: [defaultCurrentArtDisplay]
}

/*********** TYPE CHECKING REDUCERS **********/



export default function (state = initialState, action: ArtDisplayActionTypes) {
  switch (action.type) {
    case GET_SCANNED_ART_DISPLAY:
      return {currentArtDisplay: action.payload, allArtDisplays: [...state.allArtDisplays, action.payload]}
    default:
      return state
  }
}


/** add System reduce soon : https://redux.js.org/recipes/usage-with-typescript */
