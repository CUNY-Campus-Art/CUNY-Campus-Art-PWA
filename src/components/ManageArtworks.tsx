

import React, { useState, useContext, useCallback, useEffect } from 'react';
import { IonTextarea, NavContext } from '@ionic/react';
import {
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTitle, IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonText,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol
} from "@ionic/react";
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store'

import ImageUpload from './HelperComponents/ImageUpload'
import './Signup.css'
import { signupNewUser, fetchUser } from '../store/user'
import { fetchAllCampuses } from '../store/general'
import { useForm } from "react-hook-form";
import Input, { InputProps } from './HelperComponents/Input'
import * as yup from 'yup';
import { uploadArtworkThunk } from "../store/artdisplay";
import { ArtworkCard } from './UploadedArtworkCard';





const createItems = (title: any, year: any, artist: any, description: any, primary_image: any, qr_image: any) => {
    return {
        title,
        year,
        artist,
        description,
        primary_image,
        qr_image
    }
}

const items = [
    createItems("The Scream", "1893", "Edvard Munch", "this is a description of an artwork", { url: "https://cuny-campus-art-bucket.s3.amazonaws.com/Screen_Shot_2022_04_25_at_9_47_19_AM_619a4f4ecd.png" }, { url: "https://cuny-campus-art-bucket.s3.amazonaws.com/cuny_campus_art_265_0167b84248.png" }),
    createItems("The Scream", "1893", "Edvard Munch", "this is a description of an artwork", { url: "https://cuny-campus-art-bucket.s3.amazonaws.com/Screen_Shot_2022_04_25_at_9_47_19_AM_619a4f4ecd.png" }, { url: "https://cuny-campus-art-bucket.s3.amazonaws.com/cuny_campus_art_265_0167b84248.png" }),
    createItems("The Scream", "1893", "Edvard Munch", "this is a description of an artwork", { url: "https://cuny-campus-art-bucket.s3.amazonaws.com/Screen_Shot_2022_04_25_at_9_47_19_AM_619a4f4ecd.png" }, { url: "https://cuny-campus-art-bucket.s3.amazonaws.com/cuny_campus_art_265_0167b84248.png" }),
    createItems("The Scream", "1893", "Edvard Munch", "this is a description of an artwork", { url: "https://cuny-campus-art-bucket.s3.amazonaws.com/Screen_Shot_2022_04_25_at_9_47_19_AM_619a4f4ecd.png" }, { url: "https://cuny-campus-art-bucket.s3.amazonaws.com/cuny_campus_art_265_0167b84248.png" }),
    createItems("The Scream", "1893", "Edvard Munch", "this is a description of an artwork", { url: "https://cuny-campus-art-bucket.s3.amazonaws.com/Screen_Shot_2022_04_25_at_9_47_19_AM_619a4f4ecd.png" }, { url: "https://cuny-campus-art-bucket.s3.amazonaws.com/cuny_campus_art_265_0167b84248.png" }),



]


const mapState = (state: RootState) => {
    return {
        campuses: state.general.campuses,
        uploadedArtwork: state.artDisplay.uploaded_artworks,
        currentUser: state.user.user,

    }
}


const mapDispatch = (dispatch: any) => {
    return {
        uploadArtwork: (artwork: any, pic: any) => dispatch(uploadArtworkThunk(artwork, pic))
    }
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  // backgroundColor: string
};

const ManageArtworks = (props: any) => {
    const user = props.currentUser;
    console.log(user);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (props.currentUser && props.currentUser.uploaded_artworks) {
            setLoading(false);
            console.log(props.currentUser.uploaded_artworks)
        }

        console.log("effect")



    }, [props.currentUser])

    //for campuses dropdown
    // if (!props.campuses) props.getAllCampuses();
    //To redirect to Profile tab using forward animation
    // const { navigate } = useContext(NavContext);
    // const redirect = useCallback(
    //     () => navigate('/Profile', 'back'),
    //     [navigate]
    // );




    //evt.preventDefault()
    //handleSubmit(evt)

    // if (evt.target) {

    //   formValues.email = evt.target.email.value
    //   formValues.password = evt.target.password.value
    //   formValues.username = evt.target.username.value
    //   formValues.fullName = evt.target.fullName.value

    //   // Splits up name and capitalizes first letters
    //   let nameHolder = formValues.fullName.split(' ').map((name: string) => name.length > 1 ? `${name[0].toUpperCase()}${name.slice(1)}` : name.length === 1 ? `${name[0].toUpperCase()}` : '')
    //   let firstName = nameHolder[0];
    //   let lastName = nameHolder.length > 1 ? nameHolder.slice(1).join(' ') : '';

    //   let result = await props.signupNewUser(formValues.email, formValues.password, formValues.username, firstName, lastName, selectedCampus, imgData)

    //   //If user sucessfully signs up, have user logged in, and redirected to Profile tab
    //   if (result) {
    //     await props.loginUser(formValues.username, formValues.password);
    //     redirect();
    //   }
    // }


    return (
        <div>
            <IonPage>
                <IonHeader>
                    <IonToolbar></IonToolbar>

                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/Profile" />
                        </IonButtons>
                        <IonTitle className="ion-text-end">Manage Your Artworks</IonTitle>
                    </IonToolbar>
                </IonHeader>




                <IonContent>

                    <IonGrid>
                        <IonRow>





                        </IonRow>
                        <IonRow>
                            <IonCol>
                             

                              


                                    {(props.currentUser && props.currentUser.uploaded_artworks) ? 
                                    props.currentUser.uploaded_artworks.map((item: any) => (
                                        <ArtworkCard artwork={item}>
                                        </ArtworkCard> )) : <></>}
 




                             


                            </IonCol>
                        </IonRow>
                        <IonRow>

                        </IonRow>





                    </IonGrid>
                </IonContent>





            </IonPage>
        </div>)
}

export default connector(ManageArtworks)




export interface AuthForm {
    name: string
    displayName: string
    handleSubmit: () => void
    error: Error
}
