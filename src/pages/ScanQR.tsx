import React from "react";
import { connect, ConnectedProps } from 'react-redux'
import {
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
import { camera, folder, stop, scan} from "ionicons/icons";
import QRScanner from "../components/QRScanner"


import {RootState} from '../store'

/* use the props currentArtDisplay and allArtDisplays to access state */
const mapState = (state: RootState) => ({
  currentArtDisplay: state.artDisplay.currentArtDisplay,
  allArtDisplays: state.artDisplay.allArtDisplays
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

const ScanQR = (props: Props) => {
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
              <img src={require("../assets/images/QR-code-scan-loop-once.gif")} alt="Scan QR"/>
            </IonCardContent>
          </IonCard>

          <QRScanner name="QR Scanner" />
        {/* to do: link to camera */}



      </IonContent>
    </IonPage>
  );
};

export default connector(ScanQR)
