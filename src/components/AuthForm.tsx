/*
This contains the Login and Signup component.

Source Code based on:
https://github.com/strapi/strapi-examples/blob/master/login-react/src/pages/Home.js
https://github.com/FullstackAcademy/boilermaker/blob/master/client/components/auth-form.js
*/

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store'
import { fetchUser } from '../store/user'

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


const LoginButton = (props: any) => <a href={`${backendUrl}/connect/${props.providerName}`}>
  <button style={{ width: '150px' }}>Connect to {props.providerName}</button>
</a>;

const LogoutButton = (props: any) => <button onClick={props.onClick}>Logout</button>;


const mapLogin = (state: any) => {
  return {
    name: 'login',
    displayName: 'Login',
    fields: [
      { name: 'email', label: 'Username/ Email', type: 'text' },
      { name: 'password', label: 'Password', type: 'password' }],
    error: state.user.error
  }
}

const mapSignup = (state: any) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    fields: [
      { name: 'username', label: 'Username', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'password', label: 'Password', type: 'password' },
      { name: 'campus', label: 'Your Campus', type: 'text' },
      { name: 'profile-picture', label: 'Profile Picture', type: 'text' }
    ],
    error: state.user.error
  }
}


const mapDispatch = (dispatch: any) => {
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

const AuthForm = (props: any) => {
  const { name, displayName, handleSubmit, error } = props

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
        <LoginButton providerName={providerName} />
      </li>)}
    </ul>;
  }

  let text;

  return (<div>
    <p>{text}</p>
    <div>

      <form onSubmit={handleSubmit} name={name} className="form-group">

        {props.fields.map((field: any) =>
          <div>
            <label htmlFor={field.name}>
              <small>{field.label}</small>
            </label>
            <input name={field.name} type={field.type} className="form-control" />
          </div>
        )}
        <br/>
        <button type="submit" className="btn btn-primary btn-block">{displayName}</button>
        {error && error.response && <div> {error.response.data} </div>}
      </form>

      {/* Possibly add this later when adding option to login with google and other providers*/}
      {/* <a href="/auth/google">{displayName} with Google</a> {buttons}*/}
    </div>

  </div >);
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)


export interface AuthForm {
  name: string
  displayName: string
  handleSubmit: () => void
  error: Error
}
