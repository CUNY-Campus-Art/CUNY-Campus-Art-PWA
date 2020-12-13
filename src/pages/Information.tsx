/**
 * Information.tsx - The Information component displays the details pertaining to a single artwork, the current artwork, user has either just scanned or chosen from the gallery
 */

import React,{useState, useEffect} from "react";
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
  IonSlide,
  IonSlides,
} from "@ionic/react";
import "./Information.css";
import { informationCircleOutline, qrCodeSharp, } from "ionicons/icons";

import { RootState } from '../store'

const mapState = (state: RootState) => ({
  campuses: state.general.campuses,
  currentArtDisplay: state.artDisplay.currentArtDisplay
})

const mapDispatch = {

}

const connector = connect(mapState, mapDispatch)

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}

// Controls the initial image shown and the speed at which it changes
const slideOpts = {
  initialSlide: 0,
  speed: 400,
};

const Information = (props: Props) => {

  let currentArtDisplay = props.currentArtDisplay;
  console.log("CURRENT ART DISPLAY", props.currentArtDisplay);
  // let [slideKey, setSlideKey] = useState(0);

  let slides = currentArtDisplay.other_images ? [ currentArtDisplay.primary_image, ...currentArtDisplay.other_images ] : [currentArtDisplay.primary_image]
  console.log("slides", currentArtDisplay)
  return (
    <IonPage>
      <IonHeader>
          <IonToolbar></IonToolbar>

          <IonToolbar>
            <IonTitle className="ion-text-center">Artwork Information</IonTitle>
          </IonToolbar>
        </IonHeader>

      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>{currentArtDisplay.artist}</IonCardSubtitle>
            <IonCardTitle >{`${currentArtDisplay.title}, ${currentArtDisplay.year}`}</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>

          {/* Slide show of images uploaded for the artwork */}
          <IonSlides  pager={true} options={slideOpts}>
              <IonSlide key={'slidefirst'}>
                <img src={currentArtDisplay.primary_image ? currentArtDisplay.primary_image.url : ''} alt={currentArtDisplay.primary_image ? currentArtDisplay.primary_image.alternativeText: ''} />
              </IonSlide>

              {/* If there are other images post them to slideshow as well*/}
              {currentArtDisplay.other_images ? currentArtDisplay.other_images.map((image, index )=> <IonSlide key={'slide'+ index }>
                <img src={image.url} alt={image.alternativeText} />
              </IonSlide>) : ''}
            </IonSlides>

          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonItem>
            <IonIcon icon={informationCircleOutline} slot="start" />
            <IonLabel class="ion-text-center">Overview</IonLabel>
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
