import axios from 'axios'

export class StrapiApiConnection {
  //Either retrieved info will be passed to constructor or values will be set by accessing local storage. retrieved info will take precedence so new user can be logged in

  constructor(authToken, user) {

    // Checks if anything in local storage, relevant for when app initially loads or refreshes
    if (!authToken && !user && !!localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'))
     this.authToken = JSON.parse(localStorage.getItem('jwt'))
      this.unsolved = JSON.parse(localStorage.getItem('unsolved'))
      //this.syncRemoteToLocalUser()
      //updates local user to be up to date with the database
    } else {
      this.authToken = authToken ? authToken : ''
      this.user = user ? user : ''
    }

    this.strapiUrl = 'https://dev-cms.cunycampusart.com' //url to strapi API endpoint

    //this.strapiUrl = "http://localhost:1337"; //url to strapi API endpoint

    // if(this.user) this.syncRemoteToLocalUser()
  }

  /* getAllArtworks
  Function calls to strapi api to get all artworks in db
  Accepts:
   - none
  Returns:
  - JSON data for all artworks
  */
  getAllArtworks = async () => {
    const { data } = await axios.get(this.strapiUrl + '/artworks')
    console.log('getAllArtworks', data)
    return data
  }

  /* getArtworkById
  Function calls to strapi api get entry for one artwork
  Accepts:
   - id - id of artwork entry
  Returns:
   - JSON data for the entry
  */
  getArtworkById = async (id) => {
    const { data } = await axios.get(this.strapiUrl + '/artworks/' + id)
    console.log('getArtworkById', data)
    return data
  }

  /* getAllCampuses
  Function calls to strapi api to get all campuses in db
  Accepts:
   - none
  Returns:
   - JSON data for all campuses
  */
  getAllCampuses = async () => {
    const { data } = await axios.get(this.strapiUrl + '/campuses')
    console.log('getAllCampuses', data)
    return data
  }

  /* getCampusById
  Function calls to strapi api get entry for one campus
  Accepts:
   - id - id of campus entry
  Returns:
   - JSON data for the entry
  */
  getCampusById = async (id) => {
    const { data } = await axios.get(this.strapiUrl + '/campuses/' + id)
    console.log('getCampusById', data)
    return data
  }

  /* getArtworksInCampusByName
  Function calls to strapi api get all artwork entries associated to a campus using campus name
  Accepts:
   - campusName - name of campus (must be spelled correctly, capitalization doesnt matter)
  Returns:
   - JSON data for all artworks associated to the campus
  */
  getArtworksInCampusByName = async (campusName) => {
    const { data } = await axios.get(
      this.strapiUrl + '/artworks?campus.campus_name_contains=' + campusName
    )
    console.log('getArtworksInCampusByName', data)
    return data
  }

  /* getArtworksInCampusById
  Function calls to strapi api get all artwork entries associated to a campus using campus id
  Accepts:
   - campusId - id of campus entry
  Returns:
   - JSON data for all artworks associated to the campus
  */
  getArtworksInCampusById = async (campusId) => {
    const { data } = await axios.get(
      this.strapiUrl + '/artworks?campus.id=' + campusId
    )
    console.log('getArtworksInCampusById', data)
    return data
  }


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
  let cluedArtworks = [];
  artworks.forEach((artwork, index)=>{
    if(artwork.clue!=null){
      console.log(index)
      cluedArtworks.push(artwork);
    }
  });
  return artworks;
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
        Authorization: 'Bearer ' + this.authToken,
        'Content-Type': 'application/json',
      },
    }
    const sendData = JSON.stringify(dataIn)
    const returnData = await this.axiosPostToStrapi(
      this.strapiUrl + '/artworks',
      sendData,
      sendConfig
    )
    console.log('createArtwork returnData', returnData)
    this.createAndUploadQRImageForArtwork(returnData.data.id)
    return returnData
  }

  /*addPointsToUser
  Function adds given number of points to the user total points
  Accepts:
   - numPoints - integer value of points to add to the total points
  Returns: api request reponse
  */
 addPointsToUser = async (numPoints) => {
  await this.syncRemoteToLocalUser();
  let newPoints = numPoints + this.user.total_points;
  let response = await this.updatePointsForUser(newPoints);
  return response;
}

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
}

/*updatePointsForUser
Function updates users total points to a given number
Accepts:
 - numPoints - integer value of points to update the total points
Returns: api request reponse
*/
updatePointsForUser = async (numPoints) => {
  //await this.syncRemoteToLocalUser();
  let response = await this.updateRemoteUser({ "total_points": numPoints });
  console.log(response);
  if (response.status === 200) {
    this.user.total_points = response.data.total_points;
    console.log('this.user', this.user);
  }
  return response;
}


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
        Authorization: 'Bearer ' + this.authToken,
        'Content-Type': 'application/json',
      },
    }
    const sendData = JSON.stringify(dataIn)
    const returnData = await this.axiosPutToStrapi(
      this.strapiUrl + '/artworks/' + id,
      sendData,
      sendConfig
    )
    return returnData
  }

  /*increaseLikesForArtworkById
  Function to increase a artworks likes count by 1
  Accepts:
   - id - artwork id
  Returns: api request reponse
  */
 increaseLikesForArtworkById = async (id) => {
  this.updateLikeForArtworkById(id, 1);
}

/*decreaseLikesForArtworkById
Function to decrease a artworks likes count by 1
Accepts:
 - id - artwork id
Returns: api request reponse
*/
decreaseLikesForArtworkById = async (id) => {
  this.updateLikeForArtworkById(id, 2);
}

/*updateLikeForArtworkById
Function to update a artworks likes count by 1
Accepts:
 - id - artwork id
 - typeOfUpdate - integer - 1 to increase, 2 to decrease
Returns: api request reponse
*/
updateLikeForArtworkById = async (id, typeOfUpdate) => {
  const sendConfig = {
    headers: {
      'Authorization': "Bearer " + this.authToken,
      'Content-Type': 'application/json'
    }
  };

  const sendData = JSON.stringify({id: id, type: typeOfUpdate});
  let response = await this.axiosPutToStrapi(this.strapiUrl + "/user/likeartwork", sendData, sendConfig);
  console.log(response);
  return response;
}


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
        Authorization: 'Bearer ' + this.authToken,
      },
    }
    const returnData = await this.axiosDeleteFromStrapi(
      this.strapiUrl + '/artworks/' + id,
      sendConfig
    )
    return returnData
  }

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
        Authorization: 'Bearer ' + this.authToken,
        'Content-Type': 'application/json',
      },
    }
    const sendData = JSON.stringify(dataIn)
    const returnData = await this.axiosPostToStrapi(
      this.strapiUrl + '/campuses',
      sendData,
      sendConfig
    )
    return returnData
  }

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
        Authorization: 'Bearer ' + this.authToken,
        'Content-Type': 'application/json',
      },
    }
    const sendData = JSON.stringify(dataIn)
    const returnData = await this.axiosPutToStrapi(
      this.strapiUrl + '/campuses/' + id,
      sendData,
      sendConfig
    )
    return returnData
  }

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
        Authorization: 'Bearer ' + this.authToken,
      },
    }
    const returnData = await this.axiosDeleteFromStrapi(
      this.strapiUrl + '/campuses/' + id,
      sendConfig
    )
    return returnData
  }

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
    firstName = '',
    lastName = '',
    file
  ) => {
    let error
    let response
    await axios
      .post(this.strapiUrl + '/auth/local/register', {
        username: username,
        email: email,
        password: pw,
        first_name: firstName,
        last_name: lastName,
      })
      .then((res) => {
        response = res.data
        if (response) {
          this.authToken = response.jwt
          this.user = response.user
          if (file) {
             this.axiosUploadToStrapi(
              file,
              response.user.id,
              'user',
              'profile_picture',
              'users-permissions'
            )
          }
          return { success: true, response: response, error: {} }
        } else {
          return { success: false, response: {}, error: error }
        }
      })
      .catch((e) => {
        if (
          e.response.data.message[0].messages.length == 1 &&
          e.response.data.message.length == 1
        ) {
          error = e.response.data.message[0].messages[0]
        } else {
          error = e.response.data.message
        }
      })


  }

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
        'Content-Type': 'application/json',
      },
    }
    const sendData = JSON.stringify({
      identifier: id,
      password: pw,
    })

    const returnData = await this.axiosPostToStrapi(
      this.strapiUrl + '/auth/local',
      sendData,
      sendConfig
    )
    if (returnData.data) {
      this.user = returnData.data.user
      this.authToken = returnData.data.jwt
    }

    return returnData

  }

  /* loginAndGetToken
  Function calls to strapi api to login a user and get authentication token that will be used for
  other calls to create, update, delete entries in database.
  Accepts:
   - id - user id (email, username)
   - pw - password for the respective account
  Returns: authentication token if call is completed succesfully or -1 if there was a error.
  */
  loginAndGetToken = async (id, pw) => {
    let returnData = await this.loginUser(id, pw)

    if (returnData.status === 200) {
      return returnData.data.jwt
    } else {
      return -1
    }
  }

  /* loginAndGetUser
  Function calls to strapi api to login a user and get user object
  Accepts:
   - id - user id (email, username)
   - pw - password for the respective account
  Returns:user object
  */
  loginAndGetUser = async (id, pw) => {
    let returnData = await this.loginUser(id, pw)

    if (returnData.status === 200) {
      return returnData.data.user
    } else {
      return -1
    }
  }

  /* loginAndGetUser
  Function to get user object
  Returns:saved user object
  */
  getUser = () => {
    return this.user
  }

  /* getToken
  Function to get authentication token
  Returns:saved authentication token
  */
  getToken = () => {
    return this.authToken
  }


  /* syncRemoteToLocalUser
  Function to get user profile data from api and update local user object;
  Returns:user object from api
  */
  syncRemoteToLocalUser = async () => {
    const sendConfig = {
      headers: {
        Authorization: 'Bearer ' + this.authToken,
      },
    }

    let returnData = await axios.get(
      this.strapiUrl + '/users/profile',
      sendConfig
    )


    this.user = returnData.data
    localStorage.setItem('user', JSON.stringify(this.user)); // save specific fields from user
    return returnData
  }

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
        Authorization: 'Bearer ' + this.authToken,
        'Content-Type': 'application/json',
      },
    }

    const sendData = JSON.stringify(dataIn)
    let response = await this.axiosPutToStrapi(
      this.strapiUrl + '/users/profile',
      dataIn,
      sendConfig
    )
    console.log(response)
    return response
  }

  /* addScannedArtworkToUser
  Function that adds to users scanned artworks by artwork id
  Accepts:
   - artworkIdArray - array of integer id's of artwork that exist
  Returns: api request reponse
  */
  addScannedArtworkToUser = async (artworkIdArray) => {
    await this.syncRemoteToLocalUser()

    let existingArtworks = []
    this.user.scanned_artworks.forEach((artwork) => {
      existingArtworks.push(artwork.id)
    })

    let sendArray = existingArtworks.concat(artworkIdArray)
    sendArray = [...new Set([...existingArtworks, ...artworkIdArray])]

    let response = await this.updateRemoteUser({ scanned_artworks: sendArray })
    return response
  }

  /* removeScannedArtworkFromUser
  Function that removes from users scanned artworks by artwork id
  Accepts:
   - artworkIdArray - array of integer id's of artwork that exist
  Returns: api request reponse
  */
  removeScannedArtworkFromUser = async (artworkIdArray) => {
    await this.syncRemoteToLocalUser()

    let existingArtworks = []
    this.user.scanned_artworks.forEach((artwork) => {
      existingArtworks.push(artwork.id)
    })

    for (let i = 0; i < artworkIdArray.length; i++) {
      let j = 0
      while (j < existingArtworks.length) {
        if (existingArtworks[j] === artworkIdArray[i]) {
          existingArtworks.splice(j, 1)
        } else {
          ++j
        }
      }
    }

    let response = await this.updateRemoteUser({
      scanned_artworks: existingArtworks,
    })
    return response
  }

  /* addLikedArtworkToUser
  Function that adds to users liked artworks by artwork id
  Accepts:
   - artworkIdArray - array of integer id's of artwork that exist
  Returns: api request reponse
  */
 addLikedArtworkToUser = async (artworkIdArray) => {
  let response = await this.axiosRequestAddRelationEntryToUser('liked_artworks', artworkIdArray);
  return response;
}

/* addDislikedArtworkToUser
Function that adds to users disliked artworks by artwork id
Accepts:
 - artworkIdArray - array of integer id's of artwork that exist
Returns: api request reponse
*/
addDislikedArtworkToUser = async (artworkIdArray) => {
  let response = await this.axiosRequestAddRelationEntryToUser('disliked_artworks', artworkIdArray);
  return response;
}

/* addSolvedArtworkToUser
Function that adds to users solved artworks by artwork id
Accepts:
 - artworkIdArray - array of integer id's of artwork that exist
Returns: api request reponse
*/
addSolvedArtworkToUser = async (artworkIdArray) => {
  let response = await this.axiosRequestAddRelationEntryToUser('solved_artworks', artworkIdArray);
  return response;
}

/* removeScannedArtworkFromUser
Function that removes from users scanned artworks by artwork id
Accepts:
 - artworkIdArray - array of integer id's of artwork that exist
Returns: api request reponse
*/
removeScannedArtworkFromUser = async (artworkIdArray) => {
  let response = await this.axiosRequestRemoveRelationToUser('scanned_artworks', artworkIdArray);
  return response;
}

/* removeLikedArtworkFromUser
Function that removes from users liked artworks by artwork id
Accepts:
 - artworkIdArray - array of integer id's of artwork that exist
Returns: api request reponse
*/
removeLikedArtworkFromUser = async (artworkIdArray) => {
  let response = await this.axiosRequestRemoveRelationToUser('liked_artworks', artworkIdArray);
  return response;
}

/* removeDislikedArtworkFromUser
Function that removes from users disliked artworks by artwork id
Accepts:
 - artworkIdArray - array of integer id's of artwork that exist
Returns: api request reponse
*/
removeDislikedArtworkFromUser = async (artworkIdArray) => {
  let response = await this.axiosRequestRemoveRelationToUser('disliked_artworks', artworkIdArray);
  return response;
}

/* removeSolvedArtworkFromUser
Function that removes from users solved artworks by artwork id
Accepts:
 - artworkIdArray - array of integer id's of artwork that exist
Returns: api request reponse
*/
removeSolvedArtworkFromUser = async (artworkIdArray) => {
  let response = await this.axiosRequestRemoveRelationToUser('solved_artworks', artworkIdArray);
  return response;
}

/*addPointsToUser
Function adds given number of points to the user total points
Accepts:
 - numPoints - integer value of points to add to the total points
Returns: api request reponse
*/
addPointsToUser = async (numPoints) => {
  await this.syncRemoteToLocalUser();
  let newPoints = numPoints + this.user.total_points;
  let response = await this.updatePointsForUser(newPoints);
  return response;
}

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
}

/*updatePointsForUser
Function updates users total points to a given number
Accepts:
 - numPoints - integer value of points to update the total points
Returns: api request reponse
*/
updatePointsForUser = async (numPoints) => {
  //await this.syncRemoteToLocalUser();
  let response = await this.updateRemoteUser({ "total_points": numPoints });
  console.log(response);
  if (response.status === 200) {
    this.user.total_points = response.data.total_points;
    console.log('this.user', this.user);
  }
  return response;
}


/* axiosRequestAddRelationEntryToUser
Function that adds to users specified relation field new relations of the relation type specified by entry ids
Accepts:
  - relationFeildName - text value - field name for relationship to User
  - relatedEntriesIdArray - array of integer id's of related entries that exist
Returns: api request reponse
*/
axiosRequestAddRelationEntryToUser = async (relationFeildName, relatedEntriesIdArray) => {
  await this.syncRemoteToLocalUser();

  let existingEntries = [];
  this.user[relationFeildName].forEach(entry => {
    existingEntries.push(entry.id);
  })

  let sendArray = existingEntries.concat(relatedEntriesIdArray);
  sendArray = [...new Set([...existingEntries, ...relatedEntriesIdArray])]

  let response = await this.updateRemoteUser({ [relationFeildName]: sendArray });
  if (response.status === 200) {
    this.user[relationFeildName] = response.data[relationFeildName];
  }
  return response;
}


/* axiosRequestRemoveRelationToUser
Function that removes from users specified relation field existing relations of the relation type specified by entry ids
Accepts:
 - relationFeildName - text value - field name for relationship to User
 - relatedEntriesIdArray - array of integer id's of related entries that exist
Returns: api request reponse
*/
axiosRequestRemoveRelationToUser = async (relationFeildName, relatedEntriesIdArray) => {
  await this.syncRemoteToLocalUser();

  let existingEntries = [];
  this.user[relationFeildName].forEach(entry => {
    existingEntries.push(entry.id);
  })

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

  let response = await this.updateRemoteUser({ [relationFeildName]: existingEntries });
  console.log("axiosRequestRemoveRelationToUser" + " " + relationFeildName, response);
  console.log("axiosRequestRemoveRelationToUser", response.status);
  console.log(relationFeildName, response.data[relationFeildName]);
  if (response.status === 200) {
    this.user[relationFeildName] = response.data[relationFeildName];
    console.log('this.user', this.user);
  }
  return response;
}

/* axiosPostToStrapi
  Function makes a generic post call to strapi API using provided information
  Accepts:
    - url - API route for the post call
    - data - data to be sent with the post call
    - headerConfig - header data to be sent with the post call
  Returns: full post response from strapi api if successfull or -1 if failed
  */
 axiosPostToStrapi = async (url, data, headerConfig) => {
  var returnedData = { status: -1 }
  try {
    returnedData = await axios.post(url, data, headerConfig)
  } catch (error) {
    console.log(error)
    console.log(url)
   // console.log(data)
    console.log(headerConfig)
  }

  if (returnedData.status === 200) {
    return returnedData
  } else {
    console.log('Error in axiosPostToStrapi')
    console.log(returnedData)
    return returnedData  // returns {status: -1} for failed data
  }
}

/* axiosPutToStrapi
Function makes a generic put call to strapi API using provided information
Accepts:
  - url - API route for the post call
  - data - data to be sent with the post call
  - headerConfig - header data to be sent with the post call
Returns: full put response from strapi api if successfull or -1 if failed
*/
axiosPutToStrapi = async (url, data, headerConfig) => {
  var returnedData = { status: -1 }
  try {
    returnedData = await axios.put(url, data, headerConfig)
  } catch (error) {
    console.log(error)
    console.log(url)
    console.log(data)
    console.log(headerConfig)
  }

  if (returnedData.status === 200) {
    return returnedData
  } else {
    console.log('Error in axiosPostToStrapi')
    console.log(returnedData)
    return -1
  }
}

/* axiosDeleteFromStrapi
Function makes a generic post delete to strapi API
Accepts:
  - url - API route for the delete call
  - headerConfig - header data to be sent with the post call, contains auth token
Returns: full post response from strapi api if successfull or -1 if failed
*/
axiosDeleteFromStrapi = async (url, headerConfig) => {
  var returnedData = { status: -1 }
  try {
    returnedData = await axios.delete(url, headerConfig)
  } catch (error) {
    console.log(error)
    console.log(url)
    console.log(returnedData)
    console.log(headerConfig)
  }

  if (returnedData.status === 200) {
    return returnedData
  } else {
    console.log('Error in axiosDeleteFromStrapi')
    console.log(returnedData)
    return -1
  }
}

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
axiosUploadToStrapi = async (
  token,
  file,
  entryId,
  entryType,
  entryFieldName
) => {
  const sendConfig = {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'multipart/form-data',
    },
  }

  const formData = new FormData()
  formData.append('files', file)
  formData.append('ref', entryType) // optional, you need it if you want to link the image to an entry
  formData.append('refId', entryId) // optional, you need it if you want to link the image to an entry
  formData.append('field', entryFieldName) // optional, you need it if you want to link the image to an entry
  let returnedData = {}

  try {
    returnedData = await axios.post(
      `${this.strapiUrl}/upload`,
      formData,
      sendConfig
    )
  } catch (error) {
    console.log(error)
    // console.log(url);
    // console.log(data);
    // console.log(headerConfig);
  }

  if (returnedData.status === 200) {
    return returnedData
  } else {
    console.log('Error in axiosUploadToStrapi')
    console.log(returnedData)
    return -1
  }
}
} //============== End of Class

/* ============== Older database requests */

export const axoisPostToStrapi = async (url, data, headerConfig) => {
  var returnedData = { status: -1 }
  try {
    returnedData = await axios.post(url, data, headerConfig)
  } catch (error) {
    console.log(error)
    console.log(url)
    console.log(data)
    console.log(headerConfig)
  }

  if (returnedData.status === 200) {
    return returnedData
  } else {
    console.log('Error in axoisPostToStrapi')
    console.log(returnedData)
    return { status: -1 }
  }
}
