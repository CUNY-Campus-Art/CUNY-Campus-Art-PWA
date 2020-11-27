/**
 * Profile.tsx - The Profile tsx currently displays a sample profile information section.
 */

import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../store'
import { getUser, logout, fetchUser } from '../store/user'
import {fetchAllCampuses } from '../store/general'
import './Profile.css';
import AuthFormContainer from '../components/AuthFormContainer'
import UserProfile from '../components/UserProfile'

import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
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
  IonMenuButton,
  IonPage,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { calendar, informationCircle, personCircle, search } from "ionicons/icons";


/* Retrieves current user from the State */
const mapState = (state: RootState) => ({
  currentUser: state.user.user,
  campus: state.user.user.campus,
  campuses: state.general.campuses
})

const mapDispatch = (dispatch: any) => ({
  getAllCampuses: () => dispatch(fetchAllCampuses()),
  fetchUser: (username: string, pw: string) => dispatch(fetchUser(username, pw)),
  getUser: (user: any) => dispatch(getUser(user)),
})

const connector = connect(mapState, mapDispatch)


type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}




const Profile = (props: Props) => {

  useEffect(() => {   props.getAllCampuses(); }, []);

  let user = props.currentUser;
  let campus = props.campus;


  return (
    <IonPage className="container-fluid">
      <IonHeader>
        <IonToolbar></IonToolbar>

        <IonToolbar>
          {/* Back button goes to scan tab */}
          <IonButtons slot="start">
          <IonBackButton defaultHref="/" />
          </IonButtons>
          {/* Added the logout button here, but had to exclude
          the text attached by commenting out in AuthFormContainer.tsx  */}
          <IonButtons slot="primary">
              <div>
                {user ? (< AuthFormContainer/>) : (<IonText>Login</IonText>) }
              </div>
          </IonButtons>
          <IonTitle className="ion-text-center">Profile</IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent>
          {/*Made edit here to not show logoutbutton in ioncontent
          (show UserProfile) else show login container*/}
        {user ? (<UserProfile />): (<AuthFormContainer />)}
        {/* <AuthFormContainer /> */}
        {/* { user? <UserProfile /> : '' } */}

      </IonContent>
    </IonPage>
  );
};


export default connector(Profile)
