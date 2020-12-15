import React, {useEffect} from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonRouterLink,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonHeader,
  IonToolbar,
  IonText,
  IonImg,
  IonButton,
  IonTitle, IonGrid, IonRow, IonCol, IonItemDivider
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Link } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from './store'
import {fetchAllCampuses } from './store/general'

//import Home from './pages/Home';
import Home from './pages/Home'
import Gallery from './pages/Gallery';
import ScanQR from './pages/ScanQR';
import Information from './pages/Information';
import Profile from './pages/Profile';
import ScavengerHunt from './pages/ScavengerHunt';

import { images, home, person, qrCodeOutline, menu, informationCircle, map } from 'ionicons/icons';
import { Signup } from './components/Signup'



/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import './pages/Profile.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './App.css';

/* Redux store - load essential variables when app initially loads, like user status, general store info, like all campuses, etc */
const mapState= (state: RootState) => ({
    currentUser: state.user.user, // if user is logged in will have a value
    campuses: state.general.campuses
    //error: state.user.error
})

const mapDispatch = (dispatch: any) => ({
   getAllCampuses: () => dispatch(fetchAllCampuses()),
})

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}

const App = (props: Props) => {
  useEffect(() => { props.getAllCampuses(); }, []);
  return (
    <IonApp>
      <IonReactRouter>
        <IonHeader >
              <link rel="preconnect" href="https://fonts.gstatic.com" />
<link href="https://fonts.googleapis.com/css2?family=Clicker+Script&display=swap" rel="stylesheet" />
          <IonToolbar className="top-bar" >

          <IonText className="ion-text-center CUNY-title">CUNY <span style={{fontFamily: 'Clicker Script', fontWeight: 'bolder', fontSize: '1em', color: 'red'}}>Gallery</span></IonText>
{/*
          <IonTabs>
          <IonRouterOutlet>
          <Route path="/Profile" component={Profile} exact={true} />
          </IonRouterOutlet> */}

          <Link to="/Profile" slot="end">
              {/* Greet User By Name if logged in */}
               {/* <IonText className="ion-text-end">Hi {props.currentUser.first_name}!</IonText> */}

               {/* If user is logged in and has a profile picture set up, display profile picture as Profile Icon */}
              {props.currentUser && props.currentUser.profile_picture ? <IonImg style={{height: '2em', width: '2em'}} src={props.currentUser.profile_picture.url} /> : <IonIcon color= "medium" icon={person} />}
            </Link>
          {/* </IonTabs> */}
          </IonToolbar>
        </IonHeader>

        <IonTabs>
          <IonRouterOutlet>
            <Route path="/Home" component={Home} exact={true} />
            <Redirect from="/cuny-campus-art-" to="/Home" />
            <Redirect from="/cuny-campus-art-:id" to="/Home" />
            <Route path="/Profile" component={Profile} exact={true} />
            <Route path="/Signup" routerDirection="back" component={Signup} exact={true} />
            <Route path="/Gallery" component={Gallery} exact={true} />
            <Route path="/ScanQR" component={ScanQR} exact={true} />
            <Route path="/Information" component={Information} exact={true} />
            <Route path="/ScavengerHunt" component={ScavengerHunt} exact={true} />
            <Route path="/" render={() => <Redirect to="/ScanQR" />} exact={true} />
          </IonRouterOutlet>
          {/* <IonTabBar slot="top">
             <IonTabButton tab="Profile" href="/Profile">
              <IonIcon icon={person} />
              <IonLabel>Profile</IonLabel>
            </IonTabButton>
           </IonTabBar> */}
          <IonTabBar slot="bottom">
            <IonTabButton tab="Home" href="/Home">
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="Gallery" href="/Gallery">
              <IonIcon icon={images} />
              <IonLabel>Gallery</IonLabel>
            </IonTabButton>
            <IonTabButton tab="ScanQR" href="/ScanQR">
              <IonIcon icon={qrCodeOutline} />
              <IonLabel>Scan</IonLabel>
            </IonTabButton>
            <IonTabButton tab="Information" href="/Information">
              <IonIcon icon={informationCircle} />
              <IonLabel>Information</IonLabel>
            </IonTabButton>

            <IonTabButton tab="ScavengerHunt" href="/ScavengerHunt">
              <IonIcon icon={map} />
              <IonLabel>Scavenger Hunt</IonLabel>
            </IonTabButton>

          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );

}

export default connector(App);
