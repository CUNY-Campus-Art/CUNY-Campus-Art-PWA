// Scavenger hunt screen with clues and segment buttons

import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Home.css";
import  HuntClues  from "../components/HuntClues"; //clues list component
import  HuntStatus  from "../components/HuntStatus";  //user status component

interface Props {
}

const ScavengerHunt = (props: Props) => {
    // Set clues tab to be default opened
  const [showStatus, setShowStatus] = useState(false);
  const [showClues, setShowClues] = useState(true);
  const handleStatus = () => {
    setShowStatus(true);
    setShowClues(false);
  };
  const handleClues = () => {
    setShowClues(true);
    setShowStatus(false);
  };

  return (
    <IonPage className="container-fluid">
        <IonHeader>
            <IonToolbar></IonToolbar>

            <IonToolbar>
            <IonTitle className="ion-text-center">Scavenger Hunt</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>

            <IonSegment>
                <IonSegmentButton value="clues" onClick={handleClues}>
                    <IonLabel>Clues</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="status" onClick={handleStatus}>
                    <IonLabel>Status</IonLabel>
                </IonSegmentButton>
            </IonSegment>

        {/* ************** shows Clues for scavenger hunt *************** */}
        <div>{showClues ? (<HuntClues/>) : (<p></p>)}</div>

        {/* ************** shows Status for scavenger hunt of User *************** */}
        <div> {showStatus ? <HuntStatus/> : <p></p>}</div>

      </IonContent>
    </IonPage>
  );
};

export default ScavengerHunt;
