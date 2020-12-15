import React, { useCallback, useContext, useState } from "react";
import { IonGrid, IonRow, NavContext } from '@ionic/react';
import { connect, ConnectedProps } from 'react-redux'
import {
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonButton,
  IonCard,
  IonIcon,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonAlert,
} from "@ionic/react";
import {
  arrowBackCircleOutline,
  qrCodeOutline,
  colorPalette,
  medalOutline,
  bulbOutline,
} from "ionicons/icons";
import QRScanner from "../components/QRScanner"

import { RootState } from '../store'
import { fetchScannedArtDisplay } from '../store/artdisplay'
import { addScannedArtDisplayToUserDB } from '../store/user'
import { render } from "@testing-library/react";
/* use the props currentArtDisplay and allArtDisplays to access state */
const mapState = (state: RootState) => ({
  currentArtDisplay: state.artDisplay.currentArtDisplay,
  allArtDisplays: state.artDisplay.allArtDisplays,
  user: state.user,
  campuses: state.general.campuses
})

const mapDispatch = (dispatch: any) => ({
  getScannedArtDisplay: (qrCodeText: string, user: any) => dispatch(fetchScannedArtDisplay(qrCodeText, user)),
  addScannedArtDisplayToUserDB: (artworkId: any) => dispatch(addScannedArtDisplayToUserDB(artworkId)),
})

const connector = connect(mapState, mapDispatch)

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}

const HuntClues = (props: Props) => {
 
  // To redirect to Information tab using forward animation
  const { navigate } = useContext(NavContext);
  const redirect = useCallback(
    () => navigate('/Information', 'forward'),
    [navigate]
  );

  // Will be called from inside QR Scanner component when it extracts information from the QR Code.
  // Added async/ await so that state of the currentArtDisplay is able to adjust before redirecting to the information tab

  let [scanResult, setScanResult] = useState('');

  let scanResultParent = async (qrCodeText: string) => {
    scanResult = qrCodeText
    setScanResult(scanResult) //updates local state
    console.log('scan result: ', scanResult)
    let id = await props.getScannedArtDisplay(scanResult, props.user)
    await props.addScannedArtDisplayToUserDB(id);
    redirect()
  };

  // Causes camera button to toggle on and off based on whether scan is open. When scan is open, camera button is replaced by a stop button, goes back to normal otherwise.
  // Checks whether scan state in child QRScanner component is active
  let [scanState, setScanState] = useState(0);

  let scanStateParent = (state: any) => {
    setScanState(state)
  }
  let insideModal = (state: any) => {
    insideModal(true)
  }
// const HuntClues = () => {
  
  const [showModal, setShowModal] = useState(false);
  const [showCorrectAlert, setShowCorrectAlert] = useState(false);
  const [showIncorrectAlert, setShowIncorrectAlert] = useState(false);

  return (
    <div>
      <IonList>
        {/* Possibly map clues to list : {artworks.map((artworks.clue, i) => (<IonItem key = {i}> <IonImg src = {artworks.clue}/> </IonItem>))} */}
        <IonItem>
          {/* <IonThumbnail slot="start">
          <img src= {require("../assets/images/bluesClues.jpg")} />
        </IonThumbnail> */}
          <IonLabel>
            {/* CATEGORY */}
            <h3>artworks.artwork_type_clue: Modern Art</h3>
            {/* AMOUNT OF POINTS AWARDED IF SOLVED */}
            <p>artworks.points: 10 POINTS</p>
            {/* THE CLUE */}
            <p>artworks.clue: Find me near a water fountain in the music department</p>
          </IonLabel>

          {/* modal component showing the clue and buttons to solve or go back */}
          <IonModal isOpen={showModal}>
            {/* repeated information */}
            <h3>artworks.artwork_type_clue: Modern Art</h3>
            <p>artworks.points: 10 POINTS</p>
            <p>artworks.clue: Find me near a water fountain in the music department</p>
            {/* to do <IonButton>Scan Artwork</IonButton> */}
            <IonButton onClick={() => setShowModal(false)}>Go Back</IonButton>
          </IonModal>

          <IonButton onClick={() => setShowModal(true)}>Solve</IonButton>
        </IonItem>

        {/* SECOND CLUE */}
        <IonItem>
          {/* <IonThumbnail slot="start"> */}
          {/* <img src="https://d26jxt5097u8sr.cloudfront.net/s3fs-public/styles/width_1200/public/1969_345_bird1-205x300.jpg?itok=OD7VW8c4" /> */}
          {/* </IonThumbnail> */}
          <IonLabel>
            <h3>New World and Old World cultures</h3>
            <p>10 POINTS</p>
            <p>
              The scene may show a rescue from a pirate attack, common along the
              west coast of South America in the 1700s.
            </p>
          </IonLabel>
          <IonButton onClick={() => setShowModal(true)}>Solve</IonButton>


        {/* ION MODAL COMPONENT (POP UP FOR CLUE): */}
          <IonModal isOpen={showModal}>
            <IonCard>
              <IonCardHeader>
                <IonCardSubtitle>Category <IonIcon icon={colorPalette}></IonIcon></IonCardSubtitle>
                <IonCardTitle>New World and Old World cultures</IonCardTitle>
              </IonCardHeader>

              <IonCardContent className="clue">
                <IonCardSubtitle> Clue <IonIcon icon={bulbOutline}></IonIcon></IonCardSubtitle>
                <IonCardTitle>
                  The scene may show a rescue from a pirate attack, common along
                  the west coast of South America in the 1700s.
                </IonCardTitle>
              </IonCardContent>

              <IonCardHeader>
                <IonCardSubtitle> Award <IonIcon icon={medalOutline}></IonIcon></IonCardSubtitle>
                <IonCardTitle> 10 Points </IonCardTitle>
              </IonCardHeader>

              <IonList>
                {/*TODO: add qr scanner to functionality to ionItem */}
                <IonItem button color="primary" >
                  <IonIcon icon={qrCodeOutline} slot="start" />
                  <IonLabel>Scan Artwork</IonLabel>
                  {/* <QRScanner name="QR-Scanner" scanResultParent={scanResultParent} scanStateParent={scanStateParent} /> */}
                </IonItem>
                {/*Exit Modal button: */}
                <IonItem
                  button
                  color="secondary"
                  onClick={() => setShowModal(false)}
                >
                  <IonIcon icon={arrowBackCircleOutline} slot="start" />
                  <IonLabel>Go Back</IonLabel>
                </IonItem>

                {/* temporary ion items to be implemented when scan qr logic is added: */}
                <IonItem
                  button
                  color="danger"
                  onClick={() => setShowCorrectAlert(true)}
                >
                  <IonIcon icon={arrowBackCircleOutline} slot="start" />
                  <IonLabel>IF CORRECT</IonLabel>
                </IonItem>

                <IonItem
                  button
                  color="danger"
                  onClick={() => setShowIncorrectAlert(true)}
                >
                  <IonIcon icon={arrowBackCircleOutline} slot="start" />
                  <IonLabel>IF INCORRECT</IonLabel>
                </IonItem>


              </IonList>
            </IonCard>
          </IonModal> 
          {/* END OF MODAL */}
         

          {/* if the scan of qr code is correct show this alert: possibly add image to message*/}
          <IonAlert
          isOpen={showCorrectAlert}
          onDidDismiss={() => { setShowCorrectAlert(false); setShowModal(false);}}
          header={'CORRECT!'} 
          subHeader={'congratulations'}
          message={"You have scannrd the correct artwork!  {/*number of points*/} has been added to your account" }
          buttons={[
            {
             text: 'Close',
             handler: () =>{
               console.log("confirm close");
             }
            }
            ]}
        /> {/*ion alert - correct*/}

        {/* if the scan of qr code is correct show this alert: */}
          <IonAlert
          isOpen={showIncorrectAlert}
          onDidDismiss={() => { setShowIncorrectAlert(false) }}
          header={'SORRY, INCORRECT! '}
          subHeader={'Artwork scanned is incorrect'}
          message={"you have selected the incorrect artwork! Please try again" }
          buttons={[
            {
             text: 'Exit to Clues',
             role: 'cancel',
             handler: () =>{
               console.log("confirm close");
               setShowModal(false);
             }
            },
             {
              text: 'Try Again',
              handler: () =>{
                console.log("confirm try again");
                setShowModal(true);
              }
            }
            ]}
        /> {/*ion alert - incorrect*/}
        </IonItem>
      </IonList>
    </div>
  );
};

export default connector(HuntClues);
