// Scavenger hunt screen with clues and segment buttons
import "./UploadAndManageArtworks.css";
import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../store";
import { getUser, fetchUser, initializeUser } from "../store/user";
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
import { UploadArtworkNew } from "./UploadArtwork1"; //clues list component
import ManageArtworks from "./ManageArtworks"; //user status component

const mapState = (state: RootState, ownProps: any) => ({ ...ownProps });

const mapDispatch = (dispatch: any) => ({});

const UploadAndManageArtworksContainer = (props: any) => {
  // Loads clues when component initially mounts
  useEffect(() => {
    if (user) props.initializeUser(props.currentUser);
  }, []);

  let user = props.currentUser;
  let mode = props.mode;
  // Set clues tab default to opened

  const [showUploader, setShowUploader] = useState(
    mode === "upload" ? true : false
  );
  const [showManager, setShowManager] = useState(
    mode === "manage" ? true : false
  );

  const [artwork, setArtworkFromManager] = useState({});

  const handleUploader = () => {
    setShowUploader(true);
    setShowManager(false);
  };
  const handleManager = () => {
    setShowManager(true);
    setShowUploader(false);
  };

  return (
    <IonPage className="container-fluid">
      <IonHeader>
        <IonToolbar></IonToolbar>

        <IonToolbar>
          <IonSegment value={showUploader ? "upload" : "manage"}>
            <IonSegmentButton value="upload" onClick={handleUploader}>
              <IonLabel>Upload Artwork</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="manage" onClick={handleManager}>
              <IonLabel>Manage Artworks</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* value sets checked segment button based on which is clicked */}

        {/* ************** shows Clues for scavenger hunt *************** */}
        {showUploader ? (
          <UploadArtworkNew
            {...props}
            handleUploader={handleUploader}
            handleManager={handleManager}
            artwork={artwork}
          />
        ) : (
          <p></p>
        )}
        {/* ************** shows Status for scavenger hunt of User *************** */}
        {showManager ? (
          <ManageArtworks
            {...props}
            handleUploader={handleUploader}
            handleManager={handleManager}
            setArtworkFromManager={setArtworkFromManager}
          />
        ) : (
          <p></p>
        )}
      </IonContent>
    </IonPage>
  );
};

export const UploadAndManageArtworks = connect(
  mapState,
  mapDispatch
)(UploadAndManageArtworksContainer);
