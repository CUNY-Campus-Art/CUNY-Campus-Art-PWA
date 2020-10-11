import React from "react";
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
import { fetchAllArtworks } from '../store/artdisplay'

/* use the props currentArtDisplay and allArtDisplays to access state */
const mapState = (state: RootState) => ({
  currentArtDisplay: state.artDisplay.currentArtDisplay,
  allArtDisplays: state.artDisplay.allArtDisplays
})

const mapDispatch = (dispatch: any) => ({
  getAllArtworks: () => dispatch(fetchAllArtworks())
})

const connector = connect(mapState, mapDispatch)

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}

const Gallery = (props: Props) => {
  const { photos, takePhoto } = usePhotoGallery();
  // props.getAllArtworks();
  const allArtDisplays = props.allArtDisplays
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
            {allArtDisplays.map((artDisplay,index) =>(
              <IonCol size="3" key={index}>
                <IonCard>
                <IonImg src={artDisplay.primaryImage.src} />
                <IonCardTitle>{artDisplay.titleOfArtwork}</IonCardTitle>
                <IonCardSubtitle>{artDisplay.nameOfArtist}</IonCardSubtitle>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonTitle size="large">Take a Picture</IonTitle>

      </IonContent>
    </IonPage>
  );
};

export default connector(Gallery)
