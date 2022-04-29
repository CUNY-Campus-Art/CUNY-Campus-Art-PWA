import { GeneralState } from "../general/generalModels";
import {
  // General Action Types
  GET_ALL_ART_DISPLAYS,
  GET_ALL_CAMPUSES,
  RERENDER_ART_DISPLAYS,
  GeneralActionTypes,
} from "./generalActions";

import { defaultCurrentArtDisplay } from "../artdisplay/artdisplayReducer";
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
