/*
Login component. It contains a link to the Signup component.

This Login component will:


*/

import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { RootState } from '../store'
import { fetchUser } from '../store/user'
import { IonText } from '@ionic/react';

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

      {/* Displays Login in form (username/ email) */}
      <form onSubmit={handleSubmit} name={name} className="form-group">

        {props.fields.map((field: any) =>
          <div>
            <label htmlFor={field.name}>
              <small>{field.label}</small>
            </label>
            <input name={field.name} type={field.type} className="form-control" />
          </div>
        )}
        <br />
        <button type="submit" className="btn btn-primary btn-block">{displayName}</button>
        {error && error.response && <div> {error.response.data} </div>}
      </form>

          <IonText> Don't have an account? <Link to="/Signup">Sign Up</Link></IonText>
      {/* Possibly add this later when adding option to login with google and other providers*/}
      {/* <a href="/auth/google">{displayName} with Google</a> {buttons}*/}
    </div>

  </div >);
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)

export interface AuthForm {
  name: string
  displayName: string
  handleSubmit: () => void
  error: Error
}
