/**
 * ScanQR.tsx currently houses the QRScanner component, and is able to fetch result from QRScanner scan to fetch artwork data from the database. Once it gets the info, it switches the user over to the Information tab displaying the details of that artowrk. The ScanQR page also provides instruction to user,
 */

import React, { useCallback, useContext, useState } from "react";
// import { Redirect, Route } from 'react-router-dom';
import { IonGrid, IonRow, NavContext } from '@ionic/react';
import { connect, ConnectedProps } from 'react-redux'
import {
  // IonRouterOutlet,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonCard,
  IonCardContent,
 
} from "@ionic/react";
import "./ScanQR.css";

import QRScanner from "../components/QRScanner"


import { RootState } from '../store'
import { fetchScannedArtDisplay } from '../store/artdisplay'
import { addScannedArtDisplayToUserDB } from '../store/user'
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

const ScanQR = (props: Props) => {
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


  return (
    <IonPage>
      <IonContent>

      <IonHeader>
          <IonToolbar></IonToolbar>

          <IonToolbar>
            <div className="ion-text-center">Welcome!</div>
          </IonToolbar>
        </IonHeader>


        <IonCard class="ion-text-center">
          <IonGrid>
            <IonRow>
            <div className="col-lg-4 text-center">
                <img
                  src={require("../assets/images/QR-Icon.png")}
                  className="img-fluid card-imgs"
                  alt="scan-qr"
                />
              </div>

              <div className="col-lg-6 order-lg-2 text-lg-left text-center">
                <hr />
                <p>
                CUNY Gallery is an app that showcases CUNY students' artwork
                in an acccessible way through the scanning of QR codes located on
                the artwork. <br/>
                <strong>Scan a QR code to learn more about students' artwork!</strong>
                </p>
              </div>
            </IonRow>
          </IonGrid>

          <IonCardContent>Scan Result: {scanResult}</IonCardContent>
        </IonCard>
            <QRScanner name="QR-Scanner" scanResultParent={scanResultParent} scanStateParent={scanStateParent} />
      </IonContent>
    </IonPage>
  );
};

export default connector(ScanQR)
