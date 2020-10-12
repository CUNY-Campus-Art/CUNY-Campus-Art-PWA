import React from "react";
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  // IonTabButton,
  // IonLabel,
  // IonIcon,
  // IonButton
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Home.css";
//import { menuOutline } from "ionicons/icons";


const Home: React.FC = () => {
  return (
    <IonPage>

      <IonContent>
        <IonHeader>

          <IonToolbar>
          </IonToolbar>

          <IonToolbar>
            <IonTitle className="ion-text-center">Profile</IonTitle>
          </IonToolbar>

        </IonHeader>
        
        <IonCard>
                
            <IonCardContent>
            <img src={require("../assets/images/christopher-campbell-rDEOVtE7vOs-unsplash.jpg")} alt="Scan QR" width="150"/>
            <IonCardTitle>Chris Campbell</IonCardTitle>
            <IonCardSubtitle>CUNY Brooklyn College</IonCardSubtitle>
            <IonButton fill="outline" slot="end">
                Edit
                </IonButton>
                </IonCardContent>
        </IonCard>

        <IonCard>

        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Home;
