/**
 * UserProfile.tsx - UserProfile display component displays the specific user's information if they are logged in.
 */

import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../store";
import { getUser, fetchUser, editUserThunk } from "../store/user";
import "./UserProfile.css";
import { uploadArtworkThunk } from "../store/artdisplay";
import defaultProfilePicture from "../assets/images/default-profile-pic-2.png"

import {
    IonButton,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonInput,
    IonLabel,
    IonItem,
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonList,
    IonItemDivider,
    IonTitle,
    IonTextarea,
    IonIcon,
    IonSelect,
    IonSelectOption,

    IonText,
    IonToast,
    IonSegment,
    IonSegmentButton,
    IonSpinner
} from "@ionic/react";

/* Retrieves current user from the State */
const mapState = (state: RootState) => ({
    currentUser: state.user.user,
    campus: state.user.user.campus,
    campuses: state.general.campuses

});

const mapDispatch = (dispatch: any) => ({
    uploadArtwork: (artwork: any, pic: any) => dispatch(uploadArtworkThunk(artwork, pic))
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    // backgroundColor: string
};



const UploadArtwork = (props: Props) => {


    const [artwork, setArtwork] = useState<any>({
        title: '',
        artist: '',
        description: '',
        year: ''
    })

    const [pic, setPic] = useState<File>();


    const openFileDialog = () => {
        (document as any).getElementById("file-upload").click();
    };

    const setImage = (_event: any) => {
        let f = _event.target.files![0];
        console.log(f)
        setPic(f);
     
    }

    const saveArtwork = () => {
        console.log(artwork);
        props.uploadArtwork(artwork, pic);
    }



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>IonInput Examples</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>

                    <IonItem>
                        <IonLabel position="stacked">Title</IonLabel>
                        <IonInput name="title" value={artwork.title} onIonChange={(e) => setArtwork({ ...artwork, title: e.detail.value })}> </IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Artist</IonLabel>
                        <IonInput name="artist" value={artwork.artist} onIonChange={(e) => setArtwork({ ...artwork, artist: e.detail.value })}> </IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Description</IonLabel>
                        <IonTextarea name="description" value={artwork.description} onIonChange={(e) => setArtwork({ ...artwork, description: e.detail.value })} ></IonTextarea>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Year</IonLabel>
                        <IonInput name="year" value={artwork.year} onIonChange={(e) => setArtwork({ ...artwork, year: e.detail.value })}> </IonInput>
                    </IonItem>
                    <input
                        type="file"
                        id="file-upload"
                        style={{ display: "none" }}
                        onChange={setImage}
                    />
                    <IonItem id="campus-menu">
          <IonLabel>Campus</IonLabel>
          <IonSelect
            interfaceOptions={{ cssClass: 'my-custom-interface' }}
            //interface="popover"
            multiple={false}
            placeholder=""
           // onIonChange={}
            //value={}
          >
            {props.campuses ? props.campuses.map((campus: any, index: any) =>
              <IonSelectOption key={index} value={campus.id}>{campus.campus_name}</IonSelectOption>
            ) : ''}
          </IonSelect>
        </IonItem>

                    <IonButton onClick={openFileDialog}>
                        Upload Image
                    </IonButton>

                    <IonButton onClick={saveArtwork}>
                        Save
                    </IonButton>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default connector(UploadArtwork);
