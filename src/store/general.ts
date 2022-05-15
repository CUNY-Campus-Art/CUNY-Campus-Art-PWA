import axios from "axios";
import { StrapiApiConnection } from "./util";
import type { ArtDisplay, GeneralState } from "./models";
import { defaultCurrentArtDisplay } from "./models";
let con: StrapiApiConnection = new StrapiApiConnection();

/******* TYPE CHECKING ACTIONS AND ACTION CREATORS ******/

// ACTION TYPES
export const GET_ALL_ART_DISPLAYS = "GET_SCANNED_ART_DISPLAYS";
export const RERENDER_ART_DISPLAYS = "RERENDER_ART_DISPLAYS";
export const GET_ALL_CAMPUSES = "GET_ALL_CAMPUSES";

// ACTION CREATORS

interface GotAllCampusesAction {
  type: typeof GET_ALL_CAMPUSES;
  payload: any;
}

interface GotAllArtDisplaysAction {
  type: typeof GET_ALL_ART_DISPLAYS;
  payload: ArtDisplay[];
}

interface RerenderArtDisplaysAction {
  type: typeof RERENDER_ART_DISPLAYS;
  payload: any;
}

export type GeneralActionTypes =
  | GotAllArtDisplaysAction
  | RerenderArtDisplaysAction
  | GotAllCampusesAction;

//Invoked after fetching all art displays from database
export function gotAllArtDisplays(
  artDisplays: ArtDisplay[]
): GeneralActionTypes {
  return {
    type: GET_ALL_ART_DISPLAYS,
    payload: artDisplays,
  };
}

export function rerenderArtDisplays(userInfo: any): GeneralActionTypes {
  return {
    type: RERENDER_ART_DISPLAYS,
    payload: userInfo,
  };
}

//Invoked after fetching all campuses from database
export function gotAllCampuses(campuses: any): GeneralActionTypes {
  return {
    type: GET_ALL_CAMPUSES,
    payload: campuses,
  };
}

/*** THUNK CREATORS TO FETCH INFO FROM DATABASE ****/
const strapiUrl = "https://campus-art-backend.herokuapp.com";

/* fetchAllArtworks, in the Strapi API, this is named getAllArtworks */
export const fetchAllArtworks = () => async (dispatch: any) => {
  const { data } = await axios.get(strapiUrl + "/artworks");
  //filters out any empty artworks from the database
  const artDisplays = data
    .filter((artwork: ArtDisplay) => artwork.title && artwork.artist)
    .map((artwork: ArtDisplay) => con.formatArtwork(artwork));
  console.log("fetchAllArtworks", artDisplays);
  dispatch(gotAllArtDisplays(artDisplays));
  return data;
};

export const fetchAllCampuses = () => async (dispatch: any) => {
  const data = await con.getAllCampuses();

  await dispatch(gotAllCampuses(data));
  //return data;
};

/****** SETTING UP INITIAL STATE ***********/

//adding user so that it can retrieve info based on current user state
const initialState: GeneralState = {
  allArtDisplays: [defaultCurrentArtDisplay],
  campuses: [],
};

/*********** TYPE CHECKING REDUCERS **********/

export default function (state = initialState, action: GeneralActionTypes) {
  switch (action.type) {
    case GET_ALL_ART_DISPLAYS:
      return {
        ...state,
        allArtDisplays: [...state.allArtDisplays, ...action.payload],
      };
    case GET_ALL_CAMPUSES:
      return {
        ...state,
        campuses: action.payload,
      };
    default:
      return state;
  }
}

/** add System reduce soon : https://redux.js.org/recipes/usage-with-typescript */
