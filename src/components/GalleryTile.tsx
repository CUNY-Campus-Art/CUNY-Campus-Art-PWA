import React from "react";
import { connect, ConnectedProps } from "react-redux";
import "./GalleryTile.css";

import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonItem,
  IonRow,
  IonText,
} from "@ionic/react";

import {
  trash,
  heart,
  heartOutline,
  heartDislike,
  heartDislikeOutline,
} from "ionicons/icons";

import type { ArtDisplay } from "../store/models";

import {
  removeScannedArtDisplay,
  clickLikeButton,
  clickDislikeButton,
} from "../store/artdisplay";

import { RootState } from "../store";

interface GalleryTileProps {
  index: number;
  artDisplay: ArtDisplay;
  selectAnArtwork: Function;
}

/* use the props currentArtDisplay and allArtDisplays to access state */
const mapState = (state: RootState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  removeArtwork: (user: any, artworkId: any) =>
    dispatch(removeScannedArtDisplay(user, artworkId)),
  clickLikeButton: (user: any, artworkId: any, fromGallery: boolean) =>
    dispatch(clickLikeButton(user, artworkId, fromGallery)),
  clickDislikeButton: (user: any, artworkId: any) =>
    dispatch(clickDislikeButton(user, artworkId)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  index: number;
  artDisplay: ArtDisplay;
  selectAnArtwork: Function;
};

const GalleryTile = (props: Props) => {
  let index = props.index;
  let artDisplay = props.artDisplay;
  let selectAnArtwork = props.selectAnArtwork;
  let user = props.user;
  let isLiked = artDisplay.liked
  let isDisliked = artDisplay.disliked


//   const [isLiked, setIsLiked] = useState(artDisplay.liked);
//   const [isDisliked, toggleIsDisliked] = useState(artDisplay.disliked);

  return (
    <IonItem key={index}>
      <IonGrid>
        <IonRow>
          <IonCol className="center-text" size="5">
            <IonImg
              className="artwork-tile img-size"
              onClick={() => selectAnArtwork(index)}
              src={artDisplay.primary_image ? artDisplay.primary_image.url : ""}
              alt={
                artDisplay.primary_image
                  ? artDisplay.primary_image.alternativeText
                  : ""
              }
            />
            {artDisplay.id !== "default" && (
              <IonText color="medium">{artDisplay.likes} Likes</IonText>
            )}
          </IonCol>

          <IonCol>
            <IonRow onClick={() => selectAnArtwork(index)}>
              <IonText className="center-text">
                <h3>{artDisplay.title}</h3>
              </IonText>
            </IonRow>
            <IonRow onClick={() => selectAnArtwork(index)}>
              {" "}
              <IonText className="center-text">
                {artDisplay.artist}
              </IonText>{" "}
            </IonRow>

            {/* Like Heart Icon / Thumbs Up  */}
            <IonRow className="align-right-row">
              {user && (
                <IonButton
                  fill="outline"
                  size="small"
                  color="danger"
                  onClick={() => {
                     props.clickLikeButton(user, artDisplay, true)
                    }}
                >
                  {isLiked? (
                    <IonIcon className="likeHeart" icon={heart}></IonIcon>
                  ) : (
                    <IonIcon
                      className="likeHeart"
                      icon={heartOutline}
                    ></IonIcon>
                  )}
                </IonButton>
              )}

              {/* Disliked Heart Icon / Thumbs Down */}
              {user && (
                <IonButton
                  fill="outline"
                  size="small"
                  color="primary"
                  onClick={() => {
                    props.clickDislikeButton(user, artDisplay)
                      
                    }}
                >
                  {isDisliked ? (
                    <IonIcon color="primary" icon={heartDislike}></IonIcon>
                  ) : (
                    <IonIcon
                      color="primary"
                      icon={heartDislikeOutline}
                    ></IonIcon>
                  )}
                </IonButton>
              )}

              {/* Trash Icon */}
              {
                <IonButton
                  fill="outline"
                  size="small"
                  color="medium"
                  onClick={() => props.removeArtwork(props.user, artDisplay)}
                >
                  <IonIcon icon={trash}></IonIcon>
                </IonButton>
              }
            </IonRow>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default connector(GalleryTile);
