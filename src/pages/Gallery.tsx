/**
 * Gallery.tsx
 *  As of now, the Gallery component can pull
 * information from the database. It currently retrieves a list
 * of past artworks the user has scanned locally.
 */

import React, { useCallback, useContext, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { IonItem, IonList, IonText, NavContext } from "@ionic/react";
import "./Gallery.css";
import GalleryTile from '../components/GalleryTile'
import type { ArtDisplay } from "../store/models";
import {
  changeCurrentArtDisplay,
  fetchPastArtworks,
} from "../store/artdisplay";


import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,

} from "@ionic/react";


const mapState = (state: any) => ({
  currentArtDisplay: state.artDisplay.currentArtDisplay,
  pastArtDisplays: state.artDisplay.pastArtDisplays,
  currentUser: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  changeCurrentArtDisplay: (artwork: ArtDisplay) =>
    dispatch(changeCurrentArtDisplay(artwork)),
  getPastArtworks: (currentUser: any) =>
    dispatch(fetchPastArtworks(currentUser))
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  // backgroundColor: string
};

const Gallery = (props: Props) => {
  console.log(window.localStorage);
  const user = props.currentUser;
  const pastArtDisplays = props.pastArtDisplays;

  // useEffect(() => { if (user) props.getPastArtworks(props.currentUser); }, []);

  // To redirect to Information with forward animation
  const { navigate } = useContext(NavContext);
  const redirect = useCallback(
    () => navigate("/Information", "forward"),
    [navigate]
  );

  //When user clicks artwork, updates currentArtDislay, and redirects user to Information tab
  const selectAnArtwork = (index: number) => {
    let currentArtDisplayItem: ArtDisplay = pastArtDisplays[index];

    props.changeCurrentArtDisplay(currentArtDisplayItem);

    redirect();
  };

  // const [likeartwork, setlikeartwork] = useState(false);

  // const handleLikes = () => {
  //   likeartwork ? setlikeartwork(false) : setlikeartwork(true);
  // }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar></IonToolbar>
        <IonToolbar>
          <IonTitle>Your Gallery </IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonTitle size="small">All Artwork You Have Scanned</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {pastArtDisplays.map((artDisplay: any, index: any) => (
            <GalleryTile key={index} index={index} artDisplay={artDisplay} selectAnArtwork={selectAnArtwork}/>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default connector(Gallery);
