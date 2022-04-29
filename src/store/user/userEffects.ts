import { StrapiApiConnection } from "../util";
import { fetchPastArtworks, addUnsolvedArtworks } from "../artdisplay";
import { getUser, removeUser, loginError, signupError } from "./userActions";

// Checks local storage to see if user was previously logged in. If so, retrieves, user info based on local storage. Otherwise, the default user is set to empty
let con: StrapiApiConnection = new StrapiApiConnection();

const getUnsolvedArtworks = async (user: any) => {
  let artworks = await con.getAllArtworksWithClues();

  let solvedArtworksIds = user.solved_artworks.map(
    (artwork: any) => artwork.id
  );

  // Filter out solved artwords and artworks that don't have a clue attached
  let unsolvedArtworks = artworks.filter(
    (artwork: any) => !solvedArtworksIds.includes(artwork.id) && artwork.clue
  );
  localStorage.setItem("unsolved", JSON.stringify(unsolvedArtworks));
  return unsolvedArtworks;
};

export const formatUser = async (user: any) => {
  let formattedUser = {
    user_name: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    profile_picture: user.profile_picture,
    campus: user.campus ? user.campus.campus_name : "",
    campusId: user.campus ? user.campus.campusid : "",
    campusName: user.campus ? user.campus.campus_name : "",
    scanned_artworks: user.scanned_artworks ? user.scanned_artworks : [],
    total_points: user.total_points,
    liked_artworks: user.liked_artworks ? user.like_artworks : [],
    disliked_artworks: user.dislike_artworks ? user.dislike_artworks : [],
    solved_artworks: user.solved_artworks ? user.solved_artworks : [],
    unsolved_artworks: [],
  };

  formattedUser.unsolved_artworks = await getUnsolvedArtworks(formattedUser);

  return formattedUser;
};

export const initializeUser = (user: any) => async (dispatch: any) => {
  await con.syncRemoteToLocalUser();
  let user = await formatUser(con.user);
  dispatch(getUser(user));
  dispatch(fetchPastArtworks(user));
  dispatch(addUnsolvedArtworks(user.unsolved_artworks));
};

// export const addUnsolvedArtworks = (artworks:any) => ({
//   type: ADD_UNSOLVED_ARTWORKS,
//   payload: artworks
// })

/*** THUNK CREATORS TO FETCH INFO FROM DATABASE ****/

// export const me = () => async dispatch => {
//   try {
//     const res = await axios.get('/auth/me')
//     dispatch(getUser(res.data || defaultUser))
//   } catch (err) {
//     console.error(err)
//   }
// }

export const signupNewUser =
  (
    email: string,
    pw: string,
    username: string,
    firstName: string = "",
    lastName: string = "",
    campusId: string,
    file: any = ""
  ) =>
  async (dispatch: any) => {
    con = new StrapiApiConnection();

    let status = await con.createUser(
      email,
      pw,
      username,
      firstName,
      lastName,
      campusId,
      file
    );

    // If user is successfully signed up, the con object will internally get assigned a user
    if (con.user) {
      let newUser = await formatUser(con.user);
      //dispatch((newUser.unsolved_artworks))
      dispatch(getUser(newUser));
      dispatch(fetchPastArtworks(newUser));
      dispatch(addUnsolvedArtworks(newUser.unsolved_artworks));
      // save specific fields from user
      console.log(
        "You have been successfully signed in. You will be redirected in a few seconds..."
      );
    }

    //If there is a user assigned that means user was successfully added to database, so return true
    return con.user ? true : false;
  };

/* modified loginAndGetToken functioning most recent 12/9 */
export const fetchUser = (id: string, pw: string) => async (dispatch: any) => {
  try {
    let returnData: any = await con.loginUser(id, pw);

    if (returnData.status === 200) {
      // Clearing local storage if user logs in
      // TO DO: Have scanned artworks added to past art displays before clearing local storage
      //localStorage.clear()
      let token = returnData.data.jwt;
      let user = returnData.data.user;
      //con = new StrapiApiConnection(token, user);
      user = await formatUser(con.user);
      dispatch(getUser(user));
      dispatch(fetchPastArtworks(user));
      dispatch(addUnsolvedArtworks(user.unsolved_artworks));

      console.log(
        "You have been successfully logged in. You will be redirected in a few seconds..."
      );
    }

    if (returnData.status === -1) {
      console.log("Incorrect username or password");
      dispatch(loginError());
    }
  } catch (error) {
    dispatch(loginError());
  }
};

//This was added so that artwork could be added to database without any errors and duplicate con objets
export const addScannedArtDisplayToUserDB =
  (user: any, artworkId: any) => async (dispatch: any) => {
    con.user = user;
    await con.addScannedArtworkToUser([artworkId]);
    await con.syncRemoteToLocalUser();
  };

// export const auth = (email, password, method) => async dispatch => {
//   let res
//   try {
//     res = await axios.post(`/auth/${method}`, {email, password})
//   } catch (authError) {
//     return dispatch(getUser({error: authError}))
//   }

//   try {
//     dispatch(getUser(res.data))
//     history.push('/home')
//   } catch (dispatchOrHistoryErr) {
//     console.error(dispatchOrHistoryErr)
//   }
// }

// Clears local storage and removes user from s tate
export const logout = () => async (dispatch: any) => {
  try {
    //await axios.post('/auth/logout')
    localStorage.clear();
    dispatch(removeUser());
    // history.push('/login')
  } catch (err) {
    console.error(err);
  }
};
