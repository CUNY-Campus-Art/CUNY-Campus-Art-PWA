import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonButton,
  IonSlide,
  IonSlides,
} from "@ionic/react";
import "./Information.css";

import { informationCircleOutline, qrCodeSharp, } from "ionicons/icons";

// controls the initial image shown and the speed at which it changes
const slideOpts = {
  initialSlide: 0,
  speed: 400,
};

const Information: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle >Name of Artwork</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
          <IonCardSubtitle>Frederic Thery</IonCardSubtitle>
            <IonCardTitle >New York City, 2020</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonSlides pager={true} options={slideOpts}>
              <IonSlide>
                <img src="https://media3.carredartistes.com/us/18076-large_default/xunique-contemporary-artwork-frederic-thiery-new-york-city.jpg.pagespeed.ic.45OGoX0QKY.jpg" alt="gallery 1"/>
              </IonSlide>
              <IonSlide>
                <img src="https://thumbs.nosto.com/quick/carredaristesus/8/566319340/bf154f4dac1b717cbb33730d656942ab770c24901577ab681fd46cea97c5ecf3a/A" alt="gallery 2"/>
              </IonSlide>
              <IonSlide>
                <img src="https://thumbs.nosto.com/quick/carredaristesus/8/566318950/ece2915fbc817e011d922b80c2b77700ff103a74a707724342da12f16f169d13a/A" alt="gallery 3"/>
              </IonSlide>
            </IonSlides>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonItem>
            <IonIcon icon={informationCircleOutline} slot="start" />
            <IonLabel class="ion-text-center">Overview</IonLabel>
            <IonButton fill="outline" slot="end">
              View
            </IonButton>
          </IonItem>

          <IonCardContent>
            Inspired by a painter father, Frédéric was interested from a very
            early age in drawing and painting. He studied fine arts at the
            University of Aix-en-Provence. After graduation, he moved to
            southern Spain where he discovered various crafts: leather work,
            silk painting, jewellery making…By g in contact with these artisans
            he learned to make leather accessories (belts, bags) and
            experimented with cold enamel work (producing the same aesthetic
            effect as enamel, but without firing). He attended a workshop on
            porcelain painting to learn this technique and soon he experienced
            the urge to paint on canvas.
          </IonCardContent>
        </IonCard>

        <IonCard >
          <IonItem href="/ScanQR" >
            <IonIcon icon={qrCodeSharp} slot="start" />
            <IonLabel class="ion-text-center">Scan Another Artwork</IonLabel>
          </IonItem>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Information;
