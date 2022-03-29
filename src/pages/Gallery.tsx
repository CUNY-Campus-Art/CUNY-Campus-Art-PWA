/**
 * Gallery.tsx
 *  As of now, the Gallery component can pull
 * information from the database. It currently retrieves a list
 * of past artworks the user has scanned locally.
 */

import React, { useCallback, useContext, useEffect, useState} from "react";
import { connect, ConnectedProps } from 'react-redux'
import { IonItem, IonList, IonText, NavContext } from '@ionic/react';
import "./Gallery.css";
import {
  changeCurrentArtDisplay,
  fetchPastArtworks,
  ArtDisplay,
  removeScannedArtDisplay,
  clickLikeButton,
  clickDislikeButton
} from '../store/artdisplay'

import { heart, heartOutline, heartDislike, heartDislikeOutline } from "ionicons/icons";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonIcon,
  IonButton,
} from "@ionic/react";
import { trash } from 'ionicons/icons';


/* use the props currentArtDisplay and allArtDisplays to access state */
const mapState = (state: any) => ({
  currentArtDisplay: state.artDisplay.currentArtDisplay,
  pastArtDisplays: state.artDisplay.pastArtDisplays,
  allArtDisplays: state.artDisplay.allArtDisplays,
  currentUser: state.user.user

})

const mapDispatch = (dispatch: any) => ({
  changeCurrentArtDisplay: (artwork: ArtDisplay) => dispatch(changeCurrentArtDisplay(artwork)),
  getPastArtworks: (currentUser: any) => dispatch(fetchPastArtworks(currentUser)),
  removeArtwork: (user: any, artworkId: any) => dispatch(removeScannedArtDisplay(user, artworkId)),
  clickLikeButton: (user: any, artworkId: any, fromGallery: boolean) => dispatch(clickLikeButton(user, artworkId, fromGallery)),
  clickDislikeButton: (user: any, artworkId: any) => dispatch(clickDislikeButton(user, artworkId)),
})

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}

const Gallery = (props: Props) => {


  console.log(window.localStorage);
  const user = props.currentUser
  const pastArtDisplays = props.pastArtDisplays;

  // useEffect(() => { if (user) props.getPastArtworks(props.currentUser); }, []);


  // To redirect to Information with forward animation
  const { navigate } = useContext(NavContext)
  const redirect = useCallback(
    () => navigate('/Information', 'forward'),
    [navigate]
  )

  //When user clicks artwork, updates currentArtDislay, and redirects user to Information tab
  const selectAnArtwork = (index: number) => {
    let currentArtDisplayItem: ArtDisplay = pastArtDisplays[index]

    props.changeCurrentArtDisplay(currentArtDisplayItem)

    redirect()
  }

  // const [likeartwork, setlikeartwork] = useState(false);

  // const handleLikes = () => {
  //   likeartwork ? setlikeartwork(false) : setlikeartwork(true);
  // }

 //a copy of pastArtDisplays in state to manipulate likes for UI purposes
 const [likes, setLikes] = useState(pastArtDisplays);

 const addLike = async (user: any, artDisplay: any, flag: boolean, index: number) => {

  //Backend calls stay the same
  //make a deep copy at the moment of passing to function, so that it doesn't reference the artDisplay and its liked/disliked properties
  const myArtWork = { ...artDisplay };
  props.clickLikeButton(user, myArtWork, flag);


  //UI changes, shows like updates immediately
  let myLikes = likes;
  if (myLikes[index].liked == false) {
    myLikes[index].likes = myLikes[index].likes + 1;
    //change to heart icon
    myLikes[index].liked = true;
  }
  else if (myLikes[index].liked == true) {
    myLikes[index].likes = myLikes[index].likes - 1;
    //change to outline icon
    myLikes[index].liked = false;
  }
  setLikes([...myLikes]);

}

const addDislike = async (user: any, artDisplay: any, index: number) => {

  const myArtWork = { ...artDisplay };
  props.clickDislikeButton(user, myArtWork);

  //UI changes, shows like updates immediately
  let myLikes = likes;
  myLikes[index].disliked = !myLikes[index].disliked;
  setLikes([...myLikes]);


}


//gets called when pastArtDisplays are updated
//acts as a check, if something went wrong when adding likes in the backend, this will reset the UI to display according to correct state as in backend
useEffect(() => {
  console.log("GALLERY, PAST UPDATED")
  setLikes([...pastArtDisplays])
}, [pastArtDisplays])

useEffect(() => {
  console.log("CURRENT UPDATED")
  setLikes([...pastArtDisplays])
}, [props.currentArtDisplay])


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar></IonToolbar>
        <IonToolbar>
          <IonTitle>Your Gallery </IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonTitle size="small">All Artwork You Have Scanned</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>


        <IonList>
          {likes.map((artDisplay: any, index: any) => (
            <IonItem key={index}>

              <IonGrid>
                <IonRow>
                  <IonCol className="center-text" size="5">
                    <IonImg className='artwork-tile img-size'
                      onClick={() => selectAnArtwork(index)}
                      src={artDisplay.primary_image ? artDisplay.primary_image.url : ''}
                      alt={artDisplay.primary_image ? artDisplay.primary_image.alternative : ''} />
                    {artDisplay.id !== 'default' && <IonText color="medium">{artDisplay.likes} Likes</IonText>}
                  </IonCol>

                  <IonCol >
                    <IonRow onClick={() => selectAnArtwork(index)}><IonText className="center-text"><h3>{artDisplay.title}</h3></IonText></IonRow>
                    <IonRow onClick={() => selectAnArtwork(index)}>  <IonText className="center-text">{artDisplay.artist}</IonText> </IonRow>

                    <IonRow className="align-right-row">

                      {user && <IonButton
                        fill="outline"
                        size="small"
                        color="danger"
                        onClick={() => addLike(user, artDisplay, true, index)}
                      // onClick={handleLikes}
                      >
                        {artDisplay.liked ? (<IonIcon className='likeHeart' icon={heart}></IonIcon>) : (<IonIcon className='likeHeart' icon={heartOutline}></IonIcon>)}

                      </IonButton>}

                      {/* Thumbs Down Icon */}
                      {user && <IonButton
                        fill="outline"
                        size="small"
                        color="primary"

                        onClick={() => addDislike(user, artDisplay, index)}
                      >
                        {artDisplay.disliked ? <IonIcon color="primary" icon={heartDislike}></IonIcon> : <IonIcon color="primary" icon={heartDislikeOutline}></IonIcon>}
                      </IonButton>}


                      {/* Trash Icon */}
                      {<IonButton
                        fill="outline"
                        size="small"
                        color="medium"
                        onClick={() => props.removeArtwork(props.currentUser, artDisplay)}
                      >
                        <IonIcon icon={trash}></IonIcon>
                      </IonButton>}
                    </IonRow>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default connector(Gallery)
