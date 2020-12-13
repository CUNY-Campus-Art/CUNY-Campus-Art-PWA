// Scavenger hunt screen with clues and segment buttons
import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../store'
import { getUser, logout, fetchUser } from '../store/user'
import './Profile.css';
import { Login } from '../components/Login'
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

const mapState = (state: RootState) => ({
  currentUser: state.user.user,
  campus: state.user.user.campus,
  campuses: state.general.campuses
})

const mapDispatch = (dispatch: any) => ({
  fetchUser: (username: string, pw: string) => dispatch(fetchUser(username, pw)),
  getUser: (user: any) => dispatch(getUser(user)),
})

const connector = connect(mapState, mapDispatch)


type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}


const ScavengerHunt = (props: Props) => {

  let user = props.currentUser;
  let campus = props.campus;
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
        {/* value sets checked segment button based on which is clicked */}
            <IonSegment value={showClues ? "clues" : "status"}>
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
        <div> {showStatus ? (user ? (<HuntStatus/> ): (<Login />)) : <p></p>}</div>

      </IonContent>
    </IonPage>
  );
};

export default connector(ScavengerHunt);
