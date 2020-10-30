/*

AuthForm container houses Login (and Signup) components, if user is not signed in. And switches to Logout component, if user is signed in. Also, checks to see if user was previously signed in based on localStorage. If so, it sets the user info again in the redux store.

Source Code based on:
https://github.com/strapi/strapi-examples/blob/master/login-react/src/pages/Home.js
https://github.com/FullstackAcademy/boilermaker/blob/master/client/components/auth-form.js
*/

import React, { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store'
import { getUser, removeUser, fetchUser, loginAndGetToken } from '../store/user'
import { Login, Signup } from './AuthForm'

const backendUrl = "https://dev-cms.cunycampusart.com";

const LogoutButton = (props: any) => <button onClick={props.onClick}>Logout</button>;

const mapState = (state: RootState) => ({
  currentUser: state.user.user
})

const mapDispatch = (dispatch: any) => ({
  getUser: (userInfo:any) => dispatch(getUser(userInfo)),
  removeUser: (userInfo:any) => dispatch(removeUser(userInfo))
})

const connector = connect(mapState, mapDispatch)


type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}

// const useStateWithLocalStorage = (localStorageKey:string) => {
//   const [value, setValue] = React.useState(
//     localStorage.getItem(localStorageKey) || ''
//   );

//   React.useEffect(() => {
//     localStorage.setItem(localStorageKey, value);
//   }, [value]);

//   return [value, setValue];
// };

const AuthFormContainer = (props:Props) => {
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem('user'));


    // useEffect(() => {
    //   if(localStorage.getItem('user')) {
    //       const user = JSON.parse(String(localStorage.getItem('user')));
    //         props.getUser(user)
    //   }
    //  }, []);

    console.log(props.currentUser, "AYOOOOO")
  // Checks whether user has been logged in previously. If so, retrieves, user info based on local storage.


  // let currentUser = props.currentUser;

  // If user was previously logged in, we will reset the user info, since it gets wiped on refresh


  // Removes user from Local Storage and from the Redux store
  const logout = (e: Event) => {
    e.preventDefault();
    localStorage.clear();
    props.removeUser(props.currentUser)
    setIsLogged(false);
    //also remove user via redux
  };

  let buttons;

  if (!isLogged) {
    buttons = <LogoutButton onClick={logout} />;
  }
    let text;

    if (props.currentUser) {
      text = `Welcome ${localStorage.getItem('username')}, you are connected!`;
    } else {
      text = 'You are not connected. Please log in.';
    }


    return (<div>
      <p>{text}</p>
      <div>
        <Login />
      </div>
    </div>);

}


export default connector(AuthFormContainer);
