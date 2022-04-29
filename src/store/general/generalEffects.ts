import axios from "axios";
import { StrapiApiConnection } from "../util";

import type { ArtDisplay } from "../artdisplay/artdisplayModels";
import {
  gotAllArtDisplays,
  rerenderArtDisplays,
  gotAllCampuses,
} from "./generalActions";

/*** THUNK CREATORS TO FETCH INFO FROM DATABASE ****/
const strapiUrl = "https://dev-cms.cunycampusart.com";

let con: StrapiApiConnection = new StrapiApiConnection();

/* fetchAllArtworks, in the Strapi API, this is named getAllArtworks */
export const fetchAllArtworks = () => async (dispatch: any) => {
  const { data } = await axios.get(strapiUrl + "/artworks");
  //filters out any empty artworks from the database
  const artDisplays = data.filter(
    (artwork: ArtDisplay) => artwork.title && artwork.artist
  );
  console.log("fetchAllArtworks", artDisplays);
  dispatch(gotAllArtDisplays(artDisplays));
  return data;
};

export const fetchAllCampuses = () => async (dispatch: any) => {
  const data = await con.getAllCampuses();

  await dispatch(gotAllCampuses(data));
  //return data;
};
