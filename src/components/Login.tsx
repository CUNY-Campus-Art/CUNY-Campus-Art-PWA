/*

Login.tsx -  Login/ Logout components

- If user is already signed in, displays a logout button
- If user is not signed in, Login form is displayed, as well a link to Sign Up form for user who has not signed up yet

*/
import './Login.css'
import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { RootState } from '../store'
import { fetchUser, logout } from '../store/user'
import { rerenderArtDisplays, resetArtDisplays } from '../store/artdisplay'
import { IonText, IonButton, IonCard } from '@ionic/react';
const backendUrl = "https://dev-cms.cunycampusart.com";

const providersNames = [
  'google'
];

const LogoutButton = (props: any) => <IonButton color="dark" onClick={props.onClick} className="btn login_btn">Logout</IonButton>;

const mapLogin = (state: RootState|any) => {
  return {
    name: 'login',
    displayName: 'Login',
    fields: [
      { name: 'email', label: 'Username/ Email', type: 'text' },
      { name: 'password', label: 'Password', type: 'password' }],
    campuses: state.general.campuses,
    currentUser: state.user.user,
    error: state.user.error
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    async handleSubmit(evt: any) {
      evt.preventDefault()
      if (evt.target) {
        const email = evt.target.email.value
        const password = evt.target.password.value
        let status = await dispatch(fetchUser(email, password))
        return status //if -1, login didn't go through
      }
    },
    logout: () => dispatch(logout()),
    rerenderArtDisplays: (userInfo: any) => dispatch(rerenderArtDisplays(userInfo)),
    resetArtDisplays: () => dispatch(resetArtDisplays())
  }
}

const AuthForm = (props: any) => {

  let currentUser = props.currentUser;
  const { name, displayName, handleSubmit, error } = props

  // When user logs out, user removed from Local Storage and from redux store and art displays are cleared
  const logout = (e: Event) => {
    e.preventDefault();
    props.logout()
    props.resetArtDisplays()
  };

  return (<span>

    { !!currentUser ? <LogoutButton onClick={logout} /> :
      <div>
        <p>{'Log in to save your progress!'}</p>

        {/* Displays Login in form (username/ email) */}
        {error ? <IonCard className="error-box"><IonText>{error}</IonText></IonCard>: ''}
        <form onSubmit={handleSubmit} name={name} className="form-group">

          {props.fields.map((field: any, index: any) =>
            <div key={index}>
              <label htmlFor={field.name}>
                <small>{field.label}</small>
              </label>
              <input name={field.name} type={field.type} className="form-control" />
            </div>
          )}
          <br />
          <button type="submit" className="btn btn-primary btn-block">{displayName}</button>

        </form>

        <IonText> Don't have an account? <Link to="/Signup">Sign Up</Link></IonText>

      </div>
    }
  </span>);

}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)

export interface AuthForm {
  name: string
  displayName: string
  handleSubmit: () => void
  error: string
}
