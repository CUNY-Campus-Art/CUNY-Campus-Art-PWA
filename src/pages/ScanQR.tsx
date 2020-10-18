/**
 * ScanQR.tsx currently houses the QRScanner component, and is able to fetch result from QRScanner scan to fetch artwork data from the database. Once it gets the info, it switches the user over to the Information tab displaying the details of that artowrk. The ScanQR page also provides instruction to user,
 */

import React, { useCallback, useContext, useState } from "react";
import { Redirect, Route } from 'react-router-dom';
import { NavContext } from '@ionic/react';
import { connect, ConnectedProps } from 'react-redux'
import {
  IonRouterOutlet,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from "@ionic/react";
import "./ScanQR.css";
import { camera, folder, stop, scan, timeSharp } from "ionicons/icons";
import QRScanner from "../components/QRScanner"

//For Camera Button:
import { usePhotoGallery } from "../hooks/usePhotoGallery";

import { RootState } from '../store'
import { fetchScannedArtDisplay } from '../store/artdisplay'
import Information from "./Information";

/* use the props currentArtDisplay and allArtDisplays to access state */
const mapState = (state: RootState) => ({
  currentArtDisplay: state.artDisplay.currentArtDisplay,
  allArtDisplays: state.artDisplay.allArtDisplays
})

const mapDispatch = {
  getScannedArtDisplay: (qrCodeText: string) => fetchScannedArtDisplay(qrCodeText)
}

const connector = connect(mapState, mapDispatch)

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}

const ScanQR = (props: Props) => {
  const { photos, takePhoto } = usePhotoGallery();

  // To redirect to Information with forward animation
  const { navigate } = useContext(NavContext);
  const redirect = useCallback(
    () => navigate('/Information', 'forward'),
    [navigate]
  );

  // Will be called from inside QR Scanner when it extracts information from the QR Code.
  // Added async/ await so that state of the currentArtDisplay is able to adjust before redirecting  to the information tab

  let [scanResult, setScanResult] = useState('');

  let scanResultParent = async (qrCodeText: string) => {
    scanResult = qrCodeText
    setScanResult(scanResult) //updates local state
    console.log('scan result: ', scanResult)
    await props.getScannedArtDisplay(scanResult)
    redirect()
  };

  // Causes camera button to toggle on and off based on whether scan is open. When scan is open, camera button is replaced by a stop button, goes back to normal otherwise.
  // Checks whether scan state in child QRScanner component is active
  let [scanState, setScanState] = useState(0);

  let scanStateParent = (state: any) => {
    setScanState(state)
  }


  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonTitle size="large">Scan</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonCard class="ion-text-center">
          <IonCardHeader>
            <IonCardTitle >Scan a QR Code</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <img src={require("../assets/images/QR-code-scan-loop-once.gif")} alt="Scan QR" />
          </IonCardContent>

          <IonCardTitle>Scan Result: {scanResult}</IonCardTitle>
        </IonCard>

        <QRScanner name="QR-Scanner" scanResultParent={scanResultParent} scanStateParent={scanStateParent} />


        {/* to do: link to camera */}
        {!scanState ? <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => takePhoto()} color="tertiary">
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab> : ''}

      </IonContent>
    </IonPage>
  );
};

export default connector(ScanQR)
