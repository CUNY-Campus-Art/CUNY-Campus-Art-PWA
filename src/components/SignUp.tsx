/*
This contains the Login and Signup component.

Source Code based on:
https://github.com/strapi/strapi-examples/blob/master/login-react/src/pages/Home.js
https://github.com/FullstackAcademy/boilermaker/blob/master/client/components/auth-form.js
*/

import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonText,
  IonInput,
  IonButton,
  IonCheckbox,
  IonItem,
  IonLabel,
} from "@ionic/react";
import {connect} from 'react-redux';
import { fetchUser } from '../store/user'
import { useForm } from "react-hook-form";
import Input, { InputProps } from './input'
import { object, string } from 'yup';

const backendUrl = "https://dev-cms.cunycampusart.com";

const providersNames = [
  // 'github',
  // 'facebook',
  'google',
  // 'twitter',
  // 'discord',
  // 'twitch',
  // 'instagram,
];


const LoginButton = (props:any) => <a href={`${backendUrl}/connect/${props.providerName}`}>
    <button style={{ width: '150px' }}>Connect to {props.providerName}</button>
  </a>;

const LogoutButton = (props:any) => <button onClick={props.onClick}>Logout</button>;


const mapLogin = (state:any) => {
  return {
    name: 'login',
    displayName: 'Login',
    fields: [
      {name: 'email', label: 'Username/ Email', type: 'text'},
      {name: 'first-name', label: 'First Name:', type: 'text'},
      {name: 'last-name', label: 'Last Name:', type: 'text'},
      {name: 'password', label: 'Choose a Password', type: 'password'},
      {name: 'password-verification', label: 'Verify Password', type: 'password'}
    ],
    error: state.user.error
  }
}

const mapSignup = (state:any) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    fields: [
      {name: 'username', label: 'Username', type: 'text'},
      {name: 'email', label: 'Email', type: 'email'},
      {name: 'password', label: 'Password', type: 'password'},
      {name: 'password-verification', label: 'Verify Password', type: 'password'},
      {name: 'campus', label: 'Your Campus', type: 'text'},
      {name: 'profile-picture', label: 'Profile Picture', type: 'text'}
    ],
    error: state.user.error
  }
}


const mapDispatch = (dispatch:any) => {
  return {
    // handleSubmit(evt: any) {
    //   evt.preventDefault()
    //   if (evt.target) {
    //     const email = evt.target.email.value
    //     const password = evt.target.password.value
    //     dispatch(fetchUser(email, password))
    //   }
    // }
  }
}

const AuthForm = (props:any) => {
  const validationSchema = object().shape({
    email: string().required().email(),
    fullName: string().required().min(5).max(32),
    password: string().required().min(8),
  });
  const { control, handleSubmit, errors } = useForm({
    validationSchema,
  });

  const formFields: InputProps[] = [
    {
      name: "email",
      component: <IonInput type="email" />,
      label: "Email",
    },
    {
      name: "fullName",
      label: "Full Name",
    },
    {
      name: "password",
      component: <IonInput type="password" clearOnEdit={false} />,
      label: "Password",
    },
  ];

  const registerUser = (data: any) => {
    console.log("creating a new user account with: ", data);
  };




  //const {name, displayName, handleSubmit, error} = props

  const [isLogged, setIsLogged] = useState(!!props.currentUser);
  console.log(isLogged)

  //take this out
  const logout = (e: Event) => {
    e.preventDefault();
    localStorage.clear();
    setIsLogged(false);
  };

  let buttons;

  if (isLogged) {
    buttons = <LogoutButton onClick={logout} />;
  } else {
    buttons = <ul style={{ listStyleType: 'none' }}>
      {providersNames.map((providerName, i) => <li key={providerName}>
        <LoginButton providerName={providerName}/>
        </li>)}
    </ul>;
  }

  let text;

  // if (isLogged) {
  //   text = `Welcome ${localStorage.getItem('username')}, you are connected!`;
  // } else {
  //   text = 'You are not connected. Please log in.';
  // }

  return (<div>
    <p>{text}</p>
    <div>
    <form onSubmit={handleSubmit(registerUser)}>

        {props.fields.map((field: any) =>
          <div>
            <input name={field.name} type={field.type} className="form-control" placeholder={field.label} />
            <br />
          </div>
        )}


            <IonButton expand="block" type="submit" className="ion-margin-top">
              Sign Up
            </IonButton>
          </form>

        {/* Possibly add this later when adding option to login with google and other providers*/}

        {/* <a href="/auth/google">{displayName} with Google</a> {buttons}*/}
      </div>

  </div>);
}


export const Signup = connect(mapSignup, mapDispatch)(AuthForm)


export interface AuthForm {
  name: string
  displayName: string
  handleSubmit: () => void
  error: Error
}
