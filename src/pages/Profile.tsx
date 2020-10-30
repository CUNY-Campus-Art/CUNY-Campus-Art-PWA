/**
 * Profile.tsx - The Profile tsx currently displays a sample profile information section.
 */

import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../store'
import { getUser, removeUser, fetchUser } from '../store/user'
import './Profile.css';
import AuthFormContainer from '../components/AuthFormContainer'

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

  const [isLogged, setIsLogged] = useState(!!localStorage.getItem('user'));

  useEffect(() => {

    if(isLogged) {
      const user = JSON.parse(String(localStorage.getItem('user')));
      console.log(user, "TESTING")
        props.getUser(user)
      }
   }, []);

  let user = props.currentUser;
  let campus = props.campus;

//  console.log(typeof campus.campus_name, "STATE PROPS")

  console.log(user, "Does this work?")
  return (
    <IonPage className="container-fluid">
      <IonHeader>
        <IonToolbar></IonToolbar>

        <IonToolbar>
          <IonTitle className="ion-text-center">Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>

        <IonCard>
          <AuthFormContainer />

        </IonCard>
        <IonCardContent className="ion-text-center">
          <img
            className="profile-pic"
            src={user.profile_picture ? user.profile_picture.url : ''}
            alt="Scan QR"
          />
          <IonCardTitle>{`${user.first_name} ${user.last_name}`}</IonCardTitle>
          {/* <IonCardSubtitle>{user.campus.campus_name}</IonCardSubtitle> */}
          {/* To do: decide to keep this button to open up to form or remove this button */}
          <IonButton fill="outline" slot="end">
            Edit
          </IonButton>
        </IonCardContent>

        <ul className="nav nav-tabs">
          <li>
            <IonButton color="light" className="active">
              <a href="#home" data-toggle="tab">
                Profile
              </a>
            </IonButton>
          </li>
          <li>
            <IonButton color="light">
              <a href="#profile" data-toggle="tab">
                Password
              </a>
            </IonButton>
          </li>
        </ul>

        {/* tab-content allows changing of tabs */}
        <div id="myTabContent" className="tab-content">
          <hr />
          {/* default tab is profile */}
          <div className="tab-pane active in" id="home">
            <form id="tab">
              <IonLabel>Username</IonLabel>
              <br />
              <input type="text" value={user.username} className="input-xlarge" />
              <hr />

              <IonLabel>First Name</IonLabel>
              <br />
              <input type="text" value={user.first_Name} className="input-xlarge" />
              <hr />

              <IonLabel>Last Name</IonLabel>
              <br />
              <input type="text" value={user.last_Name} className="input-xlarge" />
              <hr />

              <IonLabel>Email</IonLabel>
              <br />
              <input
                type="text"
                value={user.email}
                className="input-xlarge"
              />
              <hr />

              <div>
                <IonButton color="success" expand="block">
                  Update
                </IonButton>
              </div>
            </form>
          </div>

          {/* Password Tab */}
          <div className="tab-pane fade" id="profile">
            <form id="tab2">
              <IonLabel>New Password</IonLabel> <br />
              <input type="password" className="input-xlarge" />
              <div>
                <IonButton color="success" expand="block">
                  Update
                </IonButton>
              </div>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};


export default connector(Profile)
