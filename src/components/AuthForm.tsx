/*
Source Code based on:
https://github.com/strapi/strapi-examples/blob/master/login-react/src/pages/Home.js
https://github.com/FullstackAcademy/boilermaker/blob/master/client/components/auth-form.js
*/

import React, { useState } from 'react';
import {connect} from 'react-redux';
import { RootState } from '../store'
import { fetchUser, loginAndGetToken } from '../store/user'

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
    error: state.user.error
  }
}

const mapSignup = (state:any) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}


const mapDispatch = (dispatch:any) => {
  return {
    handleSubmit(evt: any) {
      evt.preventDefault()
      if (evt.target) {
        const email = evt.target.email.value
        const password = evt.target.password.value
        dispatch(fetchUser(email, password))
      }
    }
  }
}

const AuthForm = (props:any) => {
  const {name, displayName, handleSubmit, error} = props

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
        <form onSubmit={handleSubmit} name={name}>
          <div>
            <label htmlFor="email">
              <small>Email</small>
            </label>
            <input name="email" type="text" />
          </div>
          <div>
            <label htmlFor="password">
              <small>Password</small>
            </label>
            <input name="password" type="password" />
          </div>
          <div>
            <button type="submit">{displayName}</button>
          </div>
          {error && error.response && <div> {error.response.data} </div>}
        </form>

        <a href="/auth/google">{displayName} with Google</a>
      </div>
    {buttons}
  </div>);
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)


export interface AuthForm {
  name: string
  displayName: string
  handleSubmit: () => void
  error: Error
}
