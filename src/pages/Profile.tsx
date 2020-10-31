/**
 * Profile.tsx - The Profile tsx currently displays a sample profile information section.
 */

import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../store'
import { getUser, logout, fetchUser } from '../store/user'
import './Profile.css';
import AuthFormContainer from '../components/AuthFormContainer'
import UserProfile from '../components/UserProfile'

import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { calendar, personCircle } from "ionicons/icons";


/* Retrieves current user from the State */
const mapState = (state: RootState) => ({
  currentUser: state.user.user,
  campus: state.user.campus
})

const mapDispatch = (dispatch: any) => ({
  fetchUser: (username: string, pw: string) => dispatch(fetchUser(username, pw)),
  getUser: (user: any) => dispatch(getUser(user))
})

const connector = connect(mapState, mapDispatch)


type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}




const Profile = (props: Props) => {

  let user = props.currentUser;
  let campus = props.campus;


  return (
    <IonPage className="container-fluid">
      <IonHeader>
        <IonToolbar></IonToolbar>

        <IonToolbar>
          <IonTitle className="ion-text-center">Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>

          <AuthFormContainer />


        { user? <UserProfile /> : '' }

      </IonContent>
    </IonPage>
  );
};


export default connector(Profile)
