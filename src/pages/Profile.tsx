/**
 * Profile.tsx - The Profile tsx currently displays a sample profile information section.
 */

import React from "react";
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

import "./Profile.css";

const Profile: React.FC = () => {
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
            src={require("../assets/images/christopher-campbell-rDEOVtE7vOs-unsplash.jpg")}
            alt="Scan QR"
          />
          <IonCardTitle>Chris Campbell</IonCardTitle>
          <IonCardSubtitle>CUNY Brooklyn College</IonCardSubtitle>
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
              <input type="text" value="Ccampbell" className="input-xlarge" />
              <hr />

              <IonLabel>First Name</IonLabel>
              <br />
              <input type="text" value="Chris" className="input-xlarge" />
              <hr />

              <IonLabel>Last Name</IonLabel>
              <br />
              <input type="text" value="Campbell" className="input-xlarge" />
              <hr />

              <IonLabel>Email</IonLabel>
              <br />
              <input
                type="text"
                value="Ccampbell@ybrooklyn.com"
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

export default Profile;
