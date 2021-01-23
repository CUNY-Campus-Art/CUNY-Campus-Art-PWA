
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
import { StringDecoder } from "string_decoder";
/* use the props currentArtDisplay and allArtDisplays to access state */
const mapState = (state: RootState) => ({
  currentArtDisplay: state.artDisplay.currentArtDisplay,
  allArtDisplays: state.artDisplay.allArtDisplays,
  user: state.user.user,
  unsolved_artworks: state.user.unsolved_artworks,
  campuses: state.general.campuses
})

const mapDispatch = (dispatch: any) => ({
  getScannedArtDisplay: (qrCodeText: string) => dispatch(fetchScannedArtDisplay(qrCodeText)),
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
  let user = props.user;

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
    let id = await props.getScannedArtDisplay(scanResult)
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

  // Set states for Modal
  let [categoryState, setCategoryState] = useState('')
  let [pointsState, setPointsState] = useState('')
  let [clueState, setClueState] = useState('')

  const [showModal, setShowModal] = useState(false);
  const [showCorrectAlert, setShowCorrectAlert] = useState(false);
  const [showIncorrectAlert, setShowIncorrectAlert] = useState(false);

  return (
    <div>
      <IonList>
        {/* Possibly map clues to list : {artworks.map((artworks.clue, i) => (<IonItem key = {i}> <IonImg src = {artworks.clue}/> </IonItem>))} */}
        {user && user.unsolved_artworks && user.unsolved_artworks.map ((artwork:any, index:any) =>
        <IonItem key={index}>

        <IonLabel>
          {/* CATEGORY */}
          <h3>{artwork.artwork_type_clue? artwork.artwork_type_clue:''}</h3>
          {/* AMOUNT OF POINTS AWARDED IF SOLVED */}
          <p>{artwork.clue? artwork.clue.Points: ''} Points</p>
          {/* THE CLUE */}
          <p>{artwork.clue? artwork.clue.Clue: ''}</p>
        </IonLabel>

        <IonButton onClick={() => {
          setCategoryState(artwork.artwork_type_clue? artwork.artwork_type_clue:'')
          setPointsState(artwork.clue ? artwork.clue.Points : '')
          setClueState(artwork.clue ? artwork.clue.Clue : '')
          setShowModal(true)}}>
            Solve
        </IonButton>
      </IonItem>
        )}

        {/* ION MODAL COMPONENT (POP UP FOR CLUE): */}
          <IonModal isOpen={showModal}>
            <IonCard>
              <IonCardHeader>
                <IonCardSubtitle>Category <IonIcon icon={colorPalette}></IonIcon></IonCardSubtitle>
                <IonCardTitle>{categoryState}</IonCardTitle>
              </IonCardHeader>

              <IonCardContent className="clue">
                <IonCardSubtitle> Clue <IonIcon icon={bulbOutline}></IonIcon></IonCardSubtitle>
                <IonCardTitle>{clueState}</IonCardTitle>
              </IonCardContent>

              <IonCardHeader>
                <IonCardSubtitle> Award <IonIcon icon={medalOutline}></IonIcon></IonCardSubtitle>
                <IonCardTitle> {pointsState} Points </IonCardTitle>
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

      </IonList>
    </div>
  );
};

export default connector(HuntClues);
