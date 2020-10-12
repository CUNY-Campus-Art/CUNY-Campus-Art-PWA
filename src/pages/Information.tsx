import React from "react";
import { connect, ConnectedProps } from 'react-redux'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonButton,
  IonSlide,
  IonSlides,
} from "@ionic/react";
import "./Information.css";
import { informationCircleOutline, qrCodeSharp, } from "ionicons/icons";

import {RootState} from '../store'

const mapState = (state: RootState) => ({
  currentArtDisplay: state.artDisplay.currentArtDisplay
})

const mapDispatch = {
  // toggleOn: () => ({ type: 'TOGGLE_IS_ON' })
}

const connector = connect(mapState, mapDispatch)

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}

// controls the initial image shown and the speed at which it changes
const slideOpts = {
  initialSlide: 0,
  speed: 400,
};

const Information = (props: Props) => {

  let currentArtDisplay = props.currentArtDisplay;
  console.log(currentArtDisplay);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle >Artwork Information</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
          <IonCardSubtitle>{currentArtDisplay.artist}</IonCardSubtitle>
          <IonCardTitle >{`${currentArtDisplay.title}, ${currentArtDisplay.year}`}</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonSlides pager={true} options={slideOpts}>
              <IonSlide>
                <img src={currentArtDisplay.primary_image? currentArtDisplay.primary_image.url: ''} alt={currentArtDisplay.primary_image.alt} />
              </IonSlide>

                {/* If there are other images post them to slideshow as well*/}
                {currentArtDisplay.other_images ? currentArtDisplay.other_images.map(image => <IonSlide>
                <img src={image.url} alt={image.alt}/>
              </IonSlide>): ''}
            </IonSlides>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonItem>
            <IonIcon icon={informationCircleOutline} slot="start" />
            <IonLabel class="ion-text-center">Overview</IonLabel>
            <IonButton fill="outline" slot="end">
              View
            </IonButton>
          </IonItem>

          <IonCardContent>
              {currentArtDisplay.description}
          </IonCardContent>
        </IonCard>

        <IonCard >
          <IonItem href="/ScanQR" >
            <IonIcon icon={qrCodeSharp} slot="start" />
            <IonLabel class="ion-text-center">Scan Another Artwork</IonLabel>
          </IonItem>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};






export default connector(Information)
