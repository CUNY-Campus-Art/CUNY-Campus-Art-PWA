import axios from "axios";

export class StrapiApiConnection {
  //Either retrieved info will be passed to constructor or values will be set by accessing local storage. retrieved info will take precedence so new user can be logged in

  constructor(authToken, user) {
    this.strapiUrl = "https://dev-cms.cunycampusart.com"; //url to strapi API endpoint

    if (authToken && user) {
      this.authToken = authToken;
      this.user = user;
    }
    // Checks if anything in local storage, relevant for when app initially loads or refreshes
    else if (
      !!window.localStorage.getItem("user") &&
      !!window.localStorage.getItem("jwt") &&
      window.localStorage.getItem("user") !== "{}"
    ) {
      console.log(this.user);
      this.user = JSON.parse(window.localStorage.getItem("user") || "{}");
      this.authToken = window.localStorage.getItem("jwt");
      this.unsolved = !!window.localStorage.getItem("unsolved")
        ? JSON.parse(window.localStorage.getItem("unsolved"))
        : [];
      this.user.unsolved_artworks = this.unsolved;
      //updates local user to be up to date with the database
      this.syncRemoteToLocalUser();
    }

    // Retrieves all artworks that have clues attached. Placed here so this is called only once
    //this.allArtworksWithClues = this.getAllArtworksWithClues()
  }

  /* getAllArtworks
  Function calls to strapi api to get all artworks in db
  Accepts:
   - none
  Returns:
  - JSON data for all artworks
  */
  getAllArtworks = async () => {
    const { data } = await axios.get(this.strapiUrl + "/artworks");
    console.log("getAllArtworks", data);
    return data;
  };

  /* getArtworkById
  Function calls to strapi api get entry for one artwork
  Accepts:
   - id - id of artwork entry
  Returns:
   - JSON data for the entry
  */
  getArtworkById = async (id) => {
    const { data } = await axios.get(this.strapiUrl + "/artworks/" + id);
    console.log("getArtworkById", data);
    return data;
  };

  /* getAllCampuses
  Function calls to strapi api to get all campuses in db
  Accepts:
   - none
  Returns:
   - JSON data for all campuses
  */
  getAllCampuses = async () => {
    const { data } = await axios.get(this.strapiUrl + "/campuses");
    //console.log('getAllCampuses', data)
    return data;
  };

  /* getCampusById
  Function calls to strapi api get entry for one campus
  Accepts:
   - id - id of campus entry
  Returns:
   - JSON data for the entry
  */
  getCampusById = async (id) => {
    const { data } = await axios.get(this.strapiUrl + "/campuses/" + id);
    console.log("getCampusById", data);
    return data;
  };

  /* getArtworksInCampusByName
  Function calls to strapi api get all artwork entries associated to a campus using campus name
  Accepts:
   - campusName - name of campus (must be spelled correctly, capitalization doesnt matter)
  Returns:
   - JSON data for all artworks associated to the campus
  */
  getArtworksInCampusByName = async (campusName) => {
    const { data } = await axios.get(
      this.strapiUrl + "/artworks?campus.campus_name_contains=" + campusName
    );
    console.log("getArtworksInCampusByName", data);
    return data;
  };

  /* getArtworksInCampusById
  Function calls to strapi api get all artwork entries associated to a campus using campus id
  Accepts:
   - campusId - id of campus entry
  Returns:
   - JSON data for all artworks associated to the campus
  */
  getArtworksInCampusById = async (campusId) => {
    const { data } = await axios.get(
      this.strapiUrl + "/artworks?campus.id=" + campusId
    );
    console.log("getArtworksInCampusById", data);
    return data;
  };

  /* getArtworksInCampusById
  Function calls to strapi api get all artwork entries associated to a campus using campus id where the
  clue is populated
  Accepts:
   - campusId - id of campus entry
  Returns:
   - JSON data for all artworks associated to the campus
  */
  getArtworkWithCluesforCampusById = async (campusId) => {
    let artworks = await this.getArtworksInCampusById(campusId);

    let cluedArtworks = artworks.filter((artwork) => artwork.clue != null);

    return cluedArtworks;
  };

  getAllArtworksWithClues = async () => {
    const { data } = await axios.get(this.strapiUrl + "/artworks");

    let artworks = data;

    let cluedArtworks = artworks.filter((artwork) => artwork.clue != null);

    return cluedArtworks;
  };

  /* createArtwork
  Function calls to strapi API to create a new artwork entry
  Accepts:
    - dataIn - data for a new artwork entry, example: {title: "new artwork from js", artist:"new artist", description:"test description", year: "2000"}
  Returns:
    - full post response from strapi api if successfull or -1 if failed
  */
  createArtwork = async (dataIn) => {
    const sendConfig = {
      headers: {
        Authorization: "Bearer " + this.authToken,
        "Content-Type": "application/json",
      },
    };
    const sendData = JSON.stringify(dataIn);
    const returnData = await this.axiosPostToStrapi(
      this.strapiUrl + "/artworks",
      sendData,
      sendConfig
    );
    console.log("createArtwork returnData", returnData);
    this.createAndUploadQRImageForArtwork(returnData.data.id);
    return returnData;
  };

  /*addPointsToUser
  Function adds given number of points to the user total points
  Accepts:
   - numPoints - integer value of points to add to the total points
  Returns: api request reponse
  */
  addPointsToUser = async (numPoints) => {
    //await this.syncRemoteToLocalUser()
    let newPoints = numPoints + this.user.total_points;
    let response = await this.updatePointsForUser(newPoints);
    return response;
  };

  /*removePointsFromUser
Function remove given number of points from the user total points
Accepts:
 - numPoints - integer value of points to remove from the total points
Returns: api request reponse
*/
  removePointsFromUser = async (numPoints) => {
    await this.syncRemoteToLocalUser();
    let newPoints = this.user.total_points - numPoints;
    let response = await this.updatePointsForUser(newPoints);
    return response;
  };

  /*updatePointsForUser
Function updates users total points to a given number
Accepts:
 - numPoints - integer value of points to update the total points
Returns: api request reponse
*/
  updatePointsForUser = async (numPoints) => {
    await this.syncRemoteToLocalUser();
    let response = await this.updateRemoteUser({ total_points: numPoints });
    console.log(response);
    if (response.status === 200) {
      this.user.total_points = response.data.total_points;
    }
    return response;
  };

  /* updateArtworkById
  Function calls to strapi API to updat a artwork entry
  Accepts:
    - id - id of artwork entry
    - dataIn - data for artwork entry, example: {title: "updated artwork from js"}
  Returns:
    - full post response from strapi api if successfull or -1 if failed
  */
  updateArtworkById = async (id, dataIn) => {
    const sendConfig = {
      headers: {
        Authorization: "Bearer " + this.authToken,
        "Content-Type": "application/json",
      },
    };
    const sendData = JSON.stringify(dataIn);
    console.log(sendData, "SENDDATA");

    const returnData = await this.axiosPutToStrapi(
      this.strapiUrl + "/artworks/" + id,
      sendData,
      sendConfig
    );
    return returnData;
  };

  updateArtworkVideos = async (id, videoData) => {
    this.updateArtworkById(id, { Videos: videoData });
  };

  /*increaseLikesForArtworkById
  Function to increase a artworks likes count by 1
  Accepts:
   - id - artwork id
  Returns: api request reponse
  */
  increaseLikesForArtworkById = async (id) => {
    this.updateLikeForArtworkById(id, 1);
  };

  /*decreaseLikesForArtworkById
Function to decrease a artworks likes count by 1
Accepts:
 - id - artwork id
Returns: api request reponse
*/
  decreaseLikesForArtworkById = async (id) => {
    this.updateLikeForArtworkById(id, 2);
  };

  /*updateLikeForArtworkById
Function to update a artworks likes count by 1
Accepts:
 - id - artwork id
 - typeOfUpdate - integer - 1 to increase, 2 to decrease
Returns: api request reponse
*/
  updateLikeForArtworkById = async (id, typeOfUpdate) => {
    // 3 instances of con seems to diverge. So retrieving jwt from local storage can prevent  unauthorized access and an undefined token
    this.authToken = localStorage.getItem('jwt')

    const sendConfig = {
      headers: {
        Authorization: "Bearer " + this.authToken,
        "Content-Type": "application/json",
      },
    };
    try {
      const sendData = JSON.stringify({ id: id, type: typeOfUpdate });
      let response = await this.axiosPutToStrapi(
        this.strapiUrl + "/user/likeartwork",
        sendData,
        sendConfig
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  /* deleteArtworkById
  Function calls to strapi API to delete a artwork entry
  Accepts:
    - id - id of artwork entry
  Returns:
    - delete response from strapi API
  */
  deleteArtworkById = async (id) => {
    const sendConfig = {
      headers: {
        Authorization: "Bearer " + this.authToken,
      },
    };
    const returnData = await this.axiosDeleteFromStrapi(
      this.strapiUrl + "/artworks/" + id,
      sendConfig
    );
    return returnData;
  };

  /* createCampus
  Function calls to strapi API to create a new campus entry
  Accepts:
    - dataIn - data for a new campus entry, example: {campus_name: "BMCC"}
  Returns:
    - full post response from strapi api if successfull or -1 if failed
  */
  createCampus = async (dataIn) => {
    const sendConfig = {
      headers: {
        Authorization: "Bearer " + this.authToken,
        "Content-Type": "application/json",
      },
    };
    const sendData = JSON.stringify(dataIn);
    const returnData = await this.axiosPostToStrapi(
      this.strapiUrl + "/campuses",
      sendData,
      sendConfig
    );
    return returnData;
  };

  /* updateCampusById
  Function calls to strapi API to updat a campus entry
  Accepts:
    - id - id of artwork entry
    - dataIn - data for a new campus entry, example: {campus_name: "BMCC"}
  Returns:
    - full post response from strapi api if successfull or -1 if failed
  */
  updateCampusById = async (id, dataIn) => {
    const sendConfig = {
      headers: {
        Authorization: "Bearer " + this.authToken,
        "Content-Type": "application/json",
      },
    };
    const sendData = JSON.stringify(dataIn);
    const returnData = await this.axiosPutToStrapi(
      this.strapiUrl + "/campuses/" + id,
      sendData,
      sendConfig
    );
    return returnData;
  };

  /* deleteCampusById
  Function calls to strapi API to delete a campus entry
  Accepts:
    - id - id of campus entry
  Returns:
    - delete response from strapi API
  */
  deleteCampusById = async (id) => {
    const sendConfig = {
      headers: {
        Authorization: "Bearer " + this.authToken,
      },
    };
    const returnData = await this.axiosDeleteFromStrapi(
      this.strapiUrl + "/campuses/" + id,
      sendConfig
    );
    return returnData;
  };

  /*createUser
  Function calls to strapi to register a new user with public role
  Accepts:
    - email - text
    - password - text
    - username - text
    - fistName - text
    - lastName - text
    - file - a Buffer or Stream
  Returns: object contain a sucess (boolean) variable that indicates if registeration
           was succesful or not and either a api response if successful (user data and auth token)
           or error object if unsuccessful
            -- error object can be array of error messages or one error message object
            ---- more than 1 error message example: message[0].messages[0]
            ---- 1 error message example: {id: "Auth.form.error.email.taken", message: "Email is already taken."}
  */
  createUser = async (
    email,
    pw,
    username,
    firstName = "",
    lastName = "",
    campusId = "",
    file
  ) => {
    let error;
    let response;

    await axios
      .post(this.strapiUrl + "/auth/local/register", {
        username: username,
        email: email,
        password: pw,
        first_name: firstName,
        last_name: lastName,
        campus: campusId,
      })
      .then((res) => {
        console.log(res);
        response = res.data;

        if (response) {
          if (file) {
            this.axiosUploadToStrapi(
              this.authToken,
              file,
              response.user.id,
              "user",
              "profile_picture",
              "users-permissions"
            );
          }
          this.authToken = response.jwt;
          this.user = this.formatUser(response.user);
          return { success: true, response: response, error: {} };
        } else {
          return { success: false, response: {}, error: error };
        }
      })
      .catch((e) => {
        if (
          e.response.data.message[0].messages.length === 1 &&
          e.response.data.message.length === 1
        ) {
          error = e.response.data.message[0].messages[0];
        } else {
          error = e.response.data.message;
        }
      });
  };

  /* loginUser
  Function calls to strapi api to login a user
  Accepts:
   - id - user id (email, username)
   - pw - password for the respective account
  Returns: login response if
  */
  loginUser = async (id, pw) => {
    const sendConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const sendData = JSON.stringify({
      identifier: id,
      password: pw,
    });

    const returnData = await this.axiosPostToStrapi(
      this.strapiUrl + "/auth/local",
      sendData,
      sendConfig
    );
    if (returnData.data) {
      this.user = this.formatUser(returnData.data.user);
      this.authToken = returnData.data.jwt;
      window.localStorage.setItem("jwt", this.authToken);
      window.localStorage.setItem("user", JSON.stringify(this.user));
    }

    return returnData;
  };

  /* loginAndGetToken
  Function calls to strapi api to login a user and get authentication token that will be used for
  other calls to create, update, delete entries in database.
  Accepts:
   - id - user id (email, username)
   - pw - password for the respective account
  Returns: authentication token if call is completed succesfully or -1 if there was a error.
  */
  loginAndGetToken = async (id, pw) => {
    let returnData = await this.loginUser(id, pw);

    if (returnData.status === 200) {
      this.user = this.formatUser(returnData.data.user);
      this.authToken = returnData.data.jwt;
      window.localStorage.setItem("jwt", this.authToken);
      window.localStorage.setItem("user", JSON.stringify(this.user));
      return returnData.data.jwt;
      
    } else {
      return -1;
    }
  };

  /* loginAndGetUser
  Function calls to strapi api to login a user and get user object
  Accepts:
   - id - user id (email, username)
   - pw - password for the respective account
  Returns:user object
  */
  loginAndGetUser = async (id, pw) => {
    let returnData = await this.loginUser(id, pw);
    if (returnData.status === 200) {
      return returnData.data.user;
    } else {
      return -1;
    }
  };

  /* loginAndGetUser
  Function to get user object
  Returns:saved user object
  */
  getUser = () => {
    return this.user;
  };

  /* getToken
  Function to get authentication token
  Returns:saved authentication token
  */
  getToken = () => {
    return this.authToken;
  };

  formatUser = (user) => {
    let {
      id,
      username,
      first_name,
      last_name,
      email,
      profile_picture,
      campus,
      scanned_artworks,
      total_points,
      liked_artworks,
      disliked_artworks,
      solved_artworks,
    } = user;

    let formattedUser = {
      id: id,
      username: username,
      first_name: first_name,
      last_name: last_name,
      email: email,
      profile_picture: profile_picture,
      campus: campus ? campus.campus_name : "",
      campus_id: campus ? campus.id : "",
      campus_name: campus ? campus.campus_name : "",
      scanned_artworks: scanned_artworks.length ? [...scanned_artworks] : [],
      total_points: total_points,
      liked_artworks: liked_artworks.length ? [...liked_artworks] : [],
      disliked_artworks: disliked_artworks.length ? [...disliked_artworks] : [],
      solved_artworks: solved_artworks.length ? [...solved_artworks] : [],
      unsolved_artworks: [],
    };

    // Format Each Artwork and then add values for liked and disliked artworks
    formattedUser.scanned_artworks = formattedUser.scanned_artworks.map(
      (artwork) => this.formatArtwork(artwork)
    );

    formattedUser.liked_artworks = formattedUser.liked_artworks.map((artwork) =>
      this.formatArtwork(artwork)
    );

    formattedUser.disliked_artworks = formattedUser.disliked_artworks.map(
      (artwork) => this.formatArtwork(artwork)
    );

    // adds'like' and 'dislike' property values to user's scanned_artworks
    this.addLikedDislikedToArtworks(formattedUser);

    // Moving this async call because it makes formatting the user info much longer than it needs to be.
    //formattedUser.unsolved_artworks = await this.getUnsolvedArtworks(formattedUser)

    return formattedUser;
  };

  getUnsolvedArtworks = async (user) => {
    let allArtworks = await this.getAllArtworksWithClues();
    let solvedArtworksIds = user.solved_artworks.map((artwork) => artwork.id);

    // Filter out solved artwords and artworks that don't have a clue attached
    let unsolvedArtworks = allArtworks
      .filter(
        (artwork) => !solvedArtworksIds.includes(artwork.id) && artwork.clue
      )
      .map((artwork) => this.formatArtwork(artwork));
    user.unsolved_artworks = unsolvedArtworks;
    this.user = user;
    localStorage.setItem("unsolved", JSON.stringify(unsolvedArtworks));

    return unsolvedArtworks;
  };

  formatArtwork = (artwork) => {
    let currentArtwork = {
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist,
      description: artwork.description,
      primary_image: artwork.primary_image,
      other_images: artwork.other_images,
      year: artwork.year,
      qr_code: artwork.qr_image,
      campus: artwork.campus,
      likes: artwork.likes, //Overall likes
      liked: false, // Specific to user (locally derived)
      disliked: false, // Specific to user (locally derived)
      artwork_type_clue: artwork.artwork_type_clue,
      clue: artwork.clue,
      Videos: artwork.Videos,
    };

    return currentArtwork;
  };

  // More accurrate name would be 'addLikedDislikedStatusToPastArtworks'
  //  Adds 'like' and 'dislike' values to a user's scanned_artworks
  addLikedDislikedToArtworks = (user) => {
    // if(con.user) {

    // await con.syncRemoteToLocalUser()
    let artworks = user.scanned_artworks ? user.scanned_artworks : [];

    // save ids of liked artworks
    let likedArtworkIds = user.liked_artworks
      ? user.liked_artworks.map((likedArtwork) => likedArtwork.id)
      : [];

    // save ids of disliked artworks
    let dislikedArtworkIds = user.disliked_artworks
      ? user.disliked_artworks.map((dislikedArtwork) => dislikedArtwork.id)
      : [];

    // looks through artworks:
    // if artwork is present in liked_artworks, artwork is tagged with a liked value of true
    // if artwork is present in disliked_artworks, artwork is tagged with a disliked value of true
    // 'liked' value is manually derived added here, info not directly in database
    artworks = artworks.map((artwork) => {
      likedArtworkIds.includes(artwork.id)
        ? (artwork.liked = true)
        : (artwork.liked = false);
      dislikedArtworkIds.includes(artwork.id)
        ? (artwork.disliked = true)
        : (artwork.disliked = false);
      return artwork;
    });

    window.localStorage.setItem("user", JSON.stringify(user));
    window.localStorage.setItem("pastArtDisplays", JSON.stringify(artworks));

    return artworks;
  };

  /* syncRemoteToLocalUser
  Function to get user profile data from api and update local user object;
  Returns:user object from api
  */
  syncRemoteToLocalUser = async () => {
    const sendConfig = {
      headers: {
        Authorization: "Bearer " + this.authToken,
      },
    };
    try {
      let returnData = await axios.get(
        this.strapiUrl + "/users/profile",
        sendConfig
      );
      console.log("SYNC", returnData);
      this.user = this.formatUser(returnData.data);
      window.localStorage.setItem("user", JSON.stringify(this.user));
      await this.getUnsolvedArtworks(this.user);
      return returnData;
    } catch (error) {
      console.log("SYNC-Fail", error);
    }
  };

  /* updateRemoteUser
  Function updates user fields
  Accepts:
   - dataIn - a json parsable object in the form { 'fieldname': fieldvalue }, the field names must be values that exist in the user model
   --- example call to the function con.updateRemoteUser({'first_name':bob});
  Returns: api request reponse
  */
  updateRemoteUser = async (dataIn) => {
    const sendConfig = {
      headers: {
        Authorization: "Bearer " + this.authToken,
        "Content-Type": "application/json",
      },
    };

    const sendData = JSON.stringify(dataIn);

    let response = await this.axiosPutToStrapi(
      this.strapiUrl + "/users/profile",
      sendData,
      sendConfig
    );
    console.log(response);
    return response;
  };

  /* addScannedArtworkToUser
  Function that adds to users scanned artworks by artwork id
  Accepts:
   - artworkIdArray - array of integer id's of artwork that exist
  Returns: api request reponse
  */
  addScannedArtworkToUser = async (artworkIdArray) => {
    //await this.syncRemoteToLocalUser()

    let existingArtworks = [];
    this.user.scanned_artworks.forEach((artwork) => {
      existingArtworks.push(artwork.id);
    });

    let sendArray = existingArtworks.concat(artworkIdArray);
    sendArray = [...new Set([...existingArtworks, ...artworkIdArray])];

    let response = await this.updateRemoteUser({ scanned_artworks: sendArray });
    return response;
  };

  /* removeScannedArtworkFromUser
  Function that removes from users scanned artworks by artwork id
  Accepts:
   - artworkIdArray - array of integer id's of artwork that exist
  Returns: api request reponse
  */
  removeScannedArtworkFromUser = async (artworkIdArray) => {
    //await this.syncRemoteToLocalUser()

    let existingArtworks = [];
    this.user.scanned_artworks.forEach((artwork) => {
      existingArtworks.push(artwork.id);
    });

    for (let i = 0; i < artworkIdArray.length; i++) {
      let j = 0;
      while (j < existingArtworks.length) {
        if (existingArtworks[j] === artworkIdArray[i]) {
          existingArtworks.splice(j, 1);
        } else {
          ++j;
        }
      }
    }

    let response = await this.updateRemoteUser({
      scanned_artworks: existingArtworks,
    });
    return response;
  };

  /* addLikedArtworkToUser
  Function that adds to users liked artworks by artwork id
  Accepts:
   - artworkIdArray - array of integer id's of artwork that exist
  Returns: api request reponse
  */
  addLikedArtworkToUser = async (artworkIdArray) => {
    try {
      let response = await this.axiosRequestAddRelationEntryToUser(
        "liked_artworks",
        artworkIdArray
      );
    } catch (error) {
      console.log(error);
      return { status: 400 };
    }
  };

  /* addDislikedArtworkToUser
Function that adds to users disliked artworks by artwork id
Accepts:
 - artworkIdArray - array of integer id's of artwork that exist
Returns: api request reponse
*/
  addDislikedArtworkToUser = async (artworkIdArray) => {
    let response = await this.axiosRequestAddRelationEntryToUser(
      "disliked_artworks",
      artworkIdArray
    );
    return response;
  };

  /* addSolvedArtworkToUser
Function that adds to users solved artworks by artwork id
Accepts:
 - artworkIdArray - array of integer id's of artwork that exist
Returns: api request reponse
*/
  addSolvedArtworkToUser = async (artworkIdArray) => {
    let response = await this.axiosRequestAddRelationEntryToUser(
      "solved_artworks",
      artworkIdArray
    );
    return response;
  };

  /* removeScannedArtworkFromUser
Function that removes from users scanned artworks by artwork id
Accepts:
 - artworkIdArray - array of integer id's of artwork that exist
Returns: api request reponse
*/
  removeScannedArtworkFromUser = async (artworkIdArray) => {
    let response = await this.axiosRequestRemoveRelationToUser(
      "scanned_artworks",
      artworkIdArray
    );
    return response;
  };

  /* removeLikedArtworkFromUser
Function that removes from users liked artworks by artwork id
Accepts:
 - artworkIdArray - array of integer id's of artwork that exist
Returns: api request reponse
*/
  removeLikedArtworkFromUser = async (artworkIdArray) => {
    let response = await this.axiosRequestRemoveRelationToUser(
      "liked_artworks",
      artworkIdArray
    );
    return response;
  };

  /* removeDislikedArtworkFromUser
Function that removes from users disliked artworks by artwork id
Accepts:
 - artworkIdArray - array of integer id's of artwork that exist
Returns: api request reponse
*/
  removeDislikedArtworkFromUser = async (artworkIdArray) => {
    let response = await this.axiosRequestRemoveRelationToUser(
      "disliked_artworks",
      artworkIdArray
    );
    return response;
  };

  /* removeSolvedArtworkFromUser
Function that removes from users solved artworks by artwork id
Accepts:
 - artworkIdArray - array of integer id's of artwork that exist
Returns: api request reponse
*/
  removeSolvedArtworkFromUser = async (artworkIdArray) => {
    let response = await this.axiosRequestRemoveRelationToUser(
      "solved_artworks",
      artworkIdArray
    );
    return response;
  };

  /*addPointsToUser
Function adds given number of points to the user total points
Accepts:
 - numPoints - integer value of points to add to the total points
Returns: api request reponse
*/
  addPointsToUser = async (numPoints) => {
    //await this.syncRemoteToLocalUser()
    let newPoints = numPoints + this.user.total_points;
    let response = await this.updatePointsForUser(newPoints);
    return response;
  };

  /*removePointsFromUser
Function remove given number of points from the user total points
Accepts:
 - numPoints - integer value of points to remove from the total points
Returns: api request reponse
*/
  removePointsFromUser = async (numPoints) => {
    //await this.syncRemoteToLocalUser()
    let newPoints = this.user.total_points - numPoints;
    let response = await this.updatePointsForUser(newPoints);
    return response;
  };

  /*updatePointsForUser
Function updates users total points to a given number
Accepts:
 - numPoints - integer value of points to update the total points
Returns: api request reponse
*/
  updatePointsForUser = async (numPoints) => {
    //await this.syncRemoteToLocalUser();
    let response = await this.updateRemoteUser({ total_points: numPoints });
    console.log(response);
    if (response.status === 200) {
      this.user.total_points = response.data.total_points;
    }
    return response;
  };

  /* axiosRequestAddRelationEntryToUser
Function that adds to users specified relation field new relations of the relation type specified by entry ids
Accepts:
  - relationFieldName - text value - field name for relationship to User
  - relatedEntriesIdArray - array of integer id's of related entries that exist
Returns: api request reponse
*/
  axiosRequestAddRelationEntryToUser = async (
    relationFieldName,
    relatedEntriesIdArray
  ) => {
    await this.syncRemoteToLocalUser();
    console.log(this.user);
    let existingEntries = [];
    this.user[relationFieldName].forEach((entry) => {
      existingEntries.push(entry.id);
    });

    let sendArray = existingEntries.concat(relatedEntriesIdArray);
    sendArray = [...new Set([...existingEntries, ...relatedEntriesIdArray])];

    let response = await this.updateRemoteUser({
      [relationFieldName]: sendArray,
    });
    if (response.status === 200) {
      this.user[relationFieldName] = response.data[relationFieldName];
    }
    return response;
  };

  /* axiosRequestRemoveRelationToUser
Function that removes from users specified relation field existing relations of the relation type specified by entry ids
Accepts:
 - relationFieldName - text value - field name for relationship to User
 - relatedEntriesIdArray - array of integer id's of related entries that exist
Returns: api request reponse
*/
  axiosRequestRemoveRelationToUser = async (
    relationFieldName,
    relatedEntriesIdArray
  ) => {
    await this.syncRemoteToLocalUser();

    let existingEntries = [];
    this.user[relationFieldName].forEach((entry) => {
      existingEntries.push(entry.id);
    });

    for (let i = 0; i < relatedEntriesIdArray.length; i++) {
      let j = 0;
      while (j < existingEntries.length) {
        if (existingEntries[j] === relatedEntriesIdArray[i]) {
          existingEntries.splice(j, 1);
        } else {
          ++j;
        }
      }
    }

    let response = await this.updateRemoteUser({
      [relationFieldName]: existingEntries,
    });
    console.log(
      "axiosRequestRemoveRelationToUser " + relationFieldName,
      response
    );
    console.log("axiosRequestRemoveRelationToUser", response.status);
    console.log(relationFieldName, response.data[relationFieldName]);
    if (response.status === 200) {
      this.user[relationFieldName] = response.data[relationFieldName];
      console.log("this.user", this.user);
    }
    return response;
  };

  /* axiosPostToStrapi
  Function makes a generic post call to strapi API using provided information
  Accepts:
    - url - API route for the post call
    - data - data to be sent with the post call
    - headerConfig - header data to be sent with the post call
  Returns: full post response from strapi api if successfull or -1 if failed
  */
  axiosPostToStrapi = async (url, data, headerConfig) => {
    var returnedData = { status: -1 };
    try {
      returnedData = await axios.post(url, data, headerConfig);
    } catch (error) {
      console.log(error);
      console.log(url);
    }

    if (returnedData.status === 200) {
      return returnedData;
    } else {
      console.log("Error in axiosPostToStrapi");
      return returnedData; // returns {status: -1} for failed data
    }
  };

  /* axiosPutToStrapi
Function makes a generic put call to strapi API using provided information
Accepts:
  - url - API route for the post call
  - data - data to be sent with the post call
  - headerConfig - header data to be sent with the post call
Returns: full put response from strapi api if successfull or -1 if failed
*/
  axiosPutToStrapi = async (url, data, headerConfig) => {
    var returnedData = { status: -1 };
    try {
      returnedData = await axios.put(url, data, headerConfig);
    } catch (error) {
      console.log(error);
      console.log(url);
      console.log(headerConfig);
    }

    if (returnedData.status === 200) {
      return returnedData;
    } else {
      console.log("Error in axiosPostToStrapi");
      console.log(returnedData);
      return -1;
    }
  };

  /* axiosDeleteFromStrapi
Function makes a generic post delete to strapi API
Accepts:
  - url - API route for the delete call
  - headerConfig - header data to be sent with the post call, contains auth token
Returns: full post response from strapi api if successfull or -1 if failed
*/
  axiosDeleteFromStrapi = async (url, headerConfig) => {
    var returnedData = { status: -1 };
    try {
      returnedData = await axios.delete(url, headerConfig);
    } catch (error) {
      console.log(error);
      console.log(url);
      console.log(returnedData);
      // console.log(headerConfig)
    }

    if (returnedData.status === 200) {
      return returnedData;
    } else {
      console.log("Error in axiosDeleteFromStrapi");
      console.log(returnedData);
      return -1;
    }
  };

  /*axiosUploadToStrapi
Function makes a generic post upload strapi API
Accepts:
  - token - Authorization token
  - files - files to upload
  - entryId -  the id of the entry to associate to the file being upload
  - entryType -  the collection type of the entry being associated to the file (examples of collection types: artwork, campus)
  - entryFieldName -  the field name from the collection type (examples for artwork would be primary_image, other_images)
Returns: full post response from strapi api if successfull or -1 if failed
*/

  "users-permissions";
  axiosUploadToStrapi = async (
    token, // this.authToken
    file, // file
    entryId, // response.user.id
    entryType, // 'user',
    entryFieldName, // 'profile_picture'
    source // 'users-permissions
  ) => {
    const sendConfig = {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    formData.append("files", file);
    formData.append("ref", entryType); // optional, you need it if you want to link the image to an entry
    formData.append("refId", entryId); // optional, you need it if you want to link the image to an entry
    formData.append("field", entryFieldName); // optional, you need it if you want to link the image to an entry
    formData.append("source", source);
    let returnedData = {};

    try {
      returnedData = await axios.post(
        `${this.strapiUrl}/upload`,
        formData,
        sendConfig
      );
    } catch (error) {
      console.log(error);
      // console.log(url);
      // console.log(headerConfig);
    }

    if (returnedData.status === 200) {
      return returnedData;
    } else {
      console.log("Error in axiosUploadToStrapi");
      console.log(returnedData);
      return -1;
    }
  };
} //============== End of Class

/* ============== Older database requests */

export const axoisPostToStrapi = async (url, data, headerConfig) => {
  var returnedData = { status: -1 };
  try {
    returnedData = await axios.post(url, data, headerConfig);
  } catch (error) {
    console.log(error);
    console.log(url);
    console.log(headerConfig);
  }

  if (returnedData.status === 200) {
    return returnedData;
  } else {
    console.log("Error in axoisPostToStrapi");
    console.log(returnedData);
    return { status: -1 };
  }
};
