import { StrapiApiConnection } from "../util";
import { ArtDisplaysState } from "./artdisplayModels";
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
  ArtDisplayActionTypes,
} from "./artdisplayActions";

let con: StrapiApiConnection = new StrapiApiConnection();

/****** SETTING UP INITIAL STATE ***********/

export const defaultCurrentArtDisplay = {
  id: "default",
  title: "New York City",
  artist: "Frédéric Thery",
  year: "2020",
  campus: "Brooklyn College",
  primary_image: {
    url: require("../../assets/images/frederic-thiery-new-york-city.jpg"),
    alternativeText: `Porte St Denis`,
  },
  other_images: [
    {
      url: "https://thumbs.nosto.com/quick/carredaristesus/8/566319340/bf154f4dac1b717cbb33730d656942ab770c24901577ab681fd46cea97c5ecf3a/A",
      alternativeText: "Petit marché",
    },
    {
      url: "https://thumbs.nosto.com/quick/carredaristesus/8/566318950/ece2915fbc817e011d922b80c2b77700ff103a74a707724342da12f16f169d13a/A",
      alternativeText: "Porte St Denis",
    },
  ],
  description:
    "Inspired by a painter father, Frédéric was interested from a very early age in drawing and painting. He studied fine arts at the University of Aix-en-Provence. After graduation, he moved to southern Spain where he discovered various crafts: leather work, silk painting, jewellery making…By g in contact with these artisans he learned to make leather accessories (belts, bags) and experimented with cold enamel work (producing the same aesthetic effect as enamel, but without firing). He attended a workshop on porcelain painting to learn this technique and soon he experienced the urge to paint on canvas.",
  qr_code: "",
  likes: 0,
  liked: false,
  disliked: false,
  artwork_type_clue: "",
  clue: "",
  Videos: [
    {
      youtube_id: "hZ1OgQL9_Cw",
      youtube_url: "https://www.youtube.com/watch?v=hZ1OgQL9_Cw",
      title: "A Trip Through New York City in 1911",
      author: "Denis Shiryaev",
      user: con.user,
    },
    {
      youtube_id: "bYUKSx_bhHM",
      youtube_url:
        "https://www.youtube.com/watch?v=https://www.youtube.com/watch?v=bYUKSx_bhHM",
      title: "Footage and History of the Five Boroughs of New York City (1946)",
      author: "",
      user: con.user,
    },
  ],
};

// Retrieve artworks in local storage
const pastArtDisplays = determinePastArtDisplays();

// Retrieves artworks based on whether user is logged in or is an anonymous user
function determinePastArtDisplays() {
  console.log("determine");
  if (con.user) {
    // console.log("from redux and local storage for a logged in user");
    return [...con.user.scanned_artworks, defaultCurrentArtDisplay];
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
  unsolvedArtDisplays: [],
};

/*********** TYPE CHECKING REDUCERS **********/

export default function (state = initialState, action: ArtDisplayActionTypes) {
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
      let updatedPastArtDisplays = state.pastArtDisplays.some(
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
    case INCREASE_LIKES_FOR_ARTWORK:
      //increase number of likes at particular index locally
      // state.pastArtDisplays.forEach((artDisplay: any) => { if (artDisplay.id === action.payload) artDisplay.likes++ })
      return {
        ...state,
        pastArtDisplays: [...state.pastArtDisplays],
      };
    case DECREASE_LIKES_FOR_ARTWORK:
      //increase number of likes at particular index locally
      // state.pastArtDisplays.forEach((artDisplay: any) => { if (artDisplay.id === action.payload && artDisplay.likes >= 1) artDisplay.likes-- })
      return {
        ...state,
        pastArtDisplays: [...state.pastArtDisplays],
      };
    case ADD_UNSOLVED_ARTWORKS:
      return { ...state, unsolvedArtDisplays: action.payload };
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
        }),
      };
    default:
      return state;
  }
}

/** add System reduce soon : https://redux.js.org/recipes/usage-with-typescript */
