import React, {useEffect} from "react";
import { connect, ConnectedProps } from 'react-redux'
import { camera} from "ionicons/icons";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonCard,
  IonCardTitle,
  IonCardSubtitle
} from "@ionic/react";
import "./Gallery.css";
import { usePhotoGallery } from "../hooks/usePhotoGallery";

import {RootState} from '../store'
import { fetchAllArtworks, fetchPastArtworks } from '../store/artdisplay'

/* use the props currentArtDisplay and allArtDisplays to access state */
const mapState = (state: RootState) => ({
  currentArtDisplay: state.artDisplay.currentArtDisplay,
  pastArtDisplays: state.artDisplay.pastArtDisplays,
  allArtDisplays: state.artDisplay.allArtDisplays
})

const mapDispatch = (dispatch: any) => ({
  getAllArtworks: () => dispatch(fetchAllArtworks()),
  getPastArtworks: () => dispatch(fetchPastArtworks ())

})

const connector = connect(mapState, mapDispatch)

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}

const Gallery = (props: Props) => {
  useEffect(() => {props.getAllArtworks();}, []);
  const { photos, takePhoto } = usePhotoGallery();
  const allArtDisplays = props.allArtDisplays
  const pastArtDisplays = props.pastArtDisplays
  console.log(pastArtDisplays, "gallery!!")
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => takePhoto()}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>

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
            {pastArtDisplays.map((artDisplay,index) =>(
              <IonCol size="3" key={index}>
                <IonCard>
                <IonImg src={artDisplay.primary_image? artDisplay.primary_image.url: ''} />
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

        <IonTitle size="large">Take a Picture</IonTitle>

      </IonContent>
    </IonPage>
  );
};

export default connector(Gallery)
