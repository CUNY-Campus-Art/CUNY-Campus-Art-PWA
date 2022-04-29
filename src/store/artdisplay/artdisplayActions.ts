import type { ArtDisplay, Video } from "./artdisplayModels";

/******* TYPE CHECKING ACTIONS AND ACTION CREATORS ******/

// ACTION TYPES
export const CHANGE_CURRENT_ART_DISPLAY = "CHANGE_CURRENT_ART_DISPLAY";

export const ADD_ART_DISPLAY = "ADD_ART_DISPLAY";
export const REMOVE_ART_DISPLAY = "REMOVE_ART_DISPLAY";

export const GET_SCANNED_ART_DISPLAY = "GET_SCANNED_ART_DISPLAY";
export const GET_PAST_ART_DISPLAYS = "GET_PAST_ART_DISPLAYS";

export const RESET_ART_DISPLAYS = "RESET_ART_DISPLAYS";
export const RERENDER_ART_DISPLAYS = "RERENDER_ART_DISPLAYS";

export const GET_ALL_CAMPUSES = "GET_ALL_CAMPUSES";

export const INCREASE_LIKES_FOR_ARTWORK = "INCREASE_LIKES_FOR_ARTWORK";
export const DECREASE_LIKES_FOR_ARTWORK = "DECREASE_LIKES_FOR_ARTWORK";

export const ADD_LIKED_ARTWORK = "ADD_LIKED_ARTWORK";
export const REMOVE_LIKED_ARTWORK = "REMOVE_LIKED_ARTWORK";

export const ADD_DISLIKED_ARTWORK = "ADD_DISLIKED_ARTWORK";
export const REMOVE_DISLIKED_ARTWORK = "REMOVE_LIKED_ARTWORK";

export const ADD_SOLVED_ARTWORK = "ADD_SOLVED_ARTWORK";
export const REMOVE_SOLVED_ARTWORK = "REMOVE_SOLVED_ARTWORK";

export const ADD_UNSOLVED_ARTWORKS = "ADD_UNSOLVED_ARTWORKS";

export const ADD_VIDEO = "ADD_VIDEO";

// ACTION CREATORS
interface AddArtDisplayAction {
  type: typeof ADD_ART_DISPLAY;
  payload: ArtDisplay;
}

interface ChangeCurrentArtDisplayAction {
  type: typeof CHANGE_CURRENT_ART_DISPLAY;
  payload: ArtDisplay;
}

interface GotScannedArtDisplayAction {
  type: typeof GET_SCANNED_ART_DISPLAY;
  payload: ArtDisplay;
}

interface GotAllCampusesAction {
  type: typeof GET_ALL_CAMPUSES;
  payload: any;
}

interface GotPastArtDisplaysAction {
  type: typeof GET_PAST_ART_DISPLAYS;
  payload: ArtDisplay[];
}

interface ResetArtDisplaysAction {
  type: typeof RESET_ART_DISPLAYS;
}

interface RerenderArtDisplaysAction {
  type: typeof RERENDER_ART_DISPLAYS;
}

//Removes from user and from local app
interface RemoveArtDisplayAction {
  type: typeof REMOVE_ART_DISPLAY;
  payload: ArtDisplay;
}

//Increases Artwork field
interface IncreaseLikesForArtworkAction {
  type: typeof INCREASE_LIKES_FOR_ARTWORK;
  payload: any; //artworkId
}

//Decreases from Artwork field
interface DecreaseLikesForArtworkAction {
  type: typeof DECREASE_LIKES_FOR_ARTWORK;
  payload: any; //artworkId
}

//Adds to User field
interface AddLikedArtworkAction {
  type: typeof ADD_LIKED_ARTWORK;
  payload: ArtDisplay;
}

//Removes from User field
interface RemoveLikedArtworkAction {
  type: typeof REMOVE_LIKED_ARTWORK;
  payload: ArtDisplay;
}

//Adds to User field
interface AddDislikedArtworkAction {
  type: typeof ADD_DISLIKED_ARTWORK;
  payload: ArtDisplay;
}

//Removes from User field
interface RemoveDislikedArtworkAction {
  type: typeof REMOVE_DISLIKED_ARTWORK;
  payload: ArtDisplay;
}

interface AddSolvedArtworkAction {
  type: typeof ADD_SOLVED_ARTWORK;
  payload: ArtDisplay;
}

interface RemoveSolvedArtworkAction {
  type: typeof REMOVE_SOLVED_ARTWORK;
  payload: ArtDisplay;
}

interface AddUnsolvedArtworksAction {
  type: typeof ADD_UNSOLVED_ARTWORKS;
  payload: ArtDisplay[];
}

interface AddVideoAction {
  type: typeof ADD_VIDEO;
  payload: Video;
}

export type ArtDisplayActionTypes =
  | AddArtDisplayAction
  | GotScannedArtDisplayAction
  | GotPastArtDisplaysAction
  | ChangeCurrentArtDisplayAction
  | ResetArtDisplaysAction
  | RerenderArtDisplaysAction
  | RemoveArtDisplayAction
  | GotAllCampusesAction
  | AddLikedArtworkAction
  | RemoveLikedArtworkAction
  | AddDislikedArtworkAction
  | RemoveDislikedArtworkAction
  | AddSolvedArtworkAction
  | RemoveSolvedArtworkAction
  | IncreaseLikesForArtworkAction
  | DecreaseLikesForArtworkAction
  | AddUnsolvedArtworksAction
  | AddVideoAction;

//This action only changes current art display, but does not modify state otherwise
export const changeCurrentArtDisplay = (differentArtDisplay: any) => ({
  type: CHANGE_CURRENT_ART_DISPLAY,
  payload: differentArtDisplay,
});

//This action will ensure that artdisplay gets added, and that current display changes as well
export function addArtDisplay(
  newArtDisplay: ArtDisplay
): ArtDisplayActionTypes {
  return {
    type: ADD_ART_DISPLAY,
    payload: newArtDisplay,
  };
}

export function gotScannedArtDisplay(
  scannedArtDisplay: ArtDisplay
): ArtDisplayActionTypes {
  return {
    type: GET_SCANNED_ART_DISPLAY,
    payload: scannedArtDisplay,
  };
}

export function gotPastArtDisplays(
  artDisplays: ArtDisplay[]
): ArtDisplayActionTypes {
  return {
    type: GET_PAST_ART_DISPLAYS,
    payload: artDisplays,
  };
}

export function addUnsolvedArtworks(
  artDisplays: ArtDisplay[]
): ArtDisplayActionTypes {
  return {
    type: ADD_UNSOLVED_ARTWORKS,
    payload: artDisplays,
  };
}

export function rerenderArtDisplays(): ArtDisplayActionTypes {
  return {
    type: RERENDER_ART_DISPLAYS,
  };
}

export function resetArtDisplays(): ArtDisplayActionTypes {
  return {
    type: RESET_ART_DISPLAYS,
  };
}

export function removeArtDisplay(
  artDisplay: ArtDisplay
): ArtDisplayActionTypes {
  return {
    type: REMOVE_ART_DISPLAY,
    payload: artDisplay,
  };
}

//Invoked after fetching all campuses from database
export function gotAllCampuses(campuses: any): ArtDisplayActionTypes {
  return {
    type: GET_ALL_CAMPUSES,
    payload: campuses,
  };
}

export function increaseLikesForArtwork(artworkId: any): ArtDisplayActionTypes {
  return {
    type: INCREASE_LIKES_FOR_ARTWORK,
    payload: artworkId,
  };
}

export function decreaseLikesForArtwork(artworkId: any): ArtDisplayActionTypes {
  return {
    type: DECREASE_LIKES_FOR_ARTWORK,
    payload: artworkId,
  };
}
// add to user
export function addLikedArtwork(artworkIdArray: any): ArtDisplayActionTypes {
  return {
    type: ADD_LIKED_ARTWORK,
    payload: artworkIdArray,
  };
}

// remove from user
export function removeLikedArtwork(artworkIdArray: any): ArtDisplayActionTypes {
  return {
    type: REMOVE_LIKED_ARTWORK,
    payload: artworkIdArray,
  };
}

export function addVideo(video: Video): ArtDisplayActionTypes {
  return {
    type: ADD_VIDEO,
    payload: video,
  };
}
