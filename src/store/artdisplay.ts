import axios from 'axios'
import { StrapiApiConnection } from './util'
import { getUser, User } from './user'

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
  likes: Number //Overall likes
  liked: boolean // Specific to user (locally derived)
  disliked: boolean // Specific to user (locally derived)
  artwork_type_clue: string
  clue: any
  Videos: Video[]
}

export interface Video {
  youtube_id: string
  youtube_url: string
  title: string
  author: string
  user?: any
}



export interface ArtDisplaysState {
  currentArtDisplay: ArtDisplay
  pastArtDisplays: ArtDisplay[]
  unsolvedArtDisplays: ArtDisplay[]
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
export const REMOVE_ART_DISPLAY = 'REMOVE_ART_DISPLAY'

export const GET_SCANNED_ART_DISPLAY = 'GET_SCANNED_ART_DISPLAY'
export const GET_ALL_ART_DISPLAYS = 'GET_SCANNED_ART_DISPLAYS'
export const GET_PAST_ART_DISPLAYS = 'GET_PAST_ART_DISPLAYS'

export const RESET_ART_DISPLAYS = 'RESET_ART_DISPLAYS'
export const RERENDER_ART_DISPLAYS = 'RERENDER_ART_DISPLAYS'

export const GET_ALL_CAMPUSES = 'GET_ALL_CAMPUSES'

export const INCREASE_LIKES_FOR_ARTWORK = 'INCREASE_LIKES_FOR_ARTWORK'
export const DECREASE_LIKES_FOR_ARTWORK = 'DECREASE_LIKES_FOR_ARTWORK'

export const ADD_LIKED_ARTWORK = 'ADD_LIKED_ARTWORK'
export const REMOVE_LIKED_ARTWORK = 'REMOVE_LIKED_ARTWORK'

export const ADD_DISLIKED_ARTWORK = 'ADD_DISLIKED_ARTWORK'
export const REMOVE_DISLIKED_ARTWORK = 'REMOVE_LIKED_ARTWORK'

export const ADD_SOLVED_ARTWORK = 'ADD_SOLVED_ARTWORK'
export const REMOVE_SOLVED_ARTWORK = 'REMOVE_SOLVED_ARTWORK'

export const ADD_UNSOLVED_ARTWORKS = 'ADD_UNSOLVED_ARTWORKS'

export const ADD_VIDEO = 'ADD_VIDEO'

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

interface GotAllCampusesAction {
  type: typeof GET_ALL_CAMPUSES
  payload: any
}

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


interface RerenderArtDisplaysAction {
  type: typeof RERENDER_ART_DISPLAYS,
}

//Removes from user and from local app
interface RemoveArtDisplayAction {
  type: typeof REMOVE_ART_DISPLAY,
  payload: ArtDisplay
}

//Increases Artwork field
interface IncreaseLikesForArtworkAction {
  type: typeof INCREASE_LIKES_FOR_ARTWORK
  payload: any //artworkId
}

//Decreases from Artwork field
interface DecreaseLikesForArtworkAction {
  type: typeof DECREASE_LIKES_FOR_ARTWORK
  payload: any //artworkId
}

//Adds to User field
interface AddLikedArtworkAction {
  type: typeof ADD_LIKED_ARTWORK,
  payload: ArtDisplay
}

//Removes from User field
interface RemoveLikedArtworkAction {
  type: typeof REMOVE_LIKED_ARTWORK,
  payload: ArtDisplay
}

//Adds to User field
interface AddDislikedArtworkAction {
  type: typeof ADD_DISLIKED_ARTWORK,
  payload: ArtDisplay
}

//Removes from User field
interface RemoveDislikedArtworkAction {
  type: typeof REMOVE_DISLIKED_ARTWORK,
  payload: ArtDisplay
}

interface AddSolvedArtworkAction {
  type: typeof ADD_SOLVED_ARTWORK,
  payload: ArtDisplay
}

interface RemoveSolvedArtworkAction {
  type: typeof REMOVE_SOLVED_ARTWORK,
  payload: ArtDisplay
}

interface GotUnsolvedArtworksAction {
  type: typeof ADD_UNSOLVED_ARTWORKS,
  payload: ArtDisplay[]
}

interface AddVideoAction {
  type: typeof ADD_VIDEO,
  payload: Video
}

export type ArtDisplayActionTypes = AddArtDisplayAction | GotScannedArtDisplayAction | GotAllArtDisplaysAction | GotPastArtDisplaysAction | ChangeCurrentArtDisplayAction | ResetArtDisplaysAction | RerenderArtDisplaysAction | RemoveArtDisplayAction | GotAllCampusesAction | AddLikedArtworkAction | RemoveLikedArtworkAction | AddDislikedArtworkAction | RemoveDislikedArtworkAction | AddSolvedArtworkAction | RemoveSolvedArtworkAction | IncreaseLikesForArtworkAction | DecreaseLikesForArtworkAction | GotUnsolvedArtworksAction | AddVideoAction

//This action only changes current art display, but does not modify state otherwise
export const changeCurrentArtDisplay = (differentArtDisplay: any) => ({ type: CHANGE_CURRENT_ART_DISPLAY, payload: differentArtDisplay })

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

export function gotUnsolvedArtworks(artDisplays: ArtDisplay[]): ArtDisplayActionTypes {
  return {
    type: ADD_UNSOLVED_ARTWORKS,
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

export function rerenderArtDisplays(): ArtDisplayActionTypes {
  return {
    type: RERENDER_ART_DISPLAYS
  }
}


export function resetArtDisplays(): ArtDisplayActionTypes {
  return {
    type: RESET_ART_DISPLAYS
  }
}

export function removeArtDisplay(artDisplay: ArtDisplay): ArtDisplayActionTypes {
  return {
    type: REMOVE_ART_DISPLAY,
    payload: artDisplay
  }
}

//Invoked after fetching all campuses from database
export function gotAllCampuses(campuses: any): ArtDisplayActionTypes {
  return {
    type: GET_ALL_CAMPUSES,
    payload: campuses
  }
}


export function increaseLikesForArtwork(artworkId: any): ArtDisplayActionTypes {
  return {
    type: INCREASE_LIKES_FOR_ARTWORK,
    payload: artworkId
  }
}

export function decreaseLikesForArtwork(artworkId: any): ArtDisplayActionTypes {
  return {
    type: DECREASE_LIKES_FOR_ARTWORK,
    payload: artworkId
  }
}
// add to user
export function addLikedArtwork(artworkIdArray: any): ArtDisplayActionTypes {
  return {
    type: ADD_LIKED_ARTWORK,
    payload: artworkIdArray
  }
}

// remove from user
export function removeLikedArtwork(artworkIdArray: any): ArtDisplayActionTypes {
  return {
    type: REMOVE_LIKED_ARTWORK,
    payload: artworkIdArray
  }
}

export function addVideo(video: Video): ArtDisplayActionTypes {
  return {
    type: ADD_VIDEO,
    payload: video
  }
}
/*** THUNK CREATORS TO FETCH INFO FROM DATABASE ****/
const strapiUrl = "https://dev-cms.cunycampusart.com";


/** fetchPastArtworks
 * fetches user's past artworks information and adds on like and disliked status for each artwork
 * @param userInfo
 */
export const fetchPastArtworks = (user: any) => async (dispatch: any) => {

  user.scanned_artworks = user.scanned_artworks.map((artwork:any) => con.formatArtwork(artwork))

 // let artworks = addLikedDislikedToArtworks(user)
  dispatch(gotPastArtDisplays(user.scanned_artworks))
  //dispatch(rerenderArtDisplays())
  //return artworks;
};

// export const addLikedDislikedToArtworks = (user: any) => {
//   // if(con.user) {

//   // await con.syncRemoteToLocalUser()
//   let artworks: any = user.scanned_artworks ? user.scanned_artworks : [];

//   // save ids of liked artworks
//   let likedArtworkIds = user.liked_artworks ? user.liked_artworks.map((likedArtwork: any) => likedArtwork.id) : []

//   // save ids of disliked artworks
//   let dislikedArtworkIds = user.disliked_artworks ? user.disliked_artworks.map((dislikedArtwork: any) => dislikedArtwork.id) : []


//   // looks through artworks:
//   // if artwork is present in liked_artworks, artwork is tagged with a liked value of true
//   // if artwork is present in disliked_artworks, artwork is tagged with a disliked value of true
//   // 'liked' value is manually derived added here, info not directly in database
//   artworks.forEach((artwork: any) => {
//     likedArtworkIds.includes(artwork.id) ? artwork.liked = true : artwork.liked = false
//     dislikedArtworkIds.includes(artwork.id) ? artwork.disliked = true : artwork.disliked = false
//     return artwork
//   })

//   window.localStorage.setItem("user", JSON.stringify(user))
//   window.localStorage.setItem("pastArtDisplays", JSON.stringify(artworks))

//   return artworks
// }

//retrieves Scanned Art from database
export const fetchScannedArtDisplay = (qrCodeText: string) => async (dispatch: any) => {
  //"https://cuny-gallery.web.app/cuny-campus-art-
  //"cuny-campus-art-" -> 16 characters
  //"campus-art-" -> 11 characters
  let artworkId =
    qrCodeText.startsWith("https://cuny-gallery.web.app/cuny-campus-art-") ? qrCodeText.slice(45) :
      qrCodeText.startsWith("cuny-campus-art-") ? qrCodeText.slice(16) :
        qrCodeText.startsWith("campus-art") ? qrCodeText.slice(11) : '';

  try {

    const data = await con.getArtworkById(artworkId)

    let currentArtwork = con.formatArtwork(data)

    // save ids of liked artworks
    let likedArtworkIds = con.user && con.user.liked_artworks ? con.user.liked_artworks.map((likedArtwork: any) => likedArtwork.id) : []

    // save ids of disliked artworks
    let dislikedArtworkIds = con.user && con.user.disliked_artworks ? con.user.disliked_artworks.map((dislikedArtwork: any) => dislikedArtwork.id) : []

    currentArtwork.liked = likedArtworkIds.includes(currentArtwork.id) ? true : false
    currentArtwork.disliked = dislikedArtworkIds.includes(currentArtwork.id) ? true : false

    console.log("getArtworkById", currentArtwork);
    dispatch(gotScannedArtDisplay(currentArtwork))

    return artworkId;
  }
  catch (error) {
    console.log(error)
    return '' // So front end knows invalid artwork scanned
  }

  //updates database
};

/* fetchAllArtworks, in the Strapi API, this is named getAllArtworks */
export const fetchUnsolvedArtworks = (user: User) => async (dispatch: any) => {
  let unsolvedArtworks = await con.getUnsolvedArtworks(user)
  console.log(unsolvedArtworks, "THIS IS UNSOLVED", con.user, "this is con.user")
  dispatch(getUser(con.user))
  dispatch(gotUnsolvedArtworks(unsolvedArtworks))
}

/* fetchAllArtworks, in the Strapi API, this is named getAllArtworks */
export const fetchAllArtworks = () => async (dispatch: any) => {
  const { data } = await axios.get(strapiUrl + '/artworks');
  //filters out any empty artworks from the database
  const artDisplays = data
    .filter((artwork: ArtDisplay) => artwork.title && artwork.artist)
    .map((artwork: ArtDisplay) => con.formatArtwork(artwork));
  console.log("fetchAllArtworks", artDisplays);
  dispatch(gotAllArtDisplays(artDisplays))
  return data;
};

export const fetchAllCampuses = () => async (dispatch: any) => {

  const data = await con.getAllCampuses();

  await dispatch(gotAllCampuses(data))
  //return data;

}



// Helper Function: removeFromLikes
const removeFromLikes = async (artwork: any) => {
  // will toggle like button to neutral
  artwork.liked = false

  // Exit early if default artwork
  if(artwork.id === 'default') return

  // decrease artwork's overall likes
  if (artwork.likes > 0) {
    await con.decreaseLikesForArtworkById(artwork.id)
    //dispatch(decreaseLikesForArtwork(artwork.id))
  }

  // will remove from user's likes
  await con.removeLikedArtworkFromUser([artwork.id])


}

// Helper Function: removeFromDislikes
const removeFromDislikes = async (artwork: any) => {
  // Toggle dislike button to off mode
  artwork.disliked = false

  // Exit early if default artwork
  if(artwork.id === 'default') return

  // will remove from user's dislikes
  await con.removeDislikedArtworkFromUser([artwork.id])
  //dispatch(removeLikedArtwork(artwork.id))

}

// Remove ArtDisplay from the database, as well as locally
export const removeScannedArtDisplay = (user: any, artwork: ArtDisplay) => async (dispatch: any) => {

  //remove from database if user is signed in
  if (user && artwork.id !== 'default') {
    const data = await con.removeScannedArtworkFromUser([artwork.id]);
    await con.syncRemoteToLocalUser() // over here possibly we can just remove locally but this might cause mismatch in data
    //reload artworks

    if (artwork.liked === true) removeFromLikes(artwork)
    else if (artwork.disliked === true) removeFromDislikes(artwork)
    dispatch(fetchPastArtworks(user))
    dispatch(fetchUnsolvedArtworks(user))
  }

  // remove from store locally
  dispatch(removeArtDisplay(artwork))

}

//  Toggles Like Button on and off.  Add to user's likes and increase overall likes. And undo if clicked again.
export const clickLikeButton = (user: User, artwork: ArtDisplay, fromGallery: boolean) => async (dispatch: any) => {

  // If artwork is already liked, remove from likes
  if (user && artwork.liked) {
    await removeFromLikes(artwork)
  } else {
    if (user && !artwork.liked) {
      if (artwork.disliked) {
        await removeFromDislikes(artwork)
      }

      // Add to Likes
      artwork.liked = true;


      if(artwork.id !== 'default') {
        await con.addLikedArtworkToUser([artwork.id])

        // Increase artwork's overall likes
        if (artwork.likes >= 0) {
          await con.increaseLikesForArtworkById(artwork.id)
        }
      }

    }
  }

  let currentArtDisplay = con.formatArtwork(artwork)
  //user.scanned_artwork is not being updated with likes
  window.localStorage.setItem('user', JSON.stringify(user))
  console.log("USER");
  console.log(user);
  console.log("USER IN CON");
  console.log(con.user);
  window.localStorage.setItem('currentArtDisplay', JSON.stringify(currentArtDisplay))

  dispatch(rerenderArtDisplays())
  dispatch(changeCurrentArtDisplay(currentArtDisplay))

  //If the Like Button is clicked in the Information Tab

  if (fromGallery === false) {
    dispatch(changeCurrentArtDisplay({ ...artwork, liked: artwork.liked }))
    return artwork;
  }

}

//  Toggles Dislike Button on and off. Add to user's dislikes. And undoes if clicked again.
export const clickDislikeButton = (user: User, artwork: ArtDisplay) => async (dispatch: any) => {

  // If artwork is already disliked, remove from dislikes
  if (user && artwork.disliked) {
    await removeFromDislikes(artwork)
  } else {
    if (user && !artwork.disliked) {
      if (artwork.liked) {
        await removeFromLikes(artwork)
      }

      // Add to Dislikes
      artwork.disliked = true;
      if(artwork.id !== 'default') {
        await con.addDislikedArtworkToUser([artwork.id])
      }

    }
  }

  window.localStorage.setItem("user", JSON.stringify(user))

  dispatch(rerenderArtDisplays())
  dispatch(changeCurrentArtDisplay(artwork))

}

export const addSolvedArtwork = (user: any, artworkId: any, points: any) => async (dispatch: any) => {

  await con.addSolvedArtworkToUser([artworkId])
  await con.addPointsToUser(points)
  await con.syncRemoteToLocalUser()
  // might need to correct this
  dispatch(fetchUnsolvedArtworks(user))
  dispatch(getUser(user))
}

export const addVideoToDB = (user: any, artwork: any, video: Video) => async (dispatch: any) => {

  await con.updateArtworkVideos(artwork.id, [...artwork.Videos, video])

  dispatch(addVideo(video));
}

/****** SETTING UP INITIAL STATE ***********/

const defaultCurrentArtDisplay = {
  id: 'default',
  title: 'New York City',
  artist: 'Frédéric Thery',
  year: '2020',
  campus: 'Brooklyn College',
  primary_image: { url: require('../assets/images/frederic-thiery-new-york-city.jpg'), alternativeText: `Porte St Denis` },
  other_images: [
    { url: "https://thumbs.nosto.com/quick/carredaristesus/8/566319340/bf154f4dac1b717cbb33730d656942ab770c24901577ab681fd46cea97c5ecf3a/A", alternativeText: "Petit marché" },
    { url: "https://thumbs.nosto.com/quick/carredaristesus/8/566318950/ece2915fbc817e011d922b80c2b77700ff103a74a707724342da12f16f169d13a/A", alternativeText: "Porte St Denis" }

  ],
  description: 'Inspired by a painter father, Frédéric was interested from a very early age in drawing and painting. He studied fine arts at the University of Aix-en-Provence. After graduation, he moved to southern Spain where he discovered various crafts: leather work, silk painting, jewellery making…By g in contact with these artisans he learned to make leather accessories (belts, bags) and experimented with cold enamel work (producing the same aesthetic effect as enamel, but without firing). He attended a workshop on porcelain painting to learn this technique and soon he experienced the urge to paint on canvas.',
  qr_code: '',
  likes: 0,
  liked: false,
  disliked: false,
  artwork_type_clue: '',
  clue: '',
  Videos: [
    { youtube_id: 'hZ1OgQL9_Cw', youtube_url: 'https://www.youtube.com/watch?v=hZ1OgQL9_Cw', title: 'A Trip Through New York City in 1911', author: 'Denis Shiryaev', user: con.user },
    { youtube_id: 'bYUKSx_bhHM', youtube_url: 'https://www.youtube.com/watch?v=https://www.youtube.com/watch?v=bYUKSx_bhHM', title: 'Footage and History of the Five Boroughs of New York City (1946)', author: '', user: con.user },
  ]
}

// Retrieve artworks in local storage
const pastArtDisplays = determinePastArtDisplays();

// Retrieves artworks based on whether user is logged in or is an anonymous user
function determinePastArtDisplays() {
  console.log("determine");
  if (con.user && JSON.stringify(con.user) !== '{}') {
    console.log("from redux and local storage for a logged in user", con);
    //addLikedDislikedToArtworks(con.user)
    return [...con.user.scanned_artworks, defaultCurrentArtDisplay]
  }
  else {
    // Check if there are past art displays in local storage
    let checkStoragePastArtDisplays = window.localStorage.getItem('pastArtDisplays')

    if (checkStoragePastArtDisplays) {
      console.log("from storage");
      console.log(checkStoragePastArtDisplays)

      let pastArtDisplays = JSON.parse(checkStoragePastArtDisplays || '{}')
      console.log(pastArtDisplays)
      return pastArtDisplays;
    }
  }
  // If user is not logged in and there is no artworks in local storage, only display default
  return [defaultCurrentArtDisplay]
}

// Use local storage to display current art display on refresh instead of default
let storageCurrentArtDisplay = window.localStorage.getItem('currentArtDisplay') && JSON.parse(window.localStorage.getItem('currentArtDisplay') || '{}')


// Retrieve initialState info based on current user state
const initialState: ArtDisplaysState = {
  currentArtDisplay: storageCurrentArtDisplay || defaultCurrentArtDisplay,
  pastArtDisplays: pastArtDisplays,
  allArtDisplays: [defaultCurrentArtDisplay],
  campuses: [],
  unsolvedArtDisplays: []
}


/*********** TYPE CHECKING REDUCERS **********/

export default function (state = initialState, action: ArtDisplayActionTypes) {
  switch (action.type) {
    //This changes the value of the current art to be displayed
    case CHANGE_CURRENT_ART_DISPLAY:
      window.localStorage.setItem('currentArtDisplay', JSON.stringify(action.payload))
      return { ...state, currentArtDisplay: { ...action.payload, liked: action.payload.liked } }
    //checks to see if artwork is already in history
    //duplicate items are not added
    //updates pastArtDisplay
    case GET_SCANNED_ART_DISPLAY:
      let updatedPastArtDisplays = state.pastArtDisplays.some(artwork => artwork.id === action.payload.id) ? [...state.pastArtDisplays] : [...state.pastArtDisplays, action.payload]

      window.localStorage.setItem('pastArtDisplays', JSON.stringify(updatedPastArtDisplays));
      window.localStorage.setItem('currentArtDisplay', JSON.stringify(action.payload))

      return {
        ...state,
        currentArtDisplay: action.payload,
        //doesn't add duplicates to the history
        pastArtDisplays: updatedPastArtDisplays
      }
    case GET_PAST_ART_DISPLAYS:
      return {
        ...state,
        pastArtDisplays: [...action.payload, defaultCurrentArtDisplay]
      }
    case GET_ALL_ART_DISPLAYS:
      return { ...state, allArtDisplays: [...state.allArtDisplays, ...action.payload] }
    case ADD_ART_DISPLAY:
      return {
        ...state, allArtDisplays: [...state.allArtDisplays, action.payload]
      }
    case RESET_ART_DISPLAYS:
      return {
        ...state,
        currentArtDisplay: defaultCurrentArtDisplay,
        pastArtDisplays: [defaultCurrentArtDisplay],
        allArtDisplays: [defaultCurrentArtDisplay],
        unsolvedArtDisplays: []
      }
    case RERENDER_ART_DISPLAYS:
      return {
        ...state
      }
    case REMOVE_ART_DISPLAY: {
      let updatedPastArtDisplays = state.pastArtDisplays.filter(artwork => artwork.id !== action.payload.id)

      // Update local storage so art display shows as removed
      window.localStorage.setItem('pastArtDisplays', JSON.stringify(updatedPastArtDisplays));

      // Clear local storage for currentArtDisplay if the artwork removed is the currently displayed artwork in Information
      if (action.payload.id === state.currentArtDisplay.id) window.localStorage.setItem('currentArtDisplay', '')
      // fetchPastArtworks, should update the past displays
      return {
        ...state,
        // remove this artwork from gallery history
        pastArtDisplays: updatedPastArtDisplays,
        // If the current art display is same one as the one being removed, set current art display to be the default artwork, otherwise, leave it alone
        currentArtDisplay: state.currentArtDisplay.id === action.payload.id ? defaultCurrentArtDisplay : state.currentArtDisplay,


      }
    }
    case INCREASE_LIKES_FOR_ARTWORK:
      //increase number of likes at particular index locally
      // state.pastArtDisplays.forEach((artDisplay: any) => { if (artDisplay.id === action.payload) artDisplay.likes++ })
      return {
        ...state,
        pastArtDisplays: [...state.pastArtDisplays]
      }
    case DECREASE_LIKES_FOR_ARTWORK:
      //increase number of likes at particular index locally
      // state.pastArtDisplays.forEach((artDisplay: any) => { if (artDisplay.id === action.payload && artDisplay.likes >= 1) artDisplay.likes-- })
      return {
        ...state,
        pastArtDisplays: [...state.pastArtDisplays]
      }
    case ADD_UNSOLVED_ARTWORKS:
      return { ...state, unsolvedArtDisplays: [...action.payload]}
    case ADD_VIDEO:
      return {
        ...state,
        currentArtDisplay: { ...state.currentArtDisplay, Videos: [action.payload, ...state.currentArtDisplay.Videos] },
        pastArtDisplays: state.pastArtDisplays.map(artwork => {
          // map over all artDisplays to find corresponding artwork and update video section
          if (artwork.id === state.currentArtDisplay.id) artwork.Videos = [action.payload, ...artwork.Videos]
          return artwork
        })
      }
    default:
      return state
  }
}


/** add System reduce soon : https://redux.js.org/recipes/usage-with-typescript */
