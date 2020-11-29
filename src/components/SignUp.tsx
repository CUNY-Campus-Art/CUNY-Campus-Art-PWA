/*

Signup.tsx

This contains the Signup component.

Collects username, email, first name, last name, campus, and profile picture from user.

Makes use of the React Hook Form library to have values persist even after other items on form is updated.

To Dos: To add Form Validations

*/

import React, { useState, useContext, useCallback} from 'react';
import { NavContext } from '@ionic/react';
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
import { signupNewUser } from '../store/user'
import { useForm, Controller } from "react-hook-form";
import Input, { InputProps } from './input'
import { object, string } from 'yup';

const backendUrl = "https://dev-cms.cunycampusart.com";

const providersNames = [
  'google'
];

const mapSignup = (state: RootState) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    fields: [
      { name: 'username', label: 'Username*', type: 'text' },
      { name: 'firstName', label: 'First Name*', type: 'text' },
      { name: 'lastName', label: 'Last Name', type: 'text' },
      { name: 'email', label: 'Email*', type: 'email' },
      { name: 'password', label: 'Password*', type: 'password' },
      { name: 'password-verification', label: 'Verify Password*', type: 'password' },
    ],
    campuses: state.general.campuses
    //error: state.user.error
  }
}


const mapDispatch = (dispatch: any) => {
  return {
    signupNewUser: (email: string, pw: string, username: string, firstName: string, lastName: string, file: any = '') => dispatch(signupNewUser(email, pw, username, firstName, lastName, file))
  }
}

const AuthForm = (props: any) => {

    //To redirect to Information tab using forward animation
    const { navigate } = useContext(NavContext);
    const redirect = useCallback(
      () => navigate('/Profile', 'back'),
      [navigate]
    );

  // const validationSchema = object().shape({
  //   email: string().required().email(),
  //   fullName: string().required().min(5).max(32),
  //   password: string().required().min(8),
  // });
  // const { control, handleSubmit, errors } = useForm({
  //   validationSchema,
  // });


  const registerUser = (data: any) => {
    console.log("creating a new user account with: ", data);
  };

  /* When Sign up component is set up, need to come back to this and make sure user is directed to profile page if already logged in */
  const [isLogged, setIsLogged] = useState(!!props.currentUser);
  console.log(isLogged)


  let text;


  const [listCampuses, setListCampuses] = useState<string[]>([]);

  //This value will correspond to an id from the Database that matches up with campus
  const [selectedCampus, setSelectedCampus] = useState<string>();

  const [imgData, setImgData] = useState(null);

  // This is passed to the ImageUpload Component so that the file info can be retrieved  here
  const getImgFileInfoParent = (fileInfo: any) => {
    setImgData(fileInfo);
  }

  // Code to make use of React Hook Forms, so values persist even after changing value on dropdown menu
  let formValues: any = {
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
  }

  const { control, register, handleSubmit, errors, formState } = useForm({
    defaultValues: formValues
  });

  const [data, setData] = useState();

  const onSubmit = (data: any) => {
    alert(JSON.stringify(data, null, 2));
    setData(data);
  };

  // Form invokes handlesSubmit1, updates local form values, and sends info to database to sign up user
  const handleSubmit1 = (evt: any) => {
    evt.preventDefault()
    if (evt.target) {

      formValues.email = evt.target.email.value
      formValues.password = evt.target.password.value
      formValues.username = evt.target.username.value
      formValues.firstName = evt.target.firstName.value
      formValues.lastName = evt.target.lastName.value

      // imgData, selectedCampus:  values we still need to send to database somehow
      let result = props.signupNewUser(formValues.email, formValues.password, formValues.username, formValues.firstName, formValues.lastName, imgData)

      //If user sucessfully signs up is redirected to Profile tab
      if(result) redirect();
    }
  }

  return (
    <IonPage className="container-fluid">
      <IonHeader>
      <IonToolbar></IonToolbar>

        <IonToolbar>
          <IonButtons slot="start">
          <IonBackButton defaultHref="/Profile" />
          </IonButtons>
          <IonTitle slot="primary" className="ion-text-center">Sign Up</IonTitle>
          </IonToolbar>
      </IonHeader>
      <IonContent>

        <div>
          <form onSubmit={handleSubmit1}>

            {/* Upload Profile Picture */}
            <IonItem >
              <label className="custom-input-label" >Upload Profile Picture: </label>
              <ImageUpload getImgFileInfoParent={getImgFileInfoParent} />
            </IonItem>


            {/* Maps through and lists email, username, firstName, lastName, password, and verify password */}
            {props.fields.map((field: any, index: any) =>
              <div key={index}>

                <IonItem className="custom-input">
                  <IonLabel className="custom-input-label" >{field.label}</IonLabel>
                  <IonInput
                    name={field.name}
                    type={field.type}
                  >
                  </IonInput>
                </IonItem>
                <br />
              </div>
            )}

            {/* Campus Drop Down Menu */}
            <IonItem id="campus-menu">
              <IonLabel>Campus*</IonLabel>
              <IonSelect
                interfaceOptions={{ cssClass: 'my-custom-interface' }}
                interface="popover"
                multiple={false}
                placeholder=""
                onIonChange={e => setSelectedCampus(e.detail.value)}
                value={selectedCampus}
              >
                {props.campuses.map((campus: any, index: any) =>
                  <IonSelectOption key={index} value={campus.id}>{campus.campus_name}</IonSelectOption>
                )}
              </IonSelect>
            </IonItem>

            {/* Submit Button */}
            <IonButton expand="block" type="submit" className="ion-margin-top">
              Sign Up
        </IonButton>

          </form>

        </div>
      </IonContent>
    </IonPage>);
}


export const Signup = connect(mapSignup, mapDispatch)(AuthForm)


export interface AuthForm {
  name: string
  displayName: string
  handleSubmit: () => void
  error: Error
}
