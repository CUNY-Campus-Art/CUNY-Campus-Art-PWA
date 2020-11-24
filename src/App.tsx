import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonHeader,
  IonToolbar,
  IonButton,
  IonTitle, IonGrid, IonRow, IonCol, IonItemDivider
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

//import Home from './pages/Home';
import Gallery from './pages/Gallery';
import ScanQR from './pages/ScanQR';
import Information from './pages/Information';
import Profile from './pages/Profile';
import ScavengerHunt from './pages/ScavengerHunt';
import { images, home, person, qrCodeOutline, menu, informationCircle, map } from 'ionicons/icons';

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


const App: React.FC = () => (
  <IonApp>
    <IonHeader className= "CUNY-title" >

          <IonToolbar>
          <IonTitle className="ion-text-center CUNY-title"> CUNY Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/ScavengerHunt" component={ScavengerHunt} exact={true}/>
          <Route path="/ScanQR" component={ScanQR} exact={true}/>
          {/* <Route path="/Home" component={Home} exact={true} /> */}
          <Redirect from="/cuny-campus-art-" to="/Gallery" />
          <Redirect from="/cuny-campus-art-:id" to="/Gallery" />
          <Route path="/Gallery" component={Gallery} exact={true} />
          <Route path="/Information" component={Information} exact={true}/>
          <Route path="/Profile" component={Profile} exact={true}/>
          <Route path="/" render={() => <Redirect to="/ScanQR" />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="ScavengerHunt" href="/ScavengerHunt">
            <IonIcon icon={map} />
            <IonLabel>Scavenger Hunt</IonLabel>
          </IonTabButton>
          <IonTabButton tab="ScanQR" href="/ScanQR">
            <IonIcon icon={qrCodeOutline} />
            <IonLabel>Scan</IonLabel>
          </IonTabButton>
          <IonTabButton tab="Gallery" href="/Gallery">
            <IonIcon icon={images} />
            <IonLabel>Gallery</IonLabel>
          </IonTabButton>
          {/* <IonTabButton tab="Home" href="/Home">
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton> */}
          <IonTabButton tab="Information" href="/Information">
            <IonIcon icon={informationCircle} />
            <IonLabel>Information</IonLabel>
          </IonTabButton>
          <IonTabButton tab="Profile" href="/Profile">
            <IonIcon icon={person} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>


        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
