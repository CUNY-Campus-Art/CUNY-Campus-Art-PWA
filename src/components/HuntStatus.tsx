import React from "react";
import {
  IonCard,
  IonCol,
  IonGrid,
  IonImg,
  IonItem,
  IonProgressBar,
  IonRow,
} from "@ionic/react";
import './HuntStatus.css';

const HuntStatus = () => {  
      return (
        <IonCard>
            <IonGrid>
                <IonRow>
                    <IonCol className=" col-md-4 text-center">
                        <IonItem>
                            <IonImg src= {require("../assets/images/christopher-campbell-rDEOVtE7vOs-unsplash.jpg")} className="img-fluid level-border" alt="scan-qr" />  
                        </IonItem>
                    </IonCol>
                    <IonCol className="text-center">
                        <h3 className="About-title">Beginner</h3>
                        <h4>100 points</h4>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonProgressBar color="primary" value={0.5}></IonProgressBar>
                            <br />
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <h4>50 points to Intermediate!</h4>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <h3>BEGINNER: 0-150 Points</h3>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <h4>INTERMEDIATE: 150-250 Points</h4>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <h3>EXPERT: +250 Points</h3>
                        </IonItem>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonCard>
    )

}

export default HuntStatus;