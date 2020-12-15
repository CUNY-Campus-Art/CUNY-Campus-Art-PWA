import React, {useState} from "react";
import { getUser, logout, fetchUser } from '../store/user'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../store'
import {
  IonCard,
  IonCol,
  IonGrid,
  IonImg,
  IonItem,
  IonLabel,
  IonProgressBar,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonThumbnail,
} from "@ionic/react";
import './HuntStatus.css';

const mapState = (state: RootState) => ({
    currentUser: state.user.user,
    campus: state.user.user.campus,
    campuses: state.general.campuses
  })

const mapDispatch = (dispatch: any) => ({
  fetchUser: (username: string, pw: string) => dispatch(fetchUser(username, pw)),
  getUser: (user: any) => dispatch(getUser(user)),
})

const connector = connect(mapState, mapDispatch)


type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}


const HuntStatus = () => {  
    const [showUserStatus, setShowUserStatus] = useState(true);
    const [showSolvedClues, setShowSolvedClues] = useState(false);
    const handleUserStatus = () => {
      setShowUserStatus(true);
      setShowSolvedClues(false);
    };
    const handleSolvedClues= () => {
      setShowSolvedClues(true);
      setShowUserStatus(false);
    };
      return (
          <div>
        <IonCard>
            <IonGrid>
                <IonRow>
                    <IonCol size="4">
                        
                            <img
                            className=" img-shape" 
                            src= 
                            {require("../assets/images/christopher-campbell-rDEOVtE7vOs-unsplash.jpg")} 
                            alt="profile" />  
                        
                    </IonCol>
                    <IonCol className="text-left" size="8">
                        <h3 className="statusTitle">Status: <IonText color="success">Beginner</IonText></h3>
                        <h4 className="statusTitle">Total Points:<IonText color="success"> 50 points</IonText></h4>
                        <br/>
                        <IonProgressBar color="success" value={0.5}></IonProgressBar>
                        <IonText color="success">0</IonText>
                        <IonText color="danger" className="statusbar-end">100</IonText>
                    </IonCol>
                </IonRow>
            </IonGrid>
                
        </IonCard>
        <IonSegment scrollable className="segment-color" value={showUserStatus ? "levels" : "solved"}  >
                <IonSegmentButton value="levels" onClick={handleUserStatus}>
                    <IonLabel className="segment-color">Levels</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="solved" onClick={handleSolvedClues}>
                    <IonLabel className="segment-color" >Solved Clues</IonLabel>
                </IonSegmentButton>
            </IonSegment>
            {/* ************** shows status levels *************** */}
            <div>{showUserStatus? (
                <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonItem>
                        <img
                        src={require("../assets/images/Beginner.png")}
                        className="img-fluid ribbon-size"
                        alt="beginner ribbon"
                        />
                        <IonText color="success"><h4>BEGINNER: 0-100 Points</h4></IonText>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                        <img
                        src={require("../assets/images/Intermediate.png")}
                        className="img-fluid ribbon-size"
                        alt="intermediate ribbon"
                        />
                        <IonText color="danger"><h4>INTERMEDIATE: 100-200 Points</h4></IonText>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                        <img
                            src={require("../assets/images/expert.png")}
                            className="img-fluid ribbon-size"
                            alt="expert ribbon"
                        />
                        <IonText color="warning"><h4>EXPERT: 200+ Points</h4></IonText>
                        </IonItem>
                    </IonCol>
                </IonRow>
            </IonGrid>

            ) : (<p></p>)}</div>

            {/* ************** shows solved clues of User *************** */}
            <div> {showSolvedClues ? (
                <IonCard>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="3">
                                <IonThumbnail>
                                    <img 
                                    src={require("../assets/images/bluesClues.png")}
                                    alt="solved artwork"
                                    />
                                </IonThumbnail>
                            </IonCol>
                            <IonCol size="6">
                                Clue: Above a Brown Bench where Books are stored
                            </IonCol>
                            <IonCol size="3">
                                Pts Earned: 50
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonCard>
               
               ) : (<p></p>)}</div>

        </div>
    )

}

export default HuntStatus;