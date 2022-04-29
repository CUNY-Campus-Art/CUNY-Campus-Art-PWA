import type { ArtDisplay } from "../artdisplay/artdisplayModels";

/******* TYPE CHECKING ACTIONS AND ACTION CREATORS ******/

// ACTION TYPES

export const GET_ALL_ART_DISPLAYS = "GET_ALL_ART_DISPLAYS";
export const GET_ALL_CAMPUSES = "GET_ALL_CAMPUSES";
export const RERENDER_ART_DISPLAYS = "RERENDER_ART_DISPLAYS";
// ACTION CREATORS

interface GotAllArtDisplaysAction {
  type: typeof GET_ALL_ART_DISPLAYS;
  payload: ArtDisplay[];
}

interface GotAllCampusesAction {
  type: typeof GET_ALL_CAMPUSES;
  payload: any;
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
