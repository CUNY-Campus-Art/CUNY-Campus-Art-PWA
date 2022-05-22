import { StrapiApiConnection } from "./util";

import type { ArtDisplay, Video, ArtDisplaysState, User } from "./models";
import { defaultCurrentArtDisplay } from "./models";
import { getUser, getUserThunk } from "./user";
import axios from "axios";

let con: StrapiApiConnection = new StrapiApiConnection();

let currentUser = con.user;
/******* TYPE CHECKING ACTIONS AND ACTION CREATORS ******/

// ACTION TYPES
export const CHANGE_CURRENT_ART_DISPLAY = "CHANGE_CURRENT_ART_DISPLAY";

export const ADD_ART_DISPLAY = "ADD_ART_DISPLAY";
export const REMOVE_ART_DISPLAY = "REMOVE_ART_DISPLAY";

export const GET_SCANNED_ART_DISPLAY = "GET_SCANNED_ART_DISPLAY";
export const GET_PAST_ART_DISPLAYS = "GET_PAST_ART_DISPLAYS";

export const RESET_ART_DISPLAYS = "RESET_ART_DISPLAYS";
export const RERENDER_ART_DISPLAYS = "RERENDER_ART_DISPLAYS";

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

export const UPLOAD_ARTWORK = 'UPLOAD_ARTWORK'

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

interface GotUnsolvedArtworksAction {
  type: typeof ADD_UNSOLVED_ARTWORKS;
  payload: ArtDisplay[];
}

interface AddVideoAction {
  type: typeof ADD_VIDEO,
  payload: Video
}

interface UploadArtwork {
  type: typeof UPLOAD_ARTWORK,
  payload: any // artwork object
}



export type ArtDisplayActionTypes =
  | AddArtDisplayAction
  | GotScannedArtDisplayAction
  | GotPastArtDisplaysAction
  | ChangeCurrentArtDisplayAction
  | ResetArtDisplaysAction
  | RerenderArtDisplaysAction
  | RemoveArtDisplayAction
  | AddLikedArtworkAction
  | RemoveLikedArtworkAction
  | AddDislikedArtworkAction
  | RemoveDislikedArtworkAction
  | AddSolvedArtworkAction
  | RemoveSolvedArtworkAction
  | IncreaseLikesForArtworkAction
  | DecreaseLikesForArtworkAction
  | GotUnsolvedArtworksAction
  | AddVideoAction
  | UploadArtwork;

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

export function gotUnsolvedArtworks(
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

export function removeArtDisplay(artwork: ArtDisplay): ArtDisplayActionTypes {
  return {
    type: REMOVE_ART_DISPLAY,
    payload: artwork,
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
export function addLikedArtwork(artwork: ArtDisplay): ArtDisplayActionTypes {
  return {
    type: ADD_LIKED_ARTWORK,
    payload: artwork,
  };
}

// remove from user
export function removeLikedArtwork(artwork: ArtDisplay): ArtDisplayActionTypes {
  return {
    type: REMOVE_LIKED_ARTWORK,
    payload: artwork,
  };
}

export function addVideo(video: Video): ArtDisplayActionTypes {
  return {
    type: ADD_VIDEO,
    payload: video,
  };
}

export function uploadArtwork(artwork: any): ArtDisplayActionTypes {
  return {
    type: UPLOAD_ARTWORK,
    payload: artwork
  }
}
/*** THUNK CREATORS TO FETCH INFO FROM DATABASE ****/
const strapiUrl = "https://campus-art-backend.herokuapp.com";

export const uploadArtworkThunk = (artwork: any, pic: any) => async (dispatch: any) => {

  console.log(artwork);
  console.log(pic);

  try {

    const sendConfig = {
      headers: {
        Authorization: 'Bearer ' + localStorage.jwt,
        'Content-Type': 'application/json',
      },
    }


    const formData = new FormData()
    formData.append('files.primary_image', pic)

    formData.append('data', JSON.stringify(artwork));




    let res = await axios.post("https://campus-art-backend.herokuapp.com/artworks", formData, sendConfig);
    console.log(res);
    if (res.status == 200) {
      await con.addUploadedArtworkToUser([res.data.id])
      dispatch(uploadArtwork(res.data))
      await getUserThunk(dispatch)

    }
    return res;



  }
  catch (error) {
    console.error(error);
  }

}

/*
edit uploaded artwork
does not support image editting yet
*/
export const editUploadedArtworkThunk = (artwork: any, pic: any, artworkId: any) => async (dispatch: any) => {

  console.log(artwork);
  console.log(pic);

  try {

    const sendConfig = {
      headers: {
        Authorization: 'Bearer ' + localStorage.jwt,
        'Content-Type': 'application/json',
      },
    }


    const formData = new FormData()
    formData.append('files.primary_image', pic)

    formData.append('data', JSON.stringify(artwork));




    let res = await axios.put(`https://campus-art-backend.herokuapp.com/artworks/${artworkId}`, formData, sendConfig);
    console.log(res);
    if (res.status == 200) {
      dispatch(uploadArtwork(res.data))
      await getUserThunk(dispatch)
    }
    return res;



  }
  catch (error) {
    console.error(error);
  }

}

/*
delete uploaded artwork
*/
export const deleteUploadedArtworkThunk = (artworkId: any) => async (dispatch: any) => {

 

  try {

    const sendConfig = {
      headers: {
        Authorization: 'Bearer ' + localStorage.jwt,
        'Content-Type': 'application/json',
      },
    }


  


    let res = await axios.delete(`https://campus-art-backend.herokuapp.com/artworks/${artworkId}`, sendConfig);
    console.log(res);
    if (res.status == 200) {
      await con.removeUploadedArtworkToUser([res.data.id])
      await getUserThunk(dispatch)
    }
    return res;



  }
  catch (error) {
    console.error(error);
  }

}

/** fetchPastArtworks
 * fetches user's past artworks information and adds on like and disliked status for each artwork
 * @param userInfo
 */
export const fetchPastArtworks = (user: any) => async (dispatch: any) => {
  user.scanned_artworks = user.scanned_artworks.map((artwork: any) =>
    con.formatArtwork(artwork)
  );

  // Add on liked and disliked status for each artwork
  con.addLikedDislikedToArtworks(user)
  dispatch(gotPastArtDisplays(user.scanned_artworks));
  //return artworks;
};

//retrieves Scanned Art from database
export const fetchScannedArtDisplay =
  (qrCodeText: string) => async (dispatch: any) => {
    //"https://cuny-gallery.web.app/cuny-campus-art-
    //"cuny-campus-art-" -> 16 characters
    //"campus-art-" -> 11 characters
    let artworkId = qrCodeText.startsWith(
      "https://cuny-gallery.web.app/cuny-campus-art-"
    )
      ? qrCodeText.slice(45)
      : qrCodeText.startsWith("cuny-campus-art-")
        ? qrCodeText.slice(16)
        : qrCodeText.startsWith("campus-art")
          ? qrCodeText.slice(11)
          : "";

    try {
      const data = await con.getArtworkById(artworkId);

      let currentArtwork = con.formatArtwork(data);

      // save ids of liked artworks
      let likedArtworkIds =
        currentUser && currentUser.liked_artworks
          ? currentUser.liked_artworks.map(
            (likedArtwork: any) => likedArtwork.id
          )
          : [];

      // save ids of disliked artworks
      let dislikedArtworkIds =
        currentUser && currentUser.disliked_artworks
          ? currentUser.disliked_artworks.map(
            (dislikedArtwork: any) => dislikedArtwork.id
          )
          : [];

      currentArtwork.liked = likedArtworkIds.includes(currentArtwork.id)
        ? true
        : false;
      currentArtwork.disliked = dislikedArtworkIds.includes(currentArtwork.id)
        ? true
        : false;

      console.log("getArtworkById", currentArtwork);
      dispatch(gotScannedArtDisplay(currentArtwork));

      return artworkId;
    } catch (error) {
      console.log(error);
      return ""; // So front end knows invalid artwork scanned
    }

    //updates database
  };

/* fetchAllArtworks, in the Strapi API, this is named getAllArtworks */
export const fetchUnsolvedArtworks = (user: User) => async (dispatch: any) => {
  let unsolvedArtworks = await con.getUnsolvedArtworks(user);
  dispatch(getUser(user));
  dispatch(gotUnsolvedArtworks(unsolvedArtworks));
};

// Helper Function: removeFromLikes
const removeFromLikes = async (dispatch: any, artwork: any) => {
  // will toggle like button to neutral
  artwork.liked = false;

  // Exit early if default artwork
  if (artwork.id === "default") return;

  // decrease artwork's overall likes
  if (artwork.likes > 0) {
    await con.decreaseLikesForArtworkById(artwork.id);
    dispatch(decreaseLikesForArtwork(artwork.id));
  }

  // will remove from user's likes
  await con.removeLikedArtworkFromUser([artwork.id]);
};

// Helper Function: removeFromDislikes
const removeFromDislikes = async (artwork: any) => {
  // Toggle dislike button to off mode
  artwork.disliked = false;

  // will remove from user's dislikes
  await con.removeDislikedArtworkFromUser([artwork.id]);
  //dispatch(removeLikedArtwork(artwork.id))
};

// Remove ArtDisplay from the database, as well as locally
export const removeScannedArtDisplay =
  (user: any, artwork: ArtDisplay) => async (dispatch: any) => {
    //remove from database if user is signed in
    if (user && artwork.id !== "default") {
      const data = await con.removeScannedArtworkFromUser([artwork.id]);
      //await con.syncRemoteToLocalUser(); // over here possibly we can just remove locally but this might cause mismatch in data
      //reload artworks

      if (artwork.liked === true) removeFromLikes(dispatch, artwork);
      else if (artwork.disliked === true) removeFromDislikes(artwork);
      dispatch(fetchPastArtworks(user));
      dispatch(fetchUnsolvedArtworks(user));
    }

    // remove from store locally
    let updatedPastArtDisplays = user.scanned_artworks.filter(
      (art: ArtDisplay) => art.id !== artwork.id
    );
    user.scanned_artworks = updatedPastArtDisplays
    dispatch(removeArtDisplay(artwork));
    dispatch(getUser(user))
  };

//  Toggles Like Button on and off.  Add to user's likes and increase overall likes. And undo if clicked again.
export const clickLikeButton =
  (user: User, artwork: ArtDisplay, fromGallery: boolean) =>
    async (dispatch: any) => {
      if (artwork.id === "default") {
        // If like button already clicked, make it neutral
        if (artwork.liked === true) {
          defaultCurrentArtDisplay.liked = false;
          artwork.liked = false
        }
        else {
          // If like button not clicked, turn off like if it is liked
          defaultCurrentArtDisplay.liked = true;
          defaultCurrentArtDisplay.disliked = false;
          artwork.liked = true;
          artwork.disliked = false;
        }
        dispatch(gotPastArtDisplays(user.scanned_artworks));

        if (fromGallery === false) {
          dispatch(changeCurrentArtDisplay({ ...artwork, liked: artwork.liked }));
          return artwork;
        }

        return;

      }

    // If artwork is already liked, remove from likes
    if (user && artwork.liked) {
      await removeFromLikes(dispatch, artwork);
    } else {
      if (user && !artwork.liked) {
        // Add to Likes
        artwork.liked = true;

          if (artwork.disliked) {
            await removeFromDislikes(artwork);
          }

          await con.addLikedArtworkToUser([artwork.id]);
          //dispatch(addLikedArtwork(artwork));
          // Increase artwork's overall likes
          if (artwork.likes >= 0) { 
            dispatch(increaseLikesForArtwork(artwork.id));
            await con.increaseLikesForArtworkById(artwork.id);
          }
        }
      }

      let updatedPastArtDisplays = user.scanned_artworks.map((art) =>
        artwork.id === art.id ? artwork : art
      );

      user.scanned_artworks = updatedPastArtDisplays;


      if (fromGallery === false) {
        dispatch(changeCurrentArtDisplay({ ...artwork, liked: artwork.liked }));
        //return artwork;
      }

      dispatch(gotPastArtDisplays(user.scanned_artworks));
      dispatch(getUser(user)); // updates local storage for user info. Maintains consistency when refreshed
      return artwork.liked;
    };

//  Toggles Dislike Button on and off. Add to user's dislikes. And undoes if clicked again.
export const clickDislikeButton =
  (user: User, artwork: ArtDisplay) => async (dispatch: any) => {
    if (artwork.id === "default") {
      // If dislike button already clicked, make it neutral
      if (artwork.disliked === true) defaultCurrentArtDisplay.disliked = false;
      else {
        // If dislike button not clicked, turn off like if it is liked
        defaultCurrentArtDisplay.disliked = true;
        defaultCurrentArtDisplay.liked = false;
      }
      dispatch(gotPastArtDisplays(user.scanned_artworks));
      return;
    }
    // If artwork is already disliked, remove from dislikes
    if (user && artwork.disliked) {
      await removeFromDislikes(artwork);
    } else {
      if (user && !artwork.disliked) {
        // Add to Dislikes
        artwork.disliked = true;

        // If it is already liked
        if (artwork.liked) {
          await removeFromLikes(dispatch, artwork);
          // If already liked and is not default, make a call to database to decrease likes
          await con.decreaseLikesForArtworkById(artwork.id);
        }
        await con.addDislikedArtworkToUser([artwork.id]);
      }
    }
    let updatedPastArtDisplays = user.scanned_artworks.map((art) =>
      artwork.id === art.id ? artwork : art
    );

    user.scanned_artworks = updatedPastArtDisplays;

    dispatch(gotPastArtDisplays(user.scanned_artworks));
    dispatch(getUser(user)); // updates localStorage for user info

    return artwork.disliked;
  };

export const addSolvedArtwork =
  (user: any, artworkId: any, points: any) => async (dispatch: any) => {
    await con.addSolvedArtworkToUser([artworkId]);
    await con.addPointsToUser(points);
    await con.syncRemoteToLocalUser();
    // might need to correct this
    dispatch(fetchUnsolvedArtworks(user));
    dispatch(getUser(user));
  };

export const addVideoToDB =
  (user: any, artwork: any, video: Video) => async (dispatch: any) => {
    await con.updateArtworkVideos(artwork.id, [...artwork.Videos, video]);

    dispatch(addVideo(video));
  };

/****** SETTING UP INITIAL STATE ***********/

// Retrieve artworks in local storage
const pastArtDisplays = determinePastArtDisplays();

// Retrieves artworks based on whether user is logged in or is an anonymous user
function determinePastArtDisplays() {
  console.log("determine");
  if (currentUser && JSON.stringify(currentUser) !== "{}") {
    console.log("from redux and local storage for a logged in user", con);
    //addLikedDislikedToArtworks(currentUser)
    return [...currentUser.scanned_artworks, defaultCurrentArtDisplay];
  } else {
    // Check if there are past art displays in local storage
    let checkStoragePastArtDisplays =
      window.localStorage.getItem("pastArtDisplays");

    if (checkStoragePastArtDisplays) {
      console.log("from storage");
      console.log(checkStoragePastArtDisplays);

      let pastArtDisplays = JSON.parse(checkStoragePastArtDisplays || "{}");
      console.log(pastArtDisplays);
      return pastArtDisplays;
    }
  }
  // If user is not logged in and there is no artworks in local storage, only display default
  return [defaultCurrentArtDisplay];
}

// Use local storage to display current art display on refresh instead of default
let storageCurrentArtDisplay =
  window.localStorage.getItem("currentArtDisplay") &&
  JSON.parse(window.localStorage.getItem("currentArtDisplay") || "{}");

// Retrieve initialState info based on current user state
const initialState: ArtDisplaysState = {
  currentArtDisplay: storageCurrentArtDisplay || defaultCurrentArtDisplay,
  pastArtDisplays: pastArtDisplays,
  liked_artworks: currentUser ? currentUser.liked_artworks : [],
  disliked_artworks: currentUser ? currentUser.disliked_artworks : [],
  unsolvedArtDisplays: [],
  uploaded_artworks: [],
  //this gets updated once artwork is uploaded by user, set to default to avoid error
  uploaded_artwork: defaultCurrentArtDisplay
};

/*********** TYPE CHECKING REDUCERS **********/

export default function (state = initialState, action: ArtDisplayActionTypes) {
  let updatedPastArtDisplays;
  switch (action.type) {
    //This changes the value of the current art to be displayed
    case CHANGE_CURRENT_ART_DISPLAY:
      window.localStorage.setItem(
        "currentArtDisplay",
        JSON.stringify(action.payload)
      );
      return {
        ...state,
        currentArtDisplay: { ...action.payload, liked: action.payload.liked },
      };
    //checks to see if artwork is already in history
    //duplicate items are not added
    //updates pastArtDisplay
    case GET_SCANNED_ART_DISPLAY:
      updatedPastArtDisplays = state.pastArtDisplays.some(
        (artwork) => artwork.id === action.payload.id
      )
        ? [...state.pastArtDisplays]
        : [...state.pastArtDisplays, action.payload];

      window.localStorage.setItem(
        "pastArtDisplays",
        JSON.stringify(updatedPastArtDisplays)
      );
      window.localStorage.setItem(
        "currentArtDisplay",
        JSON.stringify(action.payload)
      );

      return {
        ...state,
        currentArtDisplay: action.payload,
        //doesn't add duplicates to the history
        pastArtDisplays: updatedPastArtDisplays,
      };
    case GET_PAST_ART_DISPLAYS:
      // updatedPastArtDisplays = [...action.payload]
      window.localStorage.setItem(
        "pastArtDisplays",
        JSON.stringify(updatedPastArtDisplays)
      );

      return {
        ...state,
        pastArtDisplays: [...action.payload, defaultCurrentArtDisplay],
      };
    case ADD_ART_DISPLAY:
      return {
        ...state,
        pastArtDisplays: [...state.pastArtDisplays, action.payload],
      };
    case RESET_ART_DISPLAYS:
      return {
        ...state,
        currentArtDisplay: defaultCurrentArtDisplay,
        pastArtDisplays: [defaultCurrentArtDisplay],
        unsolvedArtDisplays: [],
      };
    case RERENDER_ART_DISPLAYS:
      return {
        ...state,
      };
    case REMOVE_ART_DISPLAY: {
      let updatedPastArtDisplays = state.pastArtDisplays.filter(
        (artwork) => artwork.id !== action.payload.id
      );

      // Update local storage so art display shows as removed
      window.localStorage.setItem(
        "pastArtDisplays",
        JSON.stringify(updatedPastArtDisplays)
      );

      // Clear local storage for currentArtDisplay if the artwork removed is the currently displayed artwork in Information
      if (action.payload.id === state.currentArtDisplay.id)
        window.localStorage.setItem("currentArtDisplay", "");
      // fetchPastArtworks, should update the past displays
      return {
        ...state,
        // remove this artwork from gallery history
        pastArtDisplays: updatedPastArtDisplays,
        // If the current art display is same one as the one being removed, set current art display to be the default artwork, otherwise, leave it alone
        currentArtDisplay:
          state.currentArtDisplay.id === action.payload.id
            ? defaultCurrentArtDisplay
            : state.currentArtDisplay,
      };
    }
    case ADD_LIKED_ARTWORK:
      let updatedLikedArtworks = [...state.liked_artworks, action.payload];
      currentUser.liked_artworks = updatedLikedArtworks;
      localStorage.setItem("user", JSON.stringify(currentUser));
      //   );
      return {
        ...state,
        liked_artworks: updatedLikedArtworks,
        // pastArtDisplays:
      };

    // case REMOVE_LIKED_ARTWORK:
    //   break
    case INCREASE_LIKES_FOR_ARTWORK:
      //increase number of likes at particular index locally
      // state.pastArtDisplays.forEach((artDisplay: any) => { if (artDisplay.id === action.payload) artDisplay.likes++ })

      return {
        ...state,
        pastArtDisplays: state.pastArtDisplays.map((artdisplay) => {
          // == set here because id can sometimes be a string and sometimes a number
          if (artdisplay.id == action.payload) {
            artdisplay.likes++;
            //artdisplay.liked = true
          }
          return { ...artdisplay };
        }),
      };
    case DECREASE_LIKES_FOR_ARTWORK:
      //increase number of likes at particular index locally
      // state.pastArtDisplays.forEach((artDisplay: any) => { if (artDisplay.id === action.payload && artDisplay.likes >= 1) artDisplay.likes-- })
      return {
        ...state,
        pastArtDisplays: state.pastArtDisplays.map((artdisplay) => {
          if (artdisplay.id == action.payload) {
            artdisplay.likes--;
          }
          return { ...artdisplay };
        }),
      };
    case ADD_UNSOLVED_ARTWORKS:
      return { ...state, unsolvedArtDisplays: [...action.payload] };
    case ADD_VIDEO:
      return {
        ...state,
        currentArtDisplay: {
          ...state.currentArtDisplay,
          Videos: [action.payload, ...state.currentArtDisplay.Videos],
        },
        pastArtDisplays: state.pastArtDisplays.map((artwork) => {
          // map over all artDisplays to find corresponding artwork and update video section
          if (artwork.id === state.currentArtDisplay.id)
            artwork.Videos = [action.payload, ...artwork.Videos];
          return artwork;
        })
      }
    case UPLOAD_ARTWORK:
      return {
        ...state,
        uploaded_artwork: action.payload
      }
    default:
      return state;
  }
}

/** add System reduce soon : https://redux.js.org/recipes/usage-with-typescript */
