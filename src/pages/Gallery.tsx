/**
 * Gallery.tsx - As of now, the Gallery component can pull
 * information from the database. It currently retrieves a list
 * of past artworks the user has scanned locally.
 */

import React, { useEffect, useCallback, useContext } from "react";
import { connect, ConnectedProps } from 'react-redux'
import { NavContext } from '@ionic/react';
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
  IonCardSubtitle
} from "@ionic/react";
import "./Gallery.css";


import { RootState } from '../store'
import { changeCurrentArtDisplay, fetchAllArtworks, fetchPastArtworks, ArtDisplay } from '../store/artdisplay'

/* use the props currentArtDisplay and allArtDisplays to access state */
const mapState = (state: RootState) => ({
  currentArtDisplay: state.artDisplay.currentArtDisplay,
  pastArtDisplays: state.artDisplay.pastArtDisplays,
  allArtDisplays: state.artDisplay.allArtDisplays
})

const mapDispatch = (dispatch: any) => ({
  changeCurrentArtDisplay: (artwork: ArtDisplay) => dispatch(changeCurrentArtDisplay(artwork)),
  getAllArtworks: () => dispatch(fetchAllArtworks()),
  getPastArtworks: () => dispatch(fetchPastArtworks()),
})

const connector = connect(mapState, mapDispatch)


type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}

const Gallery = (props: Props) => {
  useEffect(() => { props.getAllArtworks(); }, []);
  const allArtDisplays = props.allArtDisplays
  const pastArtDisplays = props.pastArtDisplays
  const changeCurrentArtDisplay = props.changeCurrentArtDisplay

  // To redirect to Information with forward animation
  const { navigate } = useContext(NavContext);
  const redirect = useCallback(
    () => navigate('/Information', 'forward'),
    [navigate]
  );

  //When user to clicks artwork, updates currentArtDislay, and redirects user to Information tab
  const selectAnArtwork = (index: number) => {

    let currentArtDisplayItem: ArtDisplay = pastArtDisplays[index]
    console.log(typeof currentArtDisplayItem, "check link")
    props.changeCurrentArtDisplay(currentArtDisplayItem)
    redirect()
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
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
            {pastArtDisplays.map((artDisplay, index) => (
              <IonCol size="4" key={index}>
                <IonCard>
                  <IonImg
                    onClick={() => selectAnArtwork(index)}
                    src={artDisplay.primary_image ? artDisplay.primary_image.url : ''}
                    alt={artDisplay.primary_image ? artDisplay.primary_image.alternative : ''} />
                  <IonCardTitle>{artDisplay.title}</IonCardTitle>
                  <IonCardSubtitle>{artDisplay.artist}</IonCardSubtitle>
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

        {/* <IonTitle size="large">Take a Picture</IonTitle> */}

      </IonContent>
    </IonPage>
  );
};

export default connector(Gallery)
