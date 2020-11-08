import React, { useState } from "react";
import {
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
  IonModal,
  IonButton,
  IonCard,
} from "@ionic/react";

const HuntClues = () => {
  const [showModal, setShowModal] = useState(false);
  return (
      <div>
    <IonList>
      {/* Possibly map clues to list : {items.map((image, i) => (<IonItem key = {i}> <IonImg src = {image.src}/> </IonItem>))} */}
      <IonItem>
        {/* <IonThumbnail slot="start">
          <img src= {require("../assets/images/bluesClues.jpg")} />
        </IonThumbnail> */}
        <IonLabel>
          {/* CATEGORY */}
          <h3>Modern Art</h3>
          {/* AMOUNT OF POINTS AWARDED IF SOLVED */}
          <p>10 POINTS</p>
          {/* THE CLUE */}
          <p>Find me near a water fountain in the music department</p>
        </IonLabel>
        <IonModal isOpen={showModal}>
          {/* repeated information */}
        <h3>Modern Art</h3>
        <p>10 POINTS</p>
        <p>Find me near a water fountain in the music department</p>
          {/* to do <IonButton>Scan Artwork</IonButton> */}
          <IonButton onClick={() => setShowModal(false)}>Go Back</IonButton>
          </IonModal>
        <IonButton onClick={() => setShowModal(true)}>Solve</IonButton>
      </IonItem>

      {/* SECOND CLUE */}
      <IonItem>
        {/* <IonThumbnail slot="start"> */}
          {/* <img src="https://d26jxt5097u8sr.cloudfront.net/s3fs-public/styles/width_1200/public/1969_345_bird1-205x300.jpg?itok=OD7VW8c4" /> */}
        {/* </IonThumbnail> */}
        <IonLabel>
          <h3>New World and Old World cultures</h3>
          <p>10 POINTS</p>
          <p>
            The scene may show a rescue from a pirate attack, common along the
            west coast of South America in the 1700s.
          </p>
        </IonLabel>
        <IonModal isOpen={showModal}>
          <IonCard>
            hi
          </IonCard>
        <h3>New World and Old World cultures</h3>
          <p>10 POINTS</p>
          <p>
            The scene may show a rescue from a pirate attack, common along the
            west coast of South America in the 1700s.
          </p>
          {/* <IonButton>Scan Artwork</IonButton> */}
          <IonButton onClick={() => setShowModal(false)}>Go Back</IonButton>
        </IonModal>
        <IonButton onClick={() => setShowModal(true)}>Solve</IonButton>
      </IonItem>
    </IonList>
    </div>
  );
};

export default HuntClues;
