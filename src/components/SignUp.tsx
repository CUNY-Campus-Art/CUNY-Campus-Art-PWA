/*

Signup.tsx

This contains the Signup component.

Collects username, email, first name, last name, campus, and profile picture from user.

Makes use of the React Hook Form library to have values persist even after other items on form is updated.

To Dos: To add Form Validations. Once database values are updated, will have profile picture and campus id added to database as well.

*/

import React, { useState, useContext, useCallback, useEffect} from 'react';
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
  IonCard
} from "@ionic/react";
import { connect } from 'react-redux';
import { RootState } from '../store'

import ImageUpload from './HelperComponents/ImageUpload'
import './Signup.css'
import { signupNewUser, fetchUser } from '../store/user'
import { fetchAllCampuses } from '../store/general'
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
      { name: 'username', label: 'Username', type: 'text' },
      { name: 'fullName', label: 'Full Name', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'password', label: 'Password', type: 'password' },
      { name: 'password-verification', label: 'Verify Password', type: 'password' },
    ],
    campuses: state.general.campuses
    //error: state.user.error
  }
}


const mapDispatch = (dispatch: any) => {
  return {
    signupNewUser: (email: string, pw: string, username: string, firstName: string, lastName: string, file: any = '') => dispatch(signupNewUser(email, pw, username, firstName, lastName, file)),
    loginUser: (username:string, password:string) => dispatch(fetchUser(username, password)),
    getAllCampuses: () => dispatch(fetchAllCampuses()),

  }
}

const AuthForm = (props: any) => {
    if(!props.campuses)  props.getAllCampuses();
    //To redirect to Profile tab using forward animation
    const { navigate } = useContext(NavContext);
    const redirect = useCallback(
      () => navigate('/Profile', 'back'),
      [navigate]
    );

  const validationSchema = object().shape({
    email: string().required().email(),
    fullName: string().required().min(5).max(32),
    password: string().required().min(8),
  });
  // const { control, handleSubmit, errors } = useForm({
  //   validationSchema,
  // });


  const registerUser = (data: any) => {
    console.log("creating a new user account with: ", data);
  };

  /* When Sign up component is set up, need to come back to this and make sure user is directed to profile page if already logged in */
  const [isLogged, setIsLogged] = useState(!!props.currentUser);
  console.log(isLogged)


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
    fullName: ''
  }

  const { control, register, handleSubmit, errors, formState } = useForm({
    defaultValues: formValues,
    validationSchema,
    reValidateMode: 'onChange'
  });

  const [data, setData] = useState();

  const onSubmit = (data: any) => {
    alert(JSON.stringify(data, null, 2));
    setData(data);
  };

  // Form invokes handlesSubmit1, updates local form values, and sends info to database to sign up user
  const handleSubmit1 = async (evt: any) => {
    evt.preventDefault()
    if (evt.target) {

      formValues.email = evt.target.email.value
      formValues.password = evt.target.password.value
      formValues.username = evt.target.username.value
      formValues.fullName = evt.target.fullName.value

      let nameHolder = formValues.fullName.split(' ')
      let firstName = nameHolder[0];
      let lastName =  nameHolder.length> 1 ? nameHolder.slice(1).join(' '): '';
      // imgData, selectedCampus:  values we still need to send to database somehow
      let result = await props.signupNewUser(formValues.email, formValues.password, formValues.username, firstName, lastName, imgData)

      //If user sucessfully signs up, have user logged in, and redirected to Profile tab
      //Once Profile Picture Upload is resolved. Should be able to replace result with result.sucess. For now result is based on whether con.user has a value (logic set in the user store)
        if(result) {
          await props.loginUser(formValues.username, formValues.password);
          redirect();
        }
    }
  }
    // <IonPage className="container-fluid">     </IonPage>);

    // Manually setting up validation schema and style
    const validStyle = {
      borderBottom: '2px solid #00FF00'
    }

    const invalidStyle = {
      borderBottom: '2px solid #FF0000'
    }

      //checkUserName makes sure that the passwords dont' have special characters aside from the underscore. [^a-zA-z0-9_]

  let checkUsernameValue:any;
  const checkUsername = (value:any) => {

    let regex = /\W+/;
    // let userName = document.getElementById('user-name');
      if(value && !regex.test(value))
        checkUsernameValue = ''
      else
        checkUsernameValue = 'Username can only include: A-Z, 0-9, and _'
  }

  // const checkPasswords= () => {
  //   let password1 = document.getElementById('password-1')
  //   let password2 = document.getElementById('password-2')
  //   console.log('TESTING' + password1.value)

  //   if(password1.value !== password2.value)
  //     return 'Passwords Don\'t Match';
  //   else
  //     return '';
  // }


  return ( <IonPage>
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

            {/* Upload Profile Picture - We pass the Image Upload component the getImgFileInfoParent function so that it can be invoked and Signup component can retrieve the image file */}
            <IonItem >
              <label className="custom-input-label" >Upload Profile Picture: </label>
              <ImageUpload getImgFileInfoParent={getImgFileInfoParent} />
            </IonItem>


            {/* Maps through and lists email, username, firstName, lastName, password, and verify password */}
            {props.fields.map((field: any, index: any) =>
              <div key={index}>

                <IonItem className="custom-input">
                  <IonLabel  position="floating" className="custom-input-label" >{field.label}</IonLabel>
                  <IonInput
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    onIonChange={ field.name === 'username' ? e => checkUsername(e.detail.value!): ()=>{}}
                    style = {field.name !== 'username' ? {} : checkUsernameValue ? validStyle : invalidStyle }
                  >
                  </IonInput>
                </IonItem>
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
                  ): ''}
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
