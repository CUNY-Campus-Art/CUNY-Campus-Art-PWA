/*
Signup.tsx
This contains the Signup component.
Collects username, email, first name, last name, campus, and profile picture from user.
Makes use of the React Hook Form library to have values persist even after other items on form is updated.
To Dos: To add Form Validations. Once database values are updated, will have profile picture and campus id added to database as well.
*/

import React, { useState, useContext, useCallback } from 'react';
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

// const providersNames = [
//   'google'
// ];

const mapSignup = (state: RootState) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    campuses: state.general.campuses
  }
}


const mapDispatch = (dispatch: any) => {
  return {
    signupNewUser: (email: string, pw: string, username: string, firstName: string, lastName: string, campusId: any, file: any = '') => dispatch(signupNewUser(email, pw, username, firstName, lastName, campusId, file)),
    loginUser: (username: string, password: string) => dispatch(fetchUser(username, password)),
    getAllCampuses: () => dispatch(fetchAllCampuses()),

  }
}

const AuthForm = (props: any) => {
  if (!props.campuses) props.getAllCampuses();
  //To redirect to Profile tab using forward animation
  const { navigate } = useContext(NavContext);
  const redirect = useCallback(
    () => navigate('/Profile', 'back'),
    [navigate]
  );

  const SignupSchema = yup.object().shape({
    username: yup.string().required().min(5).max(20),
    email: yup.string().required().email(),
    fullName: yup.string().required().min(5).max(32),
    password: yup.string().required().min(5),
    "password-verification": yup.string().oneOf([yup.ref('password'), ''], 'Passwords must match')
  });

  const formFields: InputProps[] = [
    { name: 'username', label: 'Username', autocapitalize: 'off', component: <IonInput type="text" /> },
    { name: 'fullName', label: 'Full Name', autocapitalize: 'on', component: <IonInput type="text" /> },
    { name: 'email', label: 'Email', autocapitalize: 'off', component: <IonInput type="email" /> },
    {
      name: 'password', label: 'Password', autocapitalize: 'off',
      component: <IonInput type="password" clearOnEdit={false} />
    },
    {
      name: 'password-verification', label: 'Verify Password', autocapitalize: 'off',
      component: <IonInput type="password" clearOnEdit={false} />
    },
  ]

  // Code to make use of React Hook Forms, so values persist even after changing value on dropdown menu
  let formValues: any = {
    email: '',
    username: '',
    fullName: ''
  }

  const { control, handleSubmit, errors } = useForm({
    defaultValues: formValues,
    validationSchema: SignupSchema,
    mode: 'onBlur',
    reValidateMode: 'onChange'
  });



  // This value will correspond to an id from the Database that matches up with campus
  const [selectedCampus, setSelectedCampus] = useState<string>();

  const [imgData, setImgData] = useState(null);

  // This is passed to the ImageUpload Component so that the file info can be retrieved  here
  const getImgFileInfoParent = (fileInfo: any) => {
    setImgData(fileInfo);
    console.log(fileInfo)
  }

  // Form invokes handlesSubmit1, updates local form values, and sends info to database to sign up user
  const handleSubmit1 = async (evt: any) => {
    evt.preventDefault()
    handleSubmit(evt)

    if (evt.target) {

      formValues.email = evt.target.email.value
      formValues.password = evt.target.password.value
      formValues.username = evt.target.username.value
      formValues.fullName = evt.target.fullName.value

      // Splits up name and capitalizes first letters
      let nameHolder = formValues.fullName.split(' ').map((name: string) => name.length > 1 ? `${name[0].toUpperCase()}${name.slice(1)}` : name.length === 1 ? `${name[0].toUpperCase()}` : '')
      let firstName = nameHolder[0];
      let lastName = nameHolder.length > 1 ? nameHolder.slice(1).join(' ') : '';

      let result = await props.signupNewUser(formValues.email, formValues.password, formValues.username, firstName, lastName, selectedCampus, imgData)

      //If user sucessfully signs up, have user logged in, and redirected to Profile tab
      if (result) {
        await props.loginUser(formValues.username, formValues.password);
        redirect();
      }
    }
  }

  return (<IonPage>
    <IonHeader>
      <IonToolbar></IonToolbar>

      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/Profile" />
        </IonButtons>
        <IonTitle className="ion-text-end">Sign Up</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>

      <form onSubmit={handleSubmit1}>

        {/* Upload Profile Picture - We pass the Image Upload component the getImgFileInfoParent function so Signup component can retrieve the image file */}
        <IonItem >
          <label className="custom-input-label" >Upload Profile Picture: </label>
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
          <IonLabel>Campus</IonLabel>
          <IonSelect
            interfaceOptions={{ cssClass: 'my-custom-interface' }}
            interface="popover"
            multiple={false}
            placeholder=""
            onIonChange={e => setSelectedCampus(e.detail.value)}
            value={selectedCampus}
          >
            {props.campuses ? props.campuses.map((campus: any, index: any) =>
              <IonSelectOption key={index} value={campus.id}>{campus.campus_name}</IonSelectOption>
            ) : ''}
          </IonSelect>
        </IonItem>

        {/* Submit Button */}
        <IonButton expand="block" type="submit" className="ion-margin-top">
          Sign Up
        </IonButton>

      </form>


    </IonContent>
  </IonPage>)
}


export const Signup = connect(mapSignup, mapDispatch)(AuthForm)


export interface AuthForm {
  name: string
  displayName: string
  handleSubmit: () => void
  error: Error
}
