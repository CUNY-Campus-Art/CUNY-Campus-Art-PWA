import React from "react";
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../store'
import user, { getUser, logout, fetchUser } from '../store/user'
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
import { attachProps } from "@ionic/react/dist/types/components/utils";

const mapState = (state: any) => ({
    user: state.user.user,
    total_points: state.user.user.total_points,
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

const HuntStatus = (props: Props) => {
    let chart = {
       'Beginner': 0,
       'Intermediate': 151,
       'Expert' : 251
    }
    let user = props.user
    let total_points = props.total_points
    let currentLevel:string = total_points < 151 ? 'Beginner' :
                              total_points < 251 ? 'Intermediate':
                              'Expert'

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
                        <h3 className="About-title">{currentLevel}</h3>
                        <h4>{props.user.total_points} Points</h4>
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
                            <h4>{chart.Intermediate - total_points} points until Intermediate!</h4>
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
                            <h4>INTERMEDIATE: 151-250 Points</h4>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <h3>EXPERT: +251 Points</h3>
                        </IonItem>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonCard>
    )

}

export default connector(HuntStatus);
