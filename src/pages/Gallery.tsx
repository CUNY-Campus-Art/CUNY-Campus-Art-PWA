/**
 * Gallery.tsx
 *  As of now, the Gallery component can pull
 * information from the database. It currently retrieves a list
 * of past artworks the user has scanned locally.
 */

import React, { useEffect, useCallback, useContext } from "react";
import { connect, ConnectedProps } from 'react-redux'
import { NavContext } from '@ionic/react';
import "./Gallery.css";
import { RootState } from '../store'
import { changeCurrentArtDisplay, fetchAllArtworks, fetchPastArtworks, ArtDisplay, removeScannedArtDisplay } from '../store/artdisplay'
import { analytics } from "ionicons/icons";

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
  IonCard,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
  IonButton,
  IonText
} from "@ionic/react";
import { trash } from 'ionicons/icons';


/* use the props currentArtDisplay and allArtDisplays to access state */
const mapState = (state: RootState) => ({
  currentArtDisplay: state.artDisplay.currentArtDisplay,
  pastArtDisplays: state.artDisplay.pastArtDisplays,
  allArtDisplays: state.artDisplay.allArtDisplays,
  currentUser: state.user.user
})

const mapDispatch = (dispatch: any) => ({
  changeCurrentArtDisplay: (artwork: ArtDisplay) => dispatch(changeCurrentArtDisplay(artwork)),
  getPastArtworks: (currentUser: any) => dispatch(fetchPastArtworks(currentUser)),
  removeArtwork: (user:any, artworkId: any) => dispatch(removeScannedArtDisplay(user, artworkId))
})

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}

const Gallery = (props: Props) => {

  useEffect(() => { if (props.currentUser) props.getPastArtworks(props.currentUser); }, []);

  const pastArtDisplays = props.pastArtDisplays
  const changeCurrentArtDisplay = props.changeCurrentArtDisplay

  // To redirect to Information with forward animation
  const { navigate } = useContext(NavContext);
  const redirect = useCallback(
    () => navigate('/Information', 'forward'),
    [navigate]
  );

  //When user clicks artwork, updates currentArtDislay, and redirects user to Information tab
  const selectAnArtwork = (index: number) => {
    let currentArtDisplayItem: ArtDisplay = pastArtDisplays[index]
    console.log(typeof currentArtDisplayItem, "check link")
    props.changeCurrentArtDisplay(currentArtDisplayItem)
    //props.removeSelectedArtWork(user, selectedArtWork)
    redirect()
  }



  return (
    <IonPage>
      <IonHeader>
      <IonToolbar></IonToolbar>
        <IonToolbar>
          <IonTitle>Your Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>


        {/* <IonGrid>
          <IonRow>
            {photos.map((photo,index) =>(
              <IonCol size="3" key={index}>
                <IonImg src={photo.webviewPath} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid> */}

        <IonGrid>
          <IonRow>
            {pastArtDisplays.map((artDisplay: any, index: any) => (
              <IonCol size="4" key={index}>
                              {console.log(artDisplay)}

                <IonCard>
                  <IonImg className='artwork-tile'
                    onClick={() => selectAnArtwork(index)}
                    src={artDisplay.primary_image ? artDisplay.primary_image.url : ''}
                    alt={artDisplay.primary_image ? artDisplay.primary_image.alternative : ''} />
                  <IonCardTitle>{artDisplay.title}</IonCardTitle>
                  <IonCardSubtitle>{artDisplay.artist}</IonCardSubtitle>

                 <IonButton class="item-end" fill="outline" size="small" color="danger" onClick={() =>props.removeArtwork(props.currentUser, artDisplay)}>
                    <IonIcon  icon={trash}></IonIcon>
                  </IonButton>

                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Gallery</IonTitle>
          </IonToolbar>
        </IonHeader>

      </IonContent>
    </IonPage>
  );
};

export default connector(Gallery)
