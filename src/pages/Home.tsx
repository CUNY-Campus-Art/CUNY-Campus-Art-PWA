// Home Page currently holds information about the application and some dummy data
//This tab is responsive, on large screen ths rows show data in 2 columns and only 1
//colum on smaller screens.

import React from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <IonPage className="container-fluid">
      <IonHeader>
        <IonToolbar></IonToolbar>

        <IonToolbar>
          <IonTitle className="ion-text-center">About CUNY Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard className="alt-bkgd">
          <IonGrid>
            <IonRow>
              <div className="col-lg-4 text-center">
                <img
                  src={require("../assets/images/QR-Icon.png")}
                  className="img-fluid card-imgs"
                  alt="scan-qr"
                />
              </div>

              <div className="col-lg-6 order-lg-2 text-lg-left ">
                <h3 className="About-title">What is CUNY Gallery?</h3>
                <hr />
                <p>

                CUNY Gallery is an app that showcases CUNY students' artwork
                in an acccessible way through the scanning of QR codes located on
                the artwork.

 
                  {" "}
                  CUNY Gallery was created to showcase CUNY students' artwork in
                  an accessible way through the scanning of QR codes located on artwork
                  throughout different campuses. Students can submit their artwork and information
                  using our form site and can be showcased on our application.
                </p>
              </div>
            </IonRow>
          </IonGrid>
        </IonCard>

        <IonCard>
          <IonGrid>
            <IonRow>
              <div className="col-lg-5 text-center order-lg-2">
                <img
                  src={require("../assets/images/gallery-today.png")}
                  className="img-fluid card-img-today"
                  alt="today"
                />
              </div>

              <div className="col-lg-6 text-lg-left ">
                <h3 className="About-title">CUNY Gallery Today</h3>
                <hr />
                <p>
                  Today, this application is still under development and we are
                  working tirelessly to bring the application to production. We
                  are aiming to create a seamless and accessible experience for
                  users. So far, we have implemented QR Scanning connected to
                  our database.
                </p>
              </div>
            </IonRow>
          </IonGrid>
        </IonCard>

        <IonCard className="alt-bkgd">
          <IonGrid>
            <IonRow>
              <div className="col-lg-4 text-center">
                <img
                  src={require("../assets/images/team-img.png")}
                  className="img-fluid card-imgs rounded-circle"
                  alt="scan-qr"
                />
              </div>

              <div className="col-lg-6 order-lg-2 text-lg-left text-center">
                <h3 className="About-title">Our Team</h3>
                <hr />
                <p>
                  {" "}
                  CUNY Gallery was created to showcase CUNY students' artwork in
                  an accessible way through the scanning of QR codes. Lorem
                  ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                  enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
              </div>
            </IonRow>
          </IonGrid>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
