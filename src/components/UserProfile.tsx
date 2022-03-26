/**
 * UserProfile.tsx - UserProfile display component displays the specific user's information if they are logged in.
 */

import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../store";
import { getUser, fetchUser, editUserThunk } from "../store/user";
import "./UserProfile.css";
import defaultProfilePicture from "../assets/images/default-profile-pic-2.png"
import { IonSpinner, IonContent } from '@ionic/react';

import {
  IonButton,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";

/* Retrieves current user from the State */
const mapState = (state: RootState) => ({
  currentUser: state.user.user,
  campus: state.user.user.campus
});

const mapDispatch = (dispatch: any) => ({
  fetchUser: (username: string, pw: string) =>
    dispatch(fetchUser(username, pw)),
  getUser: (user: any) => dispatch(getUser(user)),
  editUser: (changes: any) => editUserThunk(changes, dispatch)
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  // backgroundColor: string
};

const UserProfile = (props: Props) => {
  // set profile tab as default
  const [showProfile, setShowProfile] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const handleProfile = () => {
    setShowProfile(true);
    setShowPassword(false);
  };
  const handlePassword = () => {
    setShowPassword(true);
    setShowProfile(false);
  };

  let user = props.currentUser;

  let campus = props.currentUser.campus;

  const [profileEdits, setProfileEdits] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    //username: user.username || user.user_name,
    email: user.email
  })

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const editProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileEdits({ ...profileEdits, [e.target.name]: e.target.value });
  }

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const saveChanges = async () => {
    console.log(profileEdits);
    setLoading(true);
    let res = await props.editUser(profileEdits);
    setLoading(false);
  }

  const savePassword = async () => {
    //don't update in case user accidentally clicked updated without entering
    if(password==""){
      console.log("null password");
    }
    else {
    setLoading(true);
    await props.editUser({ password: password });
    setLoading(false);
    setPassword("");
    }

  }

  return (
    <span>
      <IonCardContent className="ion-text-center">
        <img
          className="profile-pic"
          src={user.profile_picture ? user.profile_picture.url : defaultProfilePicture}
          alt="Avatar"
        />
        <IonCardTitle>{`${user.first_name} ${user.last_name}`}</IonCardTitle>
        <IonCardSubtitle>{user.campusName}</IonCardSubtitle>
        {/* To do: decide to keep this button to open up to form or remove this button */}
        <IonButton fill="outline" slot="end">
          Edit
        </IonButton>
      </IonCardContent>

      {/* default checked segment button will be profile, conditional statement to set checked segment button */}
      <IonSegment className="segmentButton" value={showProfile ? "profile" : "password"}>
        <IonSegmentButton value="profile" onClick={handleProfile}>
          <IonLabel>Profile</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="password" onClick={handlePassword}>
          <IonLabel>Password</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      {/* ************** shows Profile tab *************** */}
      <div>
        {showProfile ? (
          <form id="tab">
            <IonLabel>Username</IonLabel>
            <br />
            <input

              type="text"
              name="username"
              // value={profileEdits.username}
              // onChange={(e)=>editProfile(e)}
              placeholder={user.username || user.user_name}
              className="input-xlarge"
              readOnly
            />
            <hr />

            <IonLabel>First Name</IonLabel>
            <br />
            <input
              type="text"
              name="first_name"
              value={profileEdits.first_name}
              onChange={(e) => editProfile(e)}
              placeholder={user.first_name}
              className="input-xlarge"
            />
            <hr />

            <IonLabel>Last Name</IonLabel>
            <br />
            <input
              type="text"
              name="last_name"
              value={profileEdits.last_name}
              onChange={(e) => editProfile(e)}
              placeholder={user.last_name}
              className="input-xlarge"
            />
            <hr />

            <IonLabel>Email</IonLabel>
            <br />
            <input
              type="text"
              name="email"
              value={profileEdits.email}
              onChange={(e) => editProfile(e)}
              placeholder={user.email}
              className="input-xlarge"
            />
            <hr />

            <div>
              {!loading ? <IonButton color="success" expand="block" onClick={() => saveChanges()}>
                Update
              </IonButton> :

                <div className="spin"><IonSpinner color="success">Loading</IonSpinner></div>
              }
            </div>
          </form>
        ) : (
          <p></p>
        )}
      </div>

      {/* ************** shows Password tab *************** */}
      <div>
        {showPassword ? (
          <form id="tab2">
            <IonLabel>New Password</IonLabel> <br />
            <input type="password" className="input-xlarge" value={password} onChange={(e) => changePassword(e)} />
            <div>
              {!loading ? <IonButton color="success" expand="block" onClick={() => savePassword()}>
                Update
              </IonButton> : <div className="spin"><IonSpinner color="success">Loading</IonSpinner></div>
              }
            </div>
          </form>
        ) : (<p></p>)}
      </div>
    </span>
  );
};

export default connector(UserProfile);
