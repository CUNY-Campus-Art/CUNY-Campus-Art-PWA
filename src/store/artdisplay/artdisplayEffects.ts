import axios from "axios";
import { StrapiApiConnection } from "../util";
import { getUser, formatUser, User } from "../user";
import { ArtDisplay, Video } from "./artdisplayModels";
import {
  addUnsolvedArtworks,
  changeCurrentArtDisplay,
  gotPastArtDisplays,
  gotScannedArtDisplay,
  removeArtDisplay,
  rerenderArtDisplays,
  addVideo,
  gotAllCampuses,
} from "./artdisplayActions";

/*** THUNK CREATORS TO FETCH INFO FROM DATABASE ****/
const strapiUrl = "https://dev-cms.cunycampusart.com";

let con: StrapiApiConnection = new StrapiApiConnection();

/** fetchPastArtworks
 * fetches user's past artworks information and adds on like and disliked status for each artwork
 * @param userInfo
 */
export const fetchPastArtworks = (userInfo: any) => async (dispatch: any) => {
  let user = userInfo;

  // if(con.user) {

  // await con.syncRemoteToLocalUser()
  let artworks: any = user.scanned_artworks ? user.scanned_artworks : [];

  // save ids of liked artworks
  let likedArtworkIds = user.liked_artworks
    ? user.liked_artworks.map((likedArtwork: any) => likedArtwork.id)
    : [];

  // save ids of disliked artworks
  let dislikedArtworkIds = user.disliked_artworks
    ? user.disliked_artworks.map((dislikedArtwork: any) => dislikedArtwork.id)
    : [];

  // looks through artworks:
  // if artwork is present in liked_artworks, artwork is tagged with a liked value of true
  // if artwork is present in disliked_artworks, artwork is tagged with a disliked value of true
  // 'liked' value is manually derived added here, info not directly in database
  artworks = artworks.map((artwork: any) => {
    likedArtworkIds.includes(artwork.id)
      ? (artwork.liked = true)
      : (artwork.liked = false);
    dislikedArtworkIds.includes(artwork.id)
      ? (artwork.disliked = true)
      : (artwork.disliked = false);
    return artwork;
  });

  dispatch(gotPastArtDisplays(artworks));

  return artworks;
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
      const { data } = await axios.get(strapiUrl + "/artworks/" + artworkId);

      // save ids of liked artworks
      let likedArtworkIds =
        con.user && con.user.liked_artworks
          ? con.user.liked_artworks.map((likedArtwork: any) => likedArtwork.id)
          : [];

      // save ids of disliked artworks
      let dislikedArtworkIds =
        con.user && con.user.disliked_artworks
          ? con.user.disliked_artworks.map(
              (dislikedArtwork: any) => dislikedArtwork.id
            )
          : [];

      data.liked = likedArtworkIds.includes(data.id) ? true : false;
      data.disliked = dislikedArtworkIds.includes(data.id) ? true : false;
      //const data = await con.getArtworkById(artworkId)

      console.log("getArtworkById", data);
      dispatch(gotScannedArtDisplay(data));

      return artworkId;
    } catch (error) {
      console.log(error);
      return ""; // So front end knows invalid artwork scanned
    }

    //updates database
  };

// Helper Function: removeFromLikes
const removeFromLikes = async (artwork: any) => {
  // will toggle like button to neutral
  artwork.liked = false;

  // Exit early if default artwork
  if (artwork.id === "default") return;

  // decrease artwork's overall likes
  if (artwork.likes > 0) {
    await con.decreaseLikesForArtworkById(artwork.id);
    //dispatch(decreaseLikesForArtwork(artwork.id))
  }

  // will remove from user's likes
  await con.removeLikedArtworkFromUser([artwork.id]);
};

// Helper Function: removeFromDislikes
const removeFromDislikes = async (artwork: any) => {
  // Toggle dislike button to off mode
  artwork.disliked = false;

  // Exit early if default artwork
  if (artwork.id === "default") return;

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
      await con.syncRemoteToLocalUser(); // over here possibly we can just remove locally but this might cause mismatch in data
      //reload artworks
      if (artwork.liked) removeFromLikes(artwork);
      if (artwork.disliked) removeFromDislikes(artwork);
      dispatch(fetchPastArtworks(con.user));
    }

    // remove from store locally
    dispatch(removeArtDisplay(artwork));
  };

//  Toggles Like Button on and off.  Add to user's likes and increase overall likes. And undo if clicked again.
export const clickLikeButton =
  (user: User, artwork: ArtDisplay, fromGallery: boolean) =>
  async (dispatch: any) => {
    // If artwork is already liked, remove from likes
    if (user && artwork.liked) {
      await removeFromLikes(artwork);
    } else {
      if (user && !artwork.liked) {
        if (artwork.disliked) {
          await removeFromDislikes(artwork);
        }

        // Add to Likes
        artwork.liked = true;

        if (artwork.id !== "default") {
          await con.addLikedArtworkToUser([artwork.id]);

          // Increase artwork's overall likes
          if (artwork.likes >= 0) {
            await con.increaseLikesForArtworkById(artwork.id);
          }
        }
      }
    }
    dispatch(rerenderArtDisplays());
    dispatch(changeCurrentArtDisplay(artwork));

    //If the Like Button is clicked in the Information Tab

    if (fromGallery === false) {
      dispatch(changeCurrentArtDisplay({ ...artwork, liked: artwork.liked }));
      return artwork;
    }
  };

//  Toggles Dislike Button on and off. Add to user's dislikes. And undoes if clicked again.
export const clickDislikeButton =
  (user: User, artwork: ArtDisplay) => async (dispatch: any) => {
    // If artwork is already disliked, remove from dislikes
    if (user && artwork.disliked) {
      await removeFromDislikes(artwork);
    } else {
      if (user && !artwork.disliked) {
        if (artwork.liked) {
          await removeFromLikes(artwork);
        }

        // Add to Dislikes
        artwork.disliked = true;
        if (artwork.id !== "default") {
          await con.addDislikedArtworkToUser([artwork.id]);
        }
      }
    }

    dispatch(rerenderArtDisplays());
    dispatch(changeCurrentArtDisplay(artwork));
  };

export const addSolvedArtwork =
  (user: any, artworkId: any, points: any) => async (dispatch: any) => {
    con.user = user;
    await con.addSolvedArtworkToUser([artworkId]);
    await con.addPointsToUser(points);
    await con.syncRemoteToLocalUser();
    user = await formatUser(con.user);
    dispatch(addUnsolvedArtworks(user.unsolved_artworks));
    dispatch(getUser(user));
  };

export const addVideoToDB =
  (user: any, artwork: any, video: Video) => async (dispatch: any) => {
    await con.updateArtworkVideos(artwork.id, [...artwork.Videos, video]);

    dispatch(addVideo(video));
  };
