import {
  CHANGE_CURRENT_ART_DISPLAY,
  GET_SCANNED_ART_DISPLAY,
  GET_PAST_ART_DISPLAYS,
  ADD_ART_DISPLAY,
  RESET_ART_DISPLAYS,
  RERENDER_ART_DISPLAYS,
  REMOVE_ART_DISPLAY,
  INCREASE_LIKES_FOR_ARTWORK,
  DECREASE_LIKES_FOR_ARTWORK,
  ADD_UNSOLVED_ARTWORKS,
  ADD_VIDEO,
  addUnsolvedArtworks,
  changeCurrentArtDisplay,
  gotPastArtDisplays,
  gotScannedArtDisplay,
  removeArtDisplay,
  rerenderArtDisplays,
  resetArtDisplays,
  addVideo,
  gotAllCampuses,
} from "./artdisplayActions";

import {
  addSolvedArtwork,
  addVideoToDB,
  clickLikeButton,
  clickDislikeButton,
  fetchScannedArtDisplay,
  fetchPastArtworks,
  removeScannedArtDisplay,
} from "./artdisplayEffects";

export type {
  // artdisplay Models
  ArtDisplay,
  Video,
} from "./artdisplayModels";

export {
  // artdisplay Actions
  CHANGE_CURRENT_ART_DISPLAY,
  GET_SCANNED_ART_DISPLAY,
  GET_PAST_ART_DISPLAYS,
  ADD_ART_DISPLAY,
  RESET_ART_DISPLAYS,
  RERENDER_ART_DISPLAYS,
  REMOVE_ART_DISPLAY,
  INCREASE_LIKES_FOR_ARTWORK,
  DECREASE_LIKES_FOR_ARTWORK,
  ADD_UNSOLVED_ARTWORKS,
  ADD_VIDEO,
  // artdisplay Action Creators
  addUnsolvedArtworks,
  changeCurrentArtDisplay,
  gotPastArtDisplays,
  gotScannedArtDisplay,
  removeArtDisplay,
  rerenderArtDisplays,
  resetArtDisplays,
  addVideo,
  gotAllCampuses,
  // artdisplay Thunks
  addSolvedArtwork,
  addVideoToDB,
  clickLikeButton,
  clickDislikeButton,
  fetchScannedArtDisplay,
  fetchPastArtworks,
  removeScannedArtDisplay,
};
