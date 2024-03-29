
// HuntStatus component includes user status on the scavenger hunt :
// user profile picture, status level, total points, status bar.
// Also includes info about different status level and
// clues that the user has previously solved
import React, {useState, useContext, useCallback}  from "react";
import { IonImg, NavContext } from '@ionic/react';
import { getUser, fetchUser } from '../store/user'
import { changeCurrentArtDisplay } from '../store/artdisplay'
import { connect, ConnectedProps } from 'react-redux'
import defaultProfilePicture from "../assets/images/default-profile-pic-2.png"
import {
  IonCard,
  IonCol,
  IonGrid,
  IonIcon,
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

//import { attachProps } from "@ionic/react/dist/types/components/utils";
import  {colorPaletteOutline, ribbonOutline} from "ionicons/icons";

const mapState = (state: any) => ({
    user: state.user.user,
    totalPoints: state.user.user.total_points,
})


const mapDispatch = (dispatch: any) => ({
  fetchUser: (username: string, pw: string) => dispatch(fetchUser(username, pw)),
  getUser: (user: any) => dispatch(getUser(user)),
  changeCurrentArtDisplay: (artwork: any) => dispatch(changeCurrentArtDisplay(artwork))
})

const connector = connect(mapState, mapDispatch)


type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}

const HuntStatus = (props:Props) => {

      // To redirect to Information tab using forward animation
  const { navigate } = useContext(NavContext);
  const redirect = useCallback(
    () => navigate('/Information', 'back'),
    [navigate]
  );
  //When user clicks artwork, updates currentArtDislay, and redirects user to Information tab
  const selectAnArtwork = (index: number) => {
    let currentArtDisplayItem= user.solved_artworks[index]
    console.log(typeof currentArtDisplayItem, "check link")
    props.changeCurrentArtDisplay(currentArtDisplayItem)
    //props.removeSelectedArtWork(user, selectedArtWork)
    redirect()
  }


    const [showUserStatus, setShowUserStatus] = useState(false);
    const [showSolvedClues, setShowSolvedClues] = useState(true);
    const handleUserStatus = () => {
      setShowUserStatus(true);
      setShowSolvedClues(false);
    };
    const handleSolvedClues= () => {
      setShowSolvedClues(true);
      setShowUserStatus(false);

    };
    let chart = {
        'Beginner': 0,
        'Intermediate': 100,
        'Expert' : 200
     }

    let user = props.user
    let totalPoints = props.totalPoints

    const getKeyValue =  (key: string) => (obj: Record<string, any>) => obj[key];

    let currentStatus =
      totalPoints < chart['Intermediate'] ? 'Beginner' :
      totalPoints < chart['Expert'] ? 'Intermediate':
      'Expert'

      // For Percentage bar
    let percentage = (totalPoints%100) / (getKeyValue(currentStatus)(chart)+100 - (getKeyValue(currentStatus)(chart)))


     let colorTheme = currentStatus === 'Beginner' ? 'success'
     : currentStatus === 'Intermediate'? 'danger'
     : currentStatus === 'Expert' ? 'warning'
     : 'success';

      return (
          <div>
        {/* Card contains user information: profile picture. status level, total points, progress on level */}
        <IonCard>
            <IonGrid>
                <IonRow>

                    <IonCol size="4">
                        {/* if statement needed to change css border color */}
                        <img
                        className="img-shape"
                        style={{border: `5px solid ${colorTheme === 'success' ? '#006600' : colorTheme === 'danger' ? '#da3434' : '#e7ca0d'}`}}
                        src={user.profile_picture ? user.profile_picture.url : defaultProfilePicture}
                        alt="profile"
                        />

                    </IonCol>
                    <IonCol className="text-left" size="8">
                        <h3 className="statusTitle">Status: <IonText color={colorTheme}>{currentStatus}</IonText></h3>
                        <h4 className="statusTitle">Total Points:<IonText color={colorTheme}> {totalPoints}</IonText></h4>
                        <br/>
                        <IonProgressBar color={"success"} value={percentage}></IonProgressBar>
                        <IonText color={colorTheme}>{getKeyValue(currentStatus)(chart)}</IonText>
                        <IonText color={colorTheme} className="statusbar-end">{getKeyValue(currentStatus)(chart)+100}</IonText>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonCard>

        {/* Start of segment section - levels / solved clues */}
        <IonSegment scrollable className="segment-color" value={showUserStatus ? "levels" : "solved"}  >
                <IonSegmentButton className="segment-color" value="levels" onClick={handleUserStatus}>
                    <IonLabel>Levels </IonLabel>  <IonIcon icon={ribbonOutline}/>
                </IonSegmentButton>
                <IonSegmentButton className="segment-color" value="solved" onClick={handleSolvedClues}>
                    <IonLabel>Solved Clues</IonLabel> <IonIcon icon={colorPaletteOutline}/>
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

               { showSolvedClues && user.solved_artworks && <IonCard>
                    <IonGrid>

                { user && user.solved_artworks ? user.solved_artworks.map ( (artwork:any, index:any) =>
                        <IonRow key={index}>
                            <IonCol size="3">
                                <IonThumbnail>
                                    <IonImg
                                        onClick={() => selectAnArtwork(index)}
                      src={artwork.primary_image ? artwork.primary_image.url : ''}
                      alt={artwork.primary_image ? artwork.primary_image.alternative : ''} />

                                </IonThumbnail>
                            </IonCol>
                            <IonCol size="6">
                                Title: {artwork.title} <br />
                                Clue: {artwork.clue.Clue}
                            </IonCol>
                            <IonCol size="3">
                                Pts Earned: {artwork.clue? artwork.clue.Points: ''}
                            </IonCol>
                        </IonRow>):''}
                    </IonGrid>
                </IonCard>

}
        </div>
    )

}

export default connector(HuntStatus);
