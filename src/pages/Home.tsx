// Home Page currently holds information about the application and some dummy data
//This tab is responsive, on large screen ths rows show data in 2 columns and only 1
//colum on smaller screens.

import React, {useState} from "react";
import { connect, ConnectedProps } from 'react-redux'
import {
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  // IonImg,
  // IonItemSliding,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Home.css";
import { images, informationCircle, map, qrCode } from "ionicons/icons";
import { RootState } from '../store'

const mapState = (state: RootState) => ({
  campuses: state.general.campuses,
  currentArtDisplay: state.artDisplay.currentArtDisplay
})

const mapDispatch = {

}

const connector = connect(mapState, mapDispatch)

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}

const Home = (props: Props) => {

  const[showMembers, setShowMembers] = useState(false);
  const handleShowMembers= ()=>{
    showMembers ? setShowMembers(false) : setShowMembers(true);
  }
  return (
    <IonPage className="container-fluid">
      <IonHeader>


        <IonToolbar></IonToolbar>

        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size="3">
              <img
              className="headerImg"
              src={require("../assets/images/QR-Icon.png")}
              alt="scan-qr"
                />
              </IonCol>
              <IonCol size="9">
                <IonRow>
              <IonTitle className="headerTitle"> <strong>EXPLORE & DISCOVER</strong> </IonTitle>
              </IonRow>
                <IonRow>
              <IonTitle className="headerTitle"><strong>Artwork Around You!</strong></IonTitle>
                </IonRow>
                <IonRow>
              <IonText className='headerText'>
                CUNY spans 25 campuses across 5 boroughs for a combined total
                of 275,000 students.<br/>
                Scan the QR codes located on artwork throughout your campus to
                explore and discover new and upcoming artists.
              </IonText>
              </IonRow>

              </IonCol>
            </IonRow>
        {/* <IonTitle className="ion-text-right">About CUNY Gallery</IonTitle>

          <img
        className="headerImg"
        src={require("../assets/images/QR-Icon.png")}
        alt="scan-qr"
                /> */}
        </IonGrid>

        </IonToolbar>

      </IonHeader>
      <IonContent>
        <IonCard className="alt-bkgd" href="/ScanQR">
          <IonGrid>
            <IonRow>
              <div className="col-sm-4 text-center">
                <img
                  src={require("../assets/images/artwork-example.png")}
                  className="img-fluid card-imgs"
                  alt="scan-qr"
                />
              </div>

              <div className="col-sm-7 order-sm-2 text-sm-left ">
                <h3 className="About-title"> <IonIcon size="large" icon={qrCode}/> Scan - Explore Student's Artwork</h3>

                <p>

                CUNY Gallery is an app that showcases CUNY students' artwork
                in an acccessible way through the scanning of QR codes located on
                the artwork.


                  {" "}

                  CUNY Gallery was created to showcase CUNY students' artwork in
                  an accessible way through the scanning of QR codes located on artwork
                  throughout different campuses. Students can submit their artwork and information
                  using our form site and can be showcased on our application.

                  Start at the Scan tab/page to begin scanning QR codes located
                  on artwork throughout CUNY Campuses.
                </p>
              </div>
            </IonRow>
          </IonGrid>
        </IonCard>

        <IonCard href="/Gallery">
          <IonGrid>
            <IonRow>
              <div className="col-sm-5 text-center order-sm-2">
                <img
                  src={require("../assets/images/gallery-example.png")}
                  className="img-fluid card-img-today"
                  alt="today"
                />
              </div>

              <div className="col-sm-6 text-sm-left ">
                <h3 className="About-title"><IonIcon size="large" icon={images}/> Gallery</h3>

                <p>
                  Grow your own personal gallery! Previously scanned artwork will
                  appear here. Remove artwork you no longer want in your gallery
                  and like your favorites!

                </p>
              </div>
            </IonRow>
          </IonGrid>
        </IonCard>

        <IonCard className="alt-bkgd" href="/Information">
          <IonGrid>
            <IonRow>
              <div className="col-sm-4 text-center">
                <img
                  src={require("../assets/images/info-example.png")}
                  className="img-fluid card-imgs"
                  alt="scan-qr"
                />
                {/* <IonIcon size="large" icon={informationCircle}>

                </IonIcon> */}
              </div>

              <div className="col-sm-6 order-sm-2 text-sm-left ">
                <h3 className="About-title"><IonIcon size="large" icon={informationCircle}/> Information</h3>

                <p>
                  {" "}
                  Explore the details of the artwork.
                  Get the Name of the Artwork, Artist Name, and Artist insights on
                  their piece.
                </p>
              </div>
            </IonRow>
          </IonGrid>
        </IonCard>

        <IonCard href="/ScavengerHunt">
          <IonGrid>
            <IonRow >
              <div className="col-sm-5 text-center order-sm-2">
                <img
                  src={require("../assets/images/scavenge-example.png")}
                  className="img-fluid card-img-today"
                  alt="today"
                />


              </div>

              <div className="col-sm-6 text-sm-left ">
                <h3 className="About-title"><IonIcon size="large" icon={map}/> Scavenger Hunt</h3>

                <p>

                  Discover Art & Your Campus. <br/>
                  Test your detective abilities! Try and find specific Artwork
                  around your campus using the clues provided.

                </p>
              </div>
            </IonRow>
          </IonGrid>
        </IonCard>

        <IonCard className="alt-bkgd">
          <IonGrid>
            <IonRow>
              <div className="col-sm-4 text-center">
                <img
                  src={require("../assets/images/team-img.png")}
                  className="img-fluid card-imgs rounded-circle"
                  alt="scan-qr"
                />
                {/* <IonIcon size="large" icon={informationCircle}>

                </IonIcon> */}
              </div>

              <div className="col-sm-6 order-sm-2 text-sm-left text-center">
                <h3 className="About-title"> About Us </h3>

                <p>
                  This application was created by a team of 4 CUNY Brooklyn Computer Science students formed by
                  Professor Devorah Kletenik. <br/>

                  { showMembers ?
                  (
                  <div>

                  <img
                  src={require("../assets/images/Arielle.png")}
                  className="img-fluid card-imgs rounded-circle"
                  alt="scan-qr"
                /><br/>
                  Arielle Watson - Data Entry Website <br/>
                  <img
                  src={require("../assets/images/Ahmed.png")}
                  className="img-fluid card-imgs rounded-circle"
                  alt="scan-qr"
                /><br/>
                  Ahmed Chowdhury - Database/CMS <br/>
                  <img
                  src={require("../assets/images/Jamila.png")}
                  className="img-fluid card-imgs rounded-circle"
                  alt="scan-qr"
                /><br/>
                  Jamila Toaha - Backend Dev. <br/>
                  <img
                  src={require("../assets/images/Mary.png")}
                  className="img-fluid card-imgs rounded-circle"
                  alt="scan-qr"
                /><br/>
                  Mary Leong - Frontend Dev. <br/>
                  <IonButton color="danger" onClick={handleShowMembers}>Close</IonButton>
                   </div>)
                  : (<IonButton onClick={handleShowMembers}>Show Team</IonButton>) }

                </p>
              </div>
            </IonRow>
          </IonGrid>
        </IonCard>
        <IonCard className="alt-bkgd">
          <div className="text-center">
          <h3 className="About-title"> Contact Us </h3>
          Any question or comments? Please feel free to email us at cunycampusart@gmail.com
          </div>

        </ IonCard>

      </IonContent>
    </IonPage>
  );
};

export default connector(Home);
