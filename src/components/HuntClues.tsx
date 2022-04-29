
import React, { useCallback, useContext, useState } from "react";
import { NavContext } from '@ionic/react';
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
  IonAlert
} from "@ionic/react";
import {
  arrowBackCircleOutline,
  // qrCodeOutline,
  colorPalette,
  medalOutline,
  bulbOutline,
} from "ionicons/icons";

import './HuntClues.css'
import QRScanner from "../components/QRScanner"

import { RootState } from '../store'
import { fetchScannedArtDisplay, addSolvedArtwork} from '../store/artdisplay'
import { addScannedArtDisplayToUserDB, initializeUser } from '../store/user'
// import { render } from "@testing-library/react";
// import { StringDecoder } from "string_decoder";

/* use the props currentArtDisplay and allArtDisplays to access state */
const mapState = (state: RootState) => ({
  currentArtDisplay: state.artDisplay.currentArtDisplay,
  allArtDisplays: state.general.allArtDisplays,
  user: state.user.user,
  unsolved_artworks: state.artDisplay.unsolvedArtDisplays,
  campuses: state.general.campuses
})

const mapDispatch = (dispatch: any) => ({
  getScannedArtDisplay: (qrCodeText: string) => dispatch(fetchScannedArtDisplay(qrCodeText)),
  addScannedArtDisplayToUserDB: (user: any, artworkId: any) => dispatch(addScannedArtDisplayToUserDB(user, artworkId)),
  addSolvedArtwork: (user:any, artworkId:any, points:any) => dispatch(addSolvedArtwork(user, artworkId, points)),
  initializeUser: (user:any) => dispatch(initializeUser(user))
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
    () => navigate('/Information', 'back'),
    [navigate]
  );

  // Causes camera button to toggle on and off based on whether scan is open. When scan is open, camera button is replaced by a stop button, goes back to normal otherwise.
  // Checks whether scan state in child QRScanner component is active
  let [scanState, setScanState] = useState(0);

  let scanStateParent = (state: any) => {
    setScanState(state)
  }
  let insideModal = (state: any) => {
    insideModal(true)
  }

  // Set states for Modal and selected artwork
  let [categoryState, setCategoryState] = useState('')
  let [pointsState, setPointsState] = useState('')
  let [clueState, setClueState] = useState('')
  let [idState, setIdState] = useState(0)
  let [titleState, setTitleState] = useState('')

  const [showModal, setShowModal] = useState(false);
  const [showCorrectAlert, setShowCorrectAlert] = useState(false);
  const [showIncorrectAlert, setShowIncorrectAlert] = useState(false);



  // Will be called from inside QR Scanner component when it extracts information from the QR Code.
  // Added async/ await so that state of the currentArtDisplay is able to adjust before redirecting to the information tab

  let [scanResult, setScanResult] = useState('');

  let handleFile:any;

  let getHandleFile = (result:any) => {
      handleFile = result
  }

  let scanResultParent = async (qrCodeText: string) => {
    scanResult = qrCodeText
    setScanResult(scanResult) //updates local state
    let id = await props.getScannedArtDisplay(scanResult)
    console.log(typeof idState, 'Hunts Clues scan result: ', id)

    //If the id of the scanned artwork matches id of selected clue, close the modal and then show the 'correct'. Else, show 'incorrect' alert
    if(Number(id) === idState) {
      setShowModal(false)
      setShowCorrectAlert(true)
      props.addSolvedArtwork(user, id, pointsState)
    } else {
      setShowIncorrectAlert(true)
    }

     props.addScannedArtDisplayToUserDB(user, id);
    //redirect()
  };


  return (
    <div>
      <IonList>
        {user.unsolved_artworks ? user.unsolved_artworks.map((artwork: any, index: any) =>
          <IonItem key={index}>

            <IonLabel>
              {/* CATEGORY */}
              <h3>{artwork.artwork_type_clue ? artwork.artwork_type_clue : ''}</h3>
              {/* AMOUNT OF POINTS AWARDED IF SOLVED */}
              <p>{artwork.clue ? artwork.clue.Points : ''} Points</p>
              {/* THE CLUE */}
              <p>{artwork.clue ? artwork.clue.Clue : ''}</p>
            </IonLabel>

            <IonButton onClick={() => {
              setCategoryState(artwork.artwork_type_clue ? artwork.artwork_type_clue : '')
              setPointsState(artwork.clue ? artwork.clue.Points : '')
              setClueState(artwork.clue ? artwork.clue.Clue : '')
              setIdState(artwork.id)
              setTitleState(artwork.title)
              setShowModal(true)
            }}>
              Solve
        </IonButton>
          </IonItem>
        ): <IonCard color="primary"><IonCardTitle class="ion-text-center">Congrats! You have solved all of our clues. Come back at a later time for more clues.</IonCardTitle></IonCard>}



        {/* ION MODAL COMPONENT (POP UP FOR CLUE): */}

        <IonModal backdropDismiss={false} cssClass={'clues-modal'} isOpen={showModal}>
          {scanState ? <div className="modal-scanner-bg"></div> : ''}
          <IonCard className={scanState ? 'hide-modal-card' : 'show-modal-card'}>
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


            </IonList>
          </IonCard>

          <QRScanner key="clues-tab" name="QR-Scanner"
            stylingMargins={"qr-scanner-clues-tab"}
            scanResultParent={scanResultParent} scanStateParent={scanStateParent} getHandleFile={getHandleFile} />
          {/*Exit Modal button: */}
          <IonButton className={`modal-back-button ${scanState ? "hide-modal-card": 'show-modal-card'}` }
            expand="block"
            color="tertiary"
            onClick={() => setShowModal(false)}
          >
            <IonIcon icon={arrowBackCircleOutline} slot="start" />
            <IonLabel>Go Back</IonLabel>
          </IonButton>
        </IonModal>
        {/* END OF MODAL */}

        {/*  */}
        <input id={`file-inputqr-scanner-clues-tab`} type="file" accept="image/*;capture=camera" hidden onChange={()=> handleFile()} />



        {/* if the scan of qr code is correct show this alert: possibly add image to message*/}
        <IonAlert
          isOpen={showCorrectAlert}
          onDidDismiss={() => { setShowCorrectAlert(false); setShowModal(false); }}
          header={`CORRECT! ✅ `}
          cssClass="correct-alert"
          subHeader={titleState}
          message={`Congrats! You have scanned the correct artwork! ${pointsState} points have been added to your account`}
          buttons={[
            {
              text: 'Close',
              handler: () => {
                console.log("confirm close");
                props.initializeUser(user)
              }
            }
          ]}
        /> {/*ion alert - correct*/}

        {/* if the scan of qr code is correct show this alert: */}
        <IonAlert
          isOpen={showIncorrectAlert}
          onDidDismiss={() => { setShowIncorrectAlert(false) }}
          header={`SORRY, INCORRECT! ⚠️`}
          subHeader={'Artwork scanned is incorrect'}
          message={"you have selected the incorrect artwork! Please try again"}
          buttons={[
            {
              text: 'Exit to Clues',
              role: 'cancel',
              handler: () => {
                console.log("confirm close");
                setShowModal(false);
              }
            },
            {
              text: 'Try Again',
              handler: () => {
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
