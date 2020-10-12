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
import { camera, folder, stop, scan} from "ionicons/icons";
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
              <img src={require("../assets/images/QR-code-scan-loop-once.gif")} alt="Scan QR"/>
            </IonCardContent>
          </IonCard>

          <QRScanner name="QR Scanner" />
        {/* to do: link to camera */}


        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton color="secondary" >
            <IonIcon icon={folder}></IonIcon>
          </IonFabButton>
        </IonFab>

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton >
            <IonIcon icon={scan}></IonIcon>
          </IonFabButton>
        </IonFab>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="danger" >
            <IonIcon color='light' icon={stop}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ScanQR;
