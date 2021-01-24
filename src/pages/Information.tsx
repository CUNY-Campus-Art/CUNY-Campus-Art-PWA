/**
 * Information.tsx - The Information component displays the details pertaining to a single artwork, the current artwork, user has either just scanned or chosen from the gallery
 */

import React, { useContext, useCallback } from "react";
import { NavContext } from '@ionic/react';
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
  IonButton,
} from "@ionic/react";
import "./Information.css";

import { informationCircleOutline, qrCodeSharp, heart, heartOutline } from "ionicons/icons";

import {
  clickLikeButton
} from '../store/artdisplay'

const mapState = (state: any) => ({
  user: state.user.user,
  campuses: state.general.campuses,
  currentArtDisplay: state.artDisplay.currentArtDisplay
})

const mapDispatch = (dispatch: any) => ({
  clickLikeButton: (user: any, artworkId: any, fromGallery: boolean) => dispatch(clickLikeButton(user, artworkId, fromGallery))
})

const connector = connect(mapState, mapDispatch)

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

  // To redirect to QR scan tab using backward animation
  const { navigate } = useContext(NavContext);
  const redirect = useCallback(
    () => navigate('/ScanQR', 'back'),
    [navigate]
  );


  let currentArtDisplay = props.currentArtDisplay;
  console.log("CURRENT ART DISPLAY", props.currentArtDisplay);

  let slidesComp = props.currentArtDisplay.other_images ? [currentArtDisplay.primary_image, ...props.currentArtDisplay.other_images] : [currentArtDisplay.primary_image]

  function handleLikes() {
      let result = props.clickLikeButton(props.user, currentArtDisplay, false);
      //Use the result in the future to make local state update faster
  }

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
            <IonCardSubtitle>{currentArtDisplay.artist}
              {/* Heart Button */}
              <IonButton className="heartPlacement"
                fill="clear"
                size="small"
                onClick={handleLikes}
              >
                {currentArtDisplay.liked ? (<IonIcon slot="icon-only" size='large' icon={heart}></IonIcon>) : (<IonIcon slot="icon-only" size='large' icon={heartOutline}></IonIcon>)}

              </IonButton>

              {/* <IonIcon
                className="heartPlacement"
                onClick={() => props.clickLikeButton(props.user, currentArtDisplay, false)}
                icon={props.currentArtDisplay.liked ? heart: heartOutline}
                size="large"
                ></IonIcon>) */}
            </IonCardSubtitle>
            <IonCardTitle >{`${currentArtDisplay.title}, ${currentArtDisplay.year}`}</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>

            {/* Slide show of images uploaded for the artwork */}
            <IonSlides pager={true} options={slideOpts} key={slidesComp.map(slide => slide.url).join('_')}>
              {slidesComp.map((image, index) => <IonSlide key={image.url}>
                <img src={image.url} alt={image.alternativeText} />
              </IonSlide>)}

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
          <IonItem onClick={() => redirect()} >
            <IonIcon icon={qrCodeSharp} slot="start" />
            <IonLabel class="ion-text-center">Scan Another Artwork</IonLabel>
          </IonItem>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};



export default connector(Information)
