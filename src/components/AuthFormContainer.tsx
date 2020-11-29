/*

AuthForm container houses Login (and the Signup) components.

Checks to see if user was previously signed in based on localStorage. If so, it sets the user info again in the redux store.

This Authform container will:
- If user is already signed in, displays a logout button
- If user is not signed in, Login form is displayed, as well a link to Sign Up form for user who has not signed up yet

Source Code based on:
https://github.com/strapi/strapi-examples/blob/master/login-react/src/pages/Home.js
https://github.com/FullstackAcademy/boilermaker/blob/master/client/components/auth-form.js
*/

import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import './AuthFormContainer.css'
import { RootState } from '../store'
import { getUser, logout, fetchUser } from '../store/user'
import { Login } from './Login'
import { Signup } from './Signup'
import { IonButton } from '@ionic/react';
import { rerenderArtDisplays, resetArtDisplays } from '../store/artdisplay'

const backendUrl = "https://dev-cms.cunycampusart.com";

const LogoutButton = (props: any) => <button onClick={props.onClick} className="btn login_btn">Logout</button>;

const mapState = (state: RootState) => ({
  currentUser: state.user.user,
  authToken: state.user.authToken,
  campuses: state.general.campuses
})

const mapDispatch = (dispatch: any) => ({
  getUser: (userInfo:any) => dispatch(getUser(userInfo)),
  logout: () => dispatch(logout()),
  rerenderArtDisplays: (userInfo:any) => dispatch(rerenderArtDisplays(userInfo)),
  resetArtDisplays: () => dispatch(resetArtDisplays())
})

const connector = connect(mapState, mapDispatch)


type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}



const AuthFormContainer = (props:Props) => {


  let currentUser = props.currentUser;
  let authToken = props.authToken;


  // If user was previously logged in, we will reset the user info, since it gets wiped on refresh


  // Removes user from Local Storage and from the Redux store
  const logout = (e: Event) => {
    e.preventDefault();

    props.logout()
    props.resetArtDisplays()
    // setIsLogged(false);
    //also remove user via redux
  };

  useEffect (() => {
    props.rerenderArtDisplays([currentUser, authToken])
  })

  let button;
  console.log(currentUser, "logout testing proximity")
  if (currentUser) {

    button = <LogoutButton onClick={logout} />;
  }
     let text;

    if (currentUser) {
      // text = `Welcome ${currentUser.first_name}, you are connected!`;
    } else {
      text = 'Log in to save your progress!';
    }

    return (

       <div>
       {text}
        {currentUser ? button:<Login campuses={props.campuses} />}
     </div>);

}


export default connector(AuthFormContainer);

