/**
 * ScanQR.tsx currently houses the QRScanner component, and is able to fetch result from QRScanner scan to fetch artwork data from the database. Once it gets the info, it switches the user over to the Information tab displaying the details of that artowrk. The ScanQR page also provides instruction to user,
 */

import React, { useCallback, useContext, useState } from "react";
import { IonGrid, IonRow, NavContext, IonFooter } from "@ionic/react";
import { connect, ConnectedProps } from "react-redux";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonCard,
  IonToast,
} from "@ionic/react";
import "./ScanQR.css";

import qrImage from "../assets/images/QR-Icon.png";

import QRScanner from "../components/QRScanner";

import { RootState } from "../store";
import { fetchScannedArtDisplay } from "../store/artdisplay";
import { addScannedArtDisplayToUserDB } from "../store/user";
import { Link } from "react-router-dom";

const mapState = (state: RootState) => ({
  currentArtDisplay: state.artDisplay.currentArtDisplay,
  campuses: state.general.campuses,
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  getScannedArtDisplay: (qrCodeText: string) =>
    dispatch(fetchScannedArtDisplay(qrCodeText)),
  addScannedArtDisplayToUserDB: (user: any, artworkId: any) =>
    dispatch(addScannedArtDisplayToUserDB(user, artworkId)),
});

const connector = connect(mapState, mapDispatch);

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  // backgroundColor: string
};

const ScanQR = (props: Props) => {
  let user = props.user;
  // To redirect to Information tab using forward animation
  const { navigate } = useContext(NavContext);
  const redirect = useCallback(
    () => navigate("/Information", "forward"),
    [navigate]
  );

  // Will be called from inside QR Scanner component when it extracts information from the QR Code.
  // Added async/ await so that state of the currentArtDisplay is able to adjust before redirecting to the information tab

  let [scanResult, setScanResult] = useState("");

  //This will cover cases where invalid or outdated QR Codes (i.e. artworks that don't exist anymore) are scanned
  const [showNotFoundToast, setNotFoundToast] = useState(false);

  let scanResultParent = async (qrCodeText: string) => {
    scanResult = qrCodeText;
    setScanResult(scanResult); //updates local state
    console.log("scan result: ", scanResult);
    let id = await props.getScannedArtDisplay(scanResult);
    if (user && id) await props.addScannedArtDisplayToUserDB(user, id);
    scanStateParent(false);

    if (!id) setNotFoundToast(true);
    else redirect();
  };

  let handleFile;
  let getHandleFile = (result: any) => {
    handleFile = result;
  };

  // Causes camera button to toggle on and off based on whether scan is open. When scan is open, camera button is replaced by a stop button, goes back to normal otherwise.
  // Also causes div with background to fillup screen for better aesthetic during scan mode
  // Checks whether scan state in child QRScanner component is active
  let [scanState, setScanState] = useState(0);

  let scanStateParent = (state: any) => {
    setScanState(state);
  };

  return (
    <IonPage>
      <IonContent>
        {scanState ? <div className="black-scanner-bg"></div> : ""}
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
                  src={qrImage}
                  className="img-fluid card-imgs"
                  alt="scan-qr"
                />
              </div>
              <hr />
              <p className="col-lg-6 order-lg-2 text-lg-left text-center">
                <strong>
                  Scan a QR code to learn more about students' artwork!
                </strong>
              </p>
            </IonRow>
          </IonGrid>
        </IonCard>
        {/* Pass scanStateParent function so that child can update state of parent :) */}

        <QRScanner
          key="scan-tab"
          name="QR-Scanner"
          stylingMargins={"qr-scanner-scan-section"}
          scanResultParent={scanResultParent}
          scanStateParent={scanStateParent}
          getHandleFile={getHandleFile}
        />

        <IonToast
          position="middle"
          color="warning"
          isOpen={showNotFoundToast}
          onDidDismiss={() => setNotFoundToast(false)}
          message="Artwork not found! This artwork is currently not in our collection. Please try another QR code."
          duration={1500}
        />



      </IonContent>
      <IonToolbar>
        <IonFooter>
          <div className="ion-text-center">
            Looking for a way to upload your own artwork? You can do that <Link to="/upload">here</Link>
            <br></br>
             Manage your uploaded artworks <Link to="/manage">here</Link>
          </div>
        </IonFooter>
      </IonToolbar>
    </IonPage>
  );
};

export default connector(ScanQR);
