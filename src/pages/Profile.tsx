/**
 * Profile.tsx - The Profile tsx currently displays a sample profile information section.
 */

import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../store'
import { getUser, logout, fetchUser } from '../store/user'
import './Profile.css';
import { Login } from '../components/Login'
import UserProfile from '../components/UserProfile'

import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";


/* Retrieves current user from the State */
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




const Profile = (props: Props) => {

  let user = props.currentUser;
  let campus = props.campus;

  // let =
  return (
    <IonPage className="container-fluid">
      <IonHeader>
        <IonToolbar></IonToolbar>

        <IonToolbar>
          {/* Back button goes to scan tab - Commented out for now because not necessary at the moment. User can with one tap go back to the Scan Page. Added to Signup page however, which redirects back to this login */}
          {/* <IonButtons slot="start">
          <IonBackButton defaultHref="/" />
          </IonButtons> */}

          {/* Added the logout button here, but had to exclude
          the text attached by commenting out in AuthFormContainer.tsx  */}
          <IonButtons slot="primary">
                {user ? (< Login />) : '' }
          </IonButtons>
          <IonTitle className="ion-text-center"> {user ? 'Profile' : 'Login' }</IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent>
          {/*Made edit here to not show logoutbutton in ioncontent
          (show UserProfile) else show login container*/}
        {user ? (<UserProfile />): (<Login />)}

      </IonContent>
    </IonPage>
  );
};


export default connector(Profile)
