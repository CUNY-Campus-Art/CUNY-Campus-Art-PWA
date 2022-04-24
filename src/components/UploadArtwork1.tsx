/*
UploadArtwork1.tsx
This contains the Upload Artwork component.
Collects title, artist, description, year, campus, and primary image for the artwork to be uploaded.
Has form validation 
*/

import React, { useState, useContext, useCallback } from 'react';
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
import { connect } from 'react-redux';
import { RootState } from '../store'

import ImageUpload from './HelperComponents/ImageUpload'
import './Signup.css'
import { signupNewUser, fetchUser } from '../store/user'
import { fetchAllCampuses } from '../store/general'
import { useForm } from "react-hook-form";
import Input, { InputProps } from './HelperComponents/Input'
import * as yup from 'yup';
import { uploadArtworkThunk } from "../store/artdisplay";
import { CardExamples } from './UploadedArtwork';

// const providersNames = [
//   'google'
// ];

const mapSignup = (state: RootState) => {
    return {
        campuses: state.general.campuses,
        uploadedArtwork: state.artDisplay.uploadedArtwork
    }
}


const mapDispatch = (dispatch: any) => {
    return {
        uploadArtwork: (artwork: any, pic: any) => dispatch(uploadArtworkThunk(artwork, pic))
    }
}

const UploadArtwork1 = (props: any) => {
    //for campuses dropdown
    if (!props.campuses) props.getAllCampuses();
    //To redirect to Profile tab using forward animation
    // const { navigate } = useContext(NavContext);
    // const redirect = useCallback(
    //     () => navigate('/Profile', 'back'),
    //     [navigate]
    // );

    const ArtworkSchema = yup.object().shape({
        title: yup.string().required("Title can not be empty").min(1).max(100),
        artist: yup.string().required("Artist can not be empty").min(1).max(100),
        description: yup.string().required("Description is required"),
        //year is a string since backend throws an error if it's a number
        year: yup.string().required("Year is required"),

    });

    const formFields: InputProps[] = [
        { name: 'title', label: 'Title', autocapitalize: 'off', component: <IonInput type="text" /> },
        { name: 'artist', label: 'Artist', autocapitalize: 'on', component: <IonInput type="text" /> },
        { name: 'description', label: 'Description', autocapitalize: 'off', component: <IonTextarea /> },
        { name: 'year', label: 'Year', autocapitalize: 'off', component: <IonInput type="number" /> },
    ]

    // Code to make use of React Hook Forms, so values persist even after changing value on dropdown menu
    let formValues: any = {

    }

    const { control, handleSubmit, errors } = useForm({
        //defaultValues: formValues,
        validationSchema: ArtworkSchema,
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });



    // This value will correspond to an id from the Database that matches up with campus
    const [selectedCampus, setSelectedCampus] = useState<string>();

    const [campusSelected, setCampusSelected] = useState(true);

    const [imgData, setImgData] = useState(null);

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState(false);

    // This is passed to the ImageUpload Component so that the file info can be retrieved  here
    const getImgFileInfoParent = (fileInfo: any) => {
        setImgData(fileInfo);
        console.log(fileInfo)
    }

    const changeCampus = (e: any) => {
        setSelectedCampus(e.detail.value);
        setCampusSelected(true);

    }

    const uploadNewArtwork = () => {
        setSuccess(false);
    }

    // Form invokes handlesSubmit1, updates local form values, and sends info to database to add new artwork
    const handleSubmit1 = async (evt: any) => {
        console.log(evt);
        console.log(imgData);
        console.log(selectedCampus)
        //field validation for campus
        if (selectedCampus == undefined) {
            setCampusSelected(false);

        }
        else {
            setLoading(true);
            let obj = { ...evt }
            obj.campus = selectedCampus;
            let res = await props.uploadArtwork(obj, imgData);
            setLoading(false);
            if (res.status == 200) {
                setSuccess(true);
            }
        }


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
    }

    return (
        <div>
            <IonPage>
                <IonHeader>
                    <IonToolbar></IonToolbar>

                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/Profile" />
                        </IonButtons>
                        <IonTitle className="ion-text-end">Upload New Artwork</IonTitle>
                    </IonToolbar>
                </IonHeader>

                {!success ?
                    <IonContent>

                        <form onSubmit={handleSubmit(handleSubmit1)}>

                            {/* Upload Primary Artwork Image */}
                            <IonItem >
                                <label className="custom-input-label" >Upload Primary Image: </label>
                                <ImageUpload getImgFileInfoParent={getImgFileInfoParent} />
                            </IonItem>


                            {/* Maps through and lists title, description, year, artist*/}
                            {formFields.map((field: any, index: any) =>
                                <div key={index}>
                                    <Input {...field} control={control} key={index} errors={errors} />
                                </div>
                            )}

                            {/* Campus Drop Down Menu */}
                            <br />
                            <IonItem id="campus-menu">
                                {/* TO-DO: improve validation */}
                                <IonLabel>Campus (Required)</IonLabel>
                                <IonSelect
                                    interfaceOptions={{ cssClass: 'my-custom-interface' }}
                                    //interface="popover"
                                    multiple={false}
                                    placeholder=""
                                    onIonChange={e => changeCampus(e)}
                                    value={selectedCampus}
                                >
                                    {props.campuses ? props.campuses.map((campus: any, index: any) =>
                                        <IonSelectOption key={index} value={campus.id}>{campus.campus_name}</IonSelectOption>
                                    ) : ''}
                                </IonSelect>
                            </IonItem>
                            {campusSelected ? <></> :
                                <IonText color="danger" className="ion-padding-start">
                                    <small>
                                        <span role="alert">
                                            Please select your campus
                                        </span>
                                    </small>
                                </IonText>}


                            {!loading ?

                                <IonButton expand="block" type="submit" className="ion-margin-top">
                                    UPLOAD
                                </IonButton>
                                :

                                <div className="spin"><IonSpinner color="success">Loading</IonSpinner></div>

                            }

                        </form>




                    </IonContent> :

                    <IonContent>

                    <IonGrid>
                        <IonRow>


                            <IonCol style={{ "text-align": "center" }}>

                                Artwork Uploaded Successfully!

                            </IonCol>




                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <CardExamples artwork={props.uploadedArtwork}>
                                </CardExamples>

                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol style={{ "text-align": "center" }}>
                                <IonButton onClick={() => uploadNewArtwork()}>Upload Another Artwork</IonButton>


                            </IonCol>
                        </IonRow>





                    </IonGrid>
                    </IonContent>

                }



            </IonPage>
        </div>)
}


export const UploadArtworkNew = connect(mapSignup, mapDispatch)(UploadArtwork1)


export interface AuthForm {
    name: string
    displayName: string
    handleSubmit: () => void
    error: Error
}
