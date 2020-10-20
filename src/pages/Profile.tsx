/**
 * Profile.tsx - The Profile tsx currently displays a sample profile information section.
 */

import React, { useEffect } from "react";
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../store'
import { fetchUser } from "../store/user"
import "./Profile.css";

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


/* use the props currentArtDisplay and allArtDisplays to access state */
const mapState = (state: RootState) => ({
  currentUser: state.user
  // currentArtDisplay: state.artDisplay.currentArtDisplay,
  // pastArtDisplays: state.artDisplay.pastArtDisplays,
  // allArtDisplays: state.artDisplay.allArtDisplays
})

const mapDispatch = (dispatch: any) => ({
  getUser: (username:string, pw:string) => dispatch(fetchUser(username, pw))
  // changeCurrentArtDisplay: (artwork: ArtDisplay) => dispatch(changeCurrentArtDisplay(artwork)),
  // getAllArtworks: () => dispatch(fetchAllArtworks()),
  // getPastArtworks: () => dispatch(fetchPastArtworks()),
})

const connector = connect(mapState, mapDispatch)


type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}




const Profile = (props: Props) => {
  useEffect(() => { props.getUser('Ccampbell', 'cunygallery') }, []);

  let user = props.currentUser;

  console.log(user, "STATE PROPS")


  return (
    <IonPage className="container-fluid">
      <IonHeader>
        <IonToolbar></IonToolbar>

        <IonToolbar>
          <IonTitle className="ion-text-center">Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonCardContent className="ion-text-center">
          <img
            className="profile-pic"
            src={user.profilePicture ? user.profilePicture.url : ''}
            alt="Scan QR"
          />
          <IonCardTitle>{`${user.firstName} ${user.lastName}`}</IonCardTitle>
          <IonCardSubtitle>{user.campus}</IonCardSubtitle>
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
              <input type="text" value={user.firstName} className="input-xlarge" />
              <hr />

              <IonLabel>Last Name</IonLabel>
              <br />
              <input type="text" value={user.lastName} className="input-xlarge" />
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
