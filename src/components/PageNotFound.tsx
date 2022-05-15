import "./PageNotFound.css";
import React from "react";
import { Link } from "react-router-dom";
import { IonPage } from "@ionic/react";
import pageNotFoundImage from "../assets/images/404-image.jpeg";

interface ContainerProps {
  name: string;
}

const PageNotFound: React.FC<ContainerProps> = () => (
  <IonPage className="container-fluid" id="page-not-found">
    <img src={pageNotFoundImage} alt="404 Oops! Page Not Found" />
    <h2>Oops! Page Not Found</h2>
    <div> Maybe you wanted these links instead: </div>
    <Link to="/ScanQR">Scan an artwork</Link>
    <Link to="/Profile"> See your profile</Link>
    <Link to="/Upload">Upload an artwork</Link>
  </IonPage>
);
export default PageNotFound;
