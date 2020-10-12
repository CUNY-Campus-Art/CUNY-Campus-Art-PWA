import React, { useCallback, useContext } from "react";
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
  // IonFab,
  // IonFabButton,
  // IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from "@ionic/react";
import "./ScanQR.css";
import { camera, folder, stop, scan } from "ionicons/icons";
import QRScanner from "../components/QRScanner"


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

  // To redirect to Information with forward animation
  const { navigate } = useContext(NavContext);
  const redirect = useCallback(
    () => navigate('/Information', 'forward'),
    [navigate]
  );

  // Will be called from inside QR Scanner when it extracts information from the QR Code.
  // Added async/ await so that state of the currentArtDisplay is able to adjust before redirecting  to the information tab
  let scanResultParent = async (qrCodeText: string) => {
    console.log('qrcodeResult', qrCodeText)
    await props.getScannedArtDisplay(qrCodeText)
    redirect()
  };

  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonTitle size="large">Scan</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Redirects page to information after QR code is processed */}
        {/* <Route
        exact
        path="/ScanQR"
        render={props => redirect ? <Information />: ''} /> */}

        <IonCard class="ion-text-center">
          <IonCardHeader>
            <IonCardTitle >Scan a QR Code</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <img src={require("../assets/images/QR-code-scan-loop-once.gif")} alt="Scan QR" />
          </IonCardContent>
        </IonCard>

        <QRScanner name="QR Scanner" scanResultParent={scanResultParent} />
        {/* to do: link to camera */}



      </IonContent>
    </IonPage>
  );
};

export default connector(ScanQR)
