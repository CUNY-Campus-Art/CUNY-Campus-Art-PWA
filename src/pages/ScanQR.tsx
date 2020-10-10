import React from "react";
import {
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
import { camera } from "ionicons/icons";
import QRScanner from "../components/QRScanner"

const ScanQR: React.FC = () => {
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
              <img src={require("../assets/images/QR-scan.gif")} alt="Scan QR"/>
            </IonCardContent>
          </IonCard>

          <QRScanner name="QR Scanner" />
        {/* to do: link to camera */}

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton >
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ScanQR;
