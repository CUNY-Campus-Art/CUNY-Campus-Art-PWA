/*
Signup.tsx
This contains the Signup component.
Collects username, email, first name, last name, campus, and profile picture from user.
Makes use of the React Hook Form library to have values persist even after other items on form is updated.
To Dos: To add Form Validations. Once database values are updated, will have profile picture and campus id added to database as well.
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
    IonText
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

// const providersNames = [
//   'google'
// ];

const mapSignup = (state: RootState) => {
    return {
        campuses: state.general.campuses
    }
}


const mapDispatch = (dispatch: any) => {
    return {
        uploadArtwork: (artwork: any, pic: any) => dispatch(uploadArtworkThunk(artwork, pic))
    }
}

const UploadArtwork1 = (props: any) => {
    if (!props.campuses) props.getAllCampuses();
    //To redirect to Profile tab using forward animation
    const { navigate } = useContext(NavContext);
    const redirect = useCallback(
        () => navigate('/Profile', 'back'),
        [navigate]
    );

    const SignupSchema = yup.object().shape({
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
        validationSchema: SignupSchema,
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });



    // This value will correspond to an id from the Database that matches up with campus
    const [selectedCampus, setSelectedCampus] = useState<string>();

    const [campusSelected, setCampusSelected] = useState(true);

    const [imgData, setImgData] = useState(null);

    // This is passed to the ImageUpload Component so that the file info can be retrieved  here
    const getImgFileInfoParent = (fileInfo: any) => {
        setImgData(fileInfo);
        console.log(fileInfo)
    }

    const changeCampus = (e: any ) =>{
        setSelectedCampus(e.detail.value);
        setCampusSelected(true);

    }

    // Form invokes handlesSubmit1, updates local form values, and sends info to database to sign up user
    const handleSubmit1 = async (evt: any) => {
        console.log(evt);
        console.log(imgData);
        console.log(selectedCampus)
        if(selectedCampus==undefined){
            setCampusSelected(false);
            
        }
        else{
            let obj = {...evt}
            obj.campus = selectedCampus;
            props.uploadArtwork(obj, imgData);
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

    return (<IonPage>
        <IonHeader>
            <IonToolbar></IonToolbar>

            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton defaultHref="/Profile" />
                </IonButtons>
                <IonTitle className="ion-text-end">Upload New Artwork</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>

            <form onSubmit={handleSubmit(handleSubmit1)}>

                {/* Upload Profile Picture - We pass the Image Upload component the getImgFileInfoParent function so Signup component can retrieve the image file */}
                <IonItem >
                    <label className="custom-input-label" >Upload Primary Image: </label>
                    <ImageUpload getImgFileInfoParent={getImgFileInfoParent} />
                </IonItem>


                {/* Maps through and lists email, username, firstName, lastName, password, and verify password */}
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
            


                {/* Submit Button */}
                <IonButton expand="block" type="submit" className="ion-margin-top">
                    UPLOAD
                </IonButton>

            </form>


        </IonContent>
    </IonPage>)
}


export const UploadArtworkNew = connect(mapSignup, mapDispatch)(UploadArtwork1)


export interface AuthForm {
    name: string
    displayName: string
    handleSubmit: () => void
    error: Error
}
