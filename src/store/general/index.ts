import axios from "axios";

import {
  // General Action Types
  GET_ALL_ART_DISPLAYS,
  GET_ALL_CAMPUSES,
  RERENDER_ART_DISPLAYS,

  // General Action Creators
  gotAllArtDisplays,
  rerenderArtDisplays,
  gotAllCampuses,
} from "./generalActions";

import {
  // General thunks
  fetchAllArtworks,
  fetchAllCampuses,
} from "./generalEffects";

//Saving this for future use when we incorporate user
// export interface SystemState {
//   loggedIn: boolean
//   session: string
//   userName: string
// }

export {
  // General Action Types
  GET_ALL_ART_DISPLAYS,
  GET_ALL_CAMPUSES,
  RERENDER_ART_DISPLAYS,
  // General Action Creators
  gotAllArtDisplays,
  rerenderArtDisplays,
  gotAllCampuses,
  // General thunks
  fetchAllArtworks,
  fetchAllCampuses,
};
