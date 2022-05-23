import React, { useState } from "react";
import {
  IonContent,
  IonRow,
  IonCol,
  IonHeader,
  IonImg,
  IonPage,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonIcon,
  IonLabel,
  IonButton,
  useIonAlert,
} from "@ionic/react";
import { pin, wifi, wine, warning, walk } from "ionicons/icons";
import axios from "axios";
import { Redirect } from "react-router-dom";

interface Props {
  artwork: any;
  deleteArtwork: any;
  //flag indicating whether it's the sucess view after editting or uploading or from manage artworks view
  isFromSuccessView: any;
  handleUploader: Function;
  handleManager: Function;
  setArtworkFromManager: Function;
}

export const ArtworkCard: React.FC<Props> = (props): JSX.Element => {
  console.log(props);
  // const artwork = {"id":260, "Title":null, "published_at":"2022-04-24T02:52:01.694Z", "created_at":"2022-04-24T02:52:01.777Z", "updated_at":"2022-04-24T02:52:08.809Z", "title":"piano art", "artist":"famous pianist", "description":"this is a new artwork", "year":"1999", "qr_code":"https://cuny-gallery.web.app/cuny-campus-art-260", "campus": { "id":2, "campus_name":"City College", "published_at":"2020-10-22T22:22:48.509Z", "created_at":"2020-10-22T22:21:28.112Z", "updated_at":"2020-10-22T22:22:48.526Z"}, "clue":null, "likes":0, "artwork_type_clue":null, "Videos": [], "primary_image": { "id":264, "name":"piano-in-black-and-white-F100031057.jpeg", "alternativeText":null, "caption":null, "width":1280, "height":850, "formats": { "large": { "ext":".jpeg", "url":"https://cuny-campus-art-bucket.s3.amazonaws.com/large_piano_in_black_and_white_F100031057_b9d73737e0.jpeg", "hash":"large_piano_in_black_and_white_F100031057_b9d73737e0", "mime":"image/jpeg", "name":"large_piano-in-black-and-white-F100031057.jpeg", "path":null, "size":73.16, "width":1000, "height":664}, "small": { "ext":".jpeg", "url":"https://cuny-campus-art-bucket.s3.amazonaws.com/small_piano_in_black_and_white_F100031057_b9d73737e0.jpeg", "hash":"small_piano_in_black_and_white_F100031057_b9d73737e0", "mime":"image/jpeg", "name":"small_piano-in-black-and-white-F100031057.jpeg", "path":null, "size":23.4, "width":500, "height":332}, "medium": { "ext":".jpeg", "url":"https://cuny-campus-art-bucket.s3.amazonaws.com/medium_piano_in_black_and_white_F100031057_b9d73737e0.jpeg", "hash":"medium_piano_in_black_and_white_F100031057_b9d73737e0", "mime":"image/jpeg", "name":"medium_piano-in-black-and-white-F100031057.jpeg", "path":null, "size":45.35, "width":750, "height":498}, "thumbnail": { "ext":".jpeg", "url":"https://cuny-campus-art-bucket.s3.amazonaws.com/thumbnail_piano_in_black_and_white_F100031057_b9d73737e0.jpeg", "hash":"thumbnail_piano_in_black_and_white_F100031057_b9d73737e0", "mime":"image/jpeg", "name":"thumbnail_piano-in-black-and-white-F100031057.jpeg", "path":null, "size":7.65, "width":235, "height":156} }, "hash":"piano_in_black_and_white_F100031057_b9d73737e0", "ext":".jpeg", "mime":"image/jpeg", "size":98.63, "url":"https://cuny-campus-art-bucket.s3.amazonaws.com/piano_in_black_and_white_F100031057_b9d73737e0.jpeg", "previewUrl":null, "provider":"aws-s3", "provider_metadata":null, "created_at":"2022-04-24T02:52:16.944Z", "updated_at":"2022-04-24T02:52:16.944Z"}, "other_images": [], "qr_image": { "id":263, "name":"cuny-campus-art-260.png", "alternativeText":null, "caption":null, "width":164, "height":164, "formats": { "thumbnail": { "ext":".png", "url":"https://cuny-campus-art-bucket.s3.amazonaws.com/thumbnail_cuny_campus_art_260_b565252f42.png", "hash":"thumbnail_cuny_campus_art_260_b565252f42", "mime":"image/png", "name":"thumbnail_cuny-campus-art-260.png", "path":null, "size":12.41, "width":156, "height":156} }, "hash":"cuny_campus_art_260_b565252f42", "ext":".png", "mime":"image/png", "size":0.95, "url":"https://cuny-campus-art-bucket.s3.amazonaws.com/cuny_campus_art_260_b565252f42.png", "previewUrl":null, "provider":"aws-s3", "provider_metadata":null, "created_at":"2022-04-24T02:52:14.037Z", "updated_at":"2022-04-24T02:52:14.037Z"} }
  const artwork = props.artwork;

  const [edit, setEdit] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [present] = useIonAlert();

  const redirectToEdit = () => {
    console.log("edit");
    return (
      <Redirect
        to={{
          pathname: "/edit",
          state: { artwork: artwork, mode: "editor" },
        }}
      />
    );
  };

  const deleteArtwork = async (id: any) => {
    console.log("delete happens");
    console.log(id);
    let res = await props.deleteArtwork(id);
    console.log("DELETed", res);
    if (res.status == 200) {
      setDeleted(true);
    }
  };
  // const artwork = {
  //     "id": 261,
  //     "Title": null,
  //     "published_at": "2022-04-24T03:14:50.123Z",
  //     "created_at": "2022-04-24T03:14:50.655Z",
  //     "updated_at": "2022-04-24T03:14:58.679Z",
  //     "title": "Paint Splatters",
  //     "artist": "John Doe",
  //     "description": "\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent aliquam, purus et aliquet scelerisque, justo ligula varius turpis, non viverra lectus orci ut risus. Proin maximus efficitur felis, in euismod nisl blandit nec. Nam accumsan ligula sit amet vestibulum viverra. Nulla posuere venenatis felis, a porttitor ex mattis eu. Phasellus.",
  //     "year": "2021",
  //     "qr_code": "https://cuny-gallery.web.app/cuny-campus-art-261",
  //     "campus": {
  //         "id": 1,
  //         "campus_name": "Brooklyn College",
  //         "published_at": "2020-10-22T22:21:12.819Z",
  //         "created_at": "2020-10-22T22:21:11.336Z",
  //         "updated_at": "2020-10-22T22:21:12.838Z"
  //     },
  //     "clue": null,
  //     "likes": 0,
  //     "artwork_type_clue": null,
  //     "Videos": [],
  //     "primary_image": {
  //         "id": 266,
  //         "name": "paint-splatters-1188067.jpg",
  //         "alternativeText": null,
  //         "caption": null,
  //         "width": 1224,
  //         "height": 950,
  //         "formats": {
  //             "large": {
  //                 "ext": ".jpg",
  //                 "url": "https://cuny-campus-art-bucket.s3.amazonaws.com/large_paint_splatters_1188067_02dd1bbbf7.jpg",
  //                 "hash": "large_paint_splatters_1188067_02dd1bbbf7",
  //                 "mime": "image/jpeg",
  //                 "name": "large_paint-splatters-1188067.jpg",
  //                 "path": null,
  //                 "size": 146.05,
  //                 "width": 1000,
  //                 "height": 776
  //             },
  //             "small": {
  //                 "ext": ".jpg",
  //                 "url": "https://cuny-campus-art-bucket.s3.amazonaws.com/small_paint_splatters_1188067_02dd1bbbf7.jpg",
  //                 "hash": "small_paint_splatters_1188067_02dd1bbbf7",
  //                 "mime": "image/jpeg",
  //                 "name": "small_paint-splatters-1188067.jpg",
  //                 "path": null,
  //                 "size": 57.98,
  //                 "width": 500,
  //                 "height": 388
  //             },
  //             "medium": {
  //                 "ext": ".jpg",
  //                 "url": "https://cuny-campus-art-bucket.s3.amazonaws.com/medium_paint_splatters_1188067_02dd1bbbf7.jpg",
  //                 "hash": "medium_paint_splatters_1188067_02dd1bbbf7",
  //                 "mime": "image/jpeg",
  //                 "name": "medium_paint-splatters-1188067.jpg",
  //                 "path": null,
  //                 "size": 101.98,
  //                 "width": 750,
  //                 "height": 582
  //             },
  //             "thumbnail": {
  //                 "ext": ".jpg",
  //                 "url": "https://cuny-campus-art-bucket.s3.amazonaws.com/thumbnail_paint_splatters_1188067_02dd1bbbf7.jpg",
  //                 "hash": "thumbnail_paint_splatters_1188067_02dd1bbbf7",
  //                 "mime": "image/jpeg",
  //                 "name": "thumbnail_paint-splatters-1188067.jpg",
  //                 "path": null,
  //                 "size": 13.75,
  //                 "width": 201,
  //                 "height": 156
  //             }
  //         },
  //         "hash": "paint_splatters_1188067_02dd1bbbf7",
  //         "ext": ".jpg",
  //         "mime": "image/jpeg",
  //         "size": 190.85,
  //         "url": "https://cuny-campus-art-bucket.s3.amazonaws.com/paint_splatters_1188067_02dd1bbbf7.jpg",
  //         "previewUrl": null,
  //         "provider": "aws-s3",
  //         "provider_metadata": null,
  //         "created_at": "2022-04-24T03:15:06.019Z",
  //         "updated_at": "2022-04-24T03:15:06.019Z"
  //     },
  //     "other_images": [],
  //     "qr_image": {
  //         "id": 265,
  //         "name": "cuny-campus-art-261.png",
  //         "alternativeText": null,
  //         "caption": null,
  //         "width": 164,
  //         "height": 164,
  //         "formats": {
  //             "thumbnail": {
  //                 "ext": ".png",
  //                 "url": "https://cuny-campus-art-bucket.s3.amazonaws.com/thumbnail_cuny_campus_art_261_d37d6103f2.png",
  //                 "hash": "thumbnail_cuny_campus_art_261_d37d6103f2",
  //                 "mime": "image/png",
  //                 "name": "thumbnail_cuny-campus-art-261.png",
  //                 "path": null,
  //                 "size": 12.54,
  //                 "width": 156,
  //                 "height": 156
  //             }
  //         },
  //         "hash": "cuny_campus_art_261_d37d6103f2",
  //         "ext": ".png",
  //         "mime": "image/png",
  //         "size": 0.96,
  //         "url": "https://cuny-campus-art-bucket.s3.amazonaws.com/cuny_campus_art_261_d37d6103f2.png",
  //         "previewUrl": null,
  //         "provider": "aws-s3",
  //         "provider_metadata": null,
  //         "created_at": "2022-04-24T03:15:03.689Z",
  //         "updated_at": "2022-04-24T03:15:03.689Z"
  //     }
  // }

  return (
    <div>
      {deleted ? (
        <p style={{ textAlign: "center", color: "red" }}>Artwork Deleted</p>
      ) : (
        <IonCard>
          <IonRow>
            <IonCol>
              <IonCardHeader>
                <IonCardSubtitle>{artwork.artist}</IonCardSubtitle>
                <IonCardTitle>{artwork.title}</IonCardTitle>
                <IonCardSubtitle>{artwork.year}</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>{artwork.description}</IonCardContent>
            </IonCol>

            <IonCol style={{ display: "flex", alignItems: "center" }} size="6">
              <IonImg src={artwork.primary_image.url}></IonImg>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol></IonCol>

            <IonCol></IonCol>

            <IonCol>
              <IonButton
                target="_blank"
                download=""
                href={artwork.qr_image.url}
              >
                View/Print Qr Code
              </IonButton>

              <IonButton
                onClick={() => {
                  setEdit(true);
                  props.setArtworkFromManager(artwork);
                  props.handleUploader();
                }}
              >
                Edit
              </IonButton>
              {/* {edit ? <Redirect to={{
                                pathname: '/edit',
                                state: { artwork: artwork }
                            }} /> : <></>} */}

              <IonButton
                color="danger"
                onClick={() =>
                  present({
                    cssClass: "my-css",
                    header: "Warning",
                    message:
                      "Deleting the artwork will permanently remove it from our collection. Are you sure you want to proceed?",
                    buttons: [
                      "Cancel",
                      {
                        text: "Yes, delete",
                        handler: (id: any) => deleteArtwork(artwork.id),
                      },
                    ],
                    onDidDismiss: (e: any) => console.log("did dismiss"),
                  })
                }
              >
                Delete
              </IonButton>
            </IonCol>
          </IonRow>
        </IonCard>
      )}
    </div>
  );
};
