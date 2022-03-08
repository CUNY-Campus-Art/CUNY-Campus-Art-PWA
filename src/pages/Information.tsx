/**
 * Information.tsx - The Information component displays the details pertaining to a single artwork, the current artwork, user has either just scanned or chosen from the gallery
 */

import React, { useContext, useCallback, useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { NavContext } from '@ionic/react';
import { useParams } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonModal,
  IonSlide,
  IonSlides,
  IonButton,
  IonToast
} from "@ionic/react";
import "./Information.css";
import { useForm } from "react-hook-form";

import { informationCircleOutline, qrCodeSharp, heart, heartOutline, filmOutline } from "ionicons/icons";

import {
  clickLikeButton,
  fetchScannedArtDisplay,
  addVideoToDB,
  Video
} from '../store/artdisplay'

const mapState = (state: any) => ({
  user: state.user.user,
  campuses: state.general.campuses,
  currentArtDisplay: state.artDisplay.currentArtDisplay,
  videos: state.artDisplay.currentArtDisplay.Videos
})

const mapDispatch = (dispatch: any) => ({
  getScannedArtDisplay: (qrCodeText: string) => dispatch(fetchScannedArtDisplay(qrCodeText)),
  clickLikeButton: (user: any, artworkId: any, fromGallery: boolean) => dispatch(clickLikeButton(user, artworkId, fromGallery)),
  addVideo: (user: any, artwork: any, video: Video) => dispatch(addVideoToDB(user, artwork, video))
})

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
}

// Controls the initial image shown and the speed at which it changes
const slideOpts = {
  initialSlide: 0,
  speed: 400,
};


const Information = (props: Props) => {

  let user = props.user;

  const [showNotFoundToast, setNotFoundToast] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState({ youtube_id: '', youtube_url: '', title: '', author: '', user: '' });

  const { id }: { id: string } = useParams();

  const getArtwork = async (id: string) => {
    let extractedId = await props.getScannedArtDisplay(`cuny-campus-art-${id}`);
    if (!extractedId) setNotFoundToast(true)
  }

  useEffect(() => { if (id) getArtwork(id) }, []);



  // To redirect to QR scan tab using backward animation
  const { navigate } = useContext(NavContext);
  const redirect = useCallback(
    () => navigate('/ScanQR', 'back'),
    [navigate]
  );


  let currentArtDisplay = props.currentArtDisplay;
  let currentArtDisplayVideos = props.videos;

  //a copy of currentArtDisplay for UI likes changes
  const [artDisplayLikes, setArtDisplayLikes] = useState(currentArtDisplay);

  console.log("likes state");
  console.log(artDisplayLikes);


  let slidesComp = props.currentArtDisplay.other_images ? [currentArtDisplay.primary_image, ...props.currentArtDisplay.other_images] : [currentArtDisplay.primary_image]

  function handleLikes() {
    let myCurrentArtDisplay = {...currentArtDisplay};
    //UI updates to display like immediately
    let artDisplayLikesNew = {...artDisplayLikes};
    if(artDisplayLikesNew.liked==true){
      console.log("is liked");
    artDisplayLikesNew.liked = false;
    }
    else artDisplayLikesNew.liked = true;
    setArtDisplayLikes(artDisplayLikesNew);
    console.log("state changed");
    console.log(artDisplayLikes);


    let result = props.clickLikeButton(user, myCurrentArtDisplay, false);
    //Use the result in the future to make local state update faster
  }


   //gets called when currentArtDisplay is updated
  //acts as a check, if something went wrong when adding likes in the backend, this will reset the UI to display according to correct state as in backend
  useEffect(() => {
    console.log("art display updated");
    setArtDisplayLikes(currentArtDisplay)
  }, [currentArtDisplay])

  // Set up Video Form

  let formValues: any = {
    youtube_url: '',
    title: '',
    author: ''
  }

  // Allow form values to persist even when modal is closed

  const [youtube_url, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState(user ? `${user.first_name} ${user.last_name}` : '')

  const videoFields = [
    { name: youtube_url, label: 'Enter Youtube URL: ', type: 'text', setFunction: setYoutubeUrl },
    { name: title, label: 'Enter Title: ', type: 'text', setFunction: setTitle },
    { name: author, label: 'Enter Author: ', type: 'text', setFunction: setAuthor },
  ]

  // When form is submitted, parse data

  const extractYoutubeId = (youtube_url: string) => {

    const helper = (link: string) => {
      let index = youtube_url.indexOf(link)
      return index !== -1 ?
        youtube_url.slice(index + link.length, index + link.length + 11) : ''
    }


    return helper('youtube.com/embed/') || helper('youtu.be/-') || helper('youtu.be/') ||
      helper('youtube.com/watch?v=') || ''

  }



  const [showVideoModal, setShowVideoModal] = useState(false);

  const { handleSubmit } = useForm({
    defaultValues: formValues,
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const handleSubmit1 = async (evt: any) => {
    evt.preventDefault()
    handleSubmit(evt)
    // https://www.youtube.com/watch?v=hZ1OgQL9_Cw&feature=emb_title

    if (evt.target) {
      let newVideo = { youtube_id: '', youtube_url: youtube_url, title: title, author: author, user }

      newVideo.youtube_id = extractYoutubeId(youtube_url)

      if (newVideo.youtube_id) {
        // Add video to local state and to database
        props.addVideo(user, currentArtDisplay, newVideo)

        // Close modal and show success toast
        setShowVideoModal(false)
        setAddVideoToast(true)

        // Clear Form
        setYoutubeUrl('')
        setTitle('')
        setAuthor('')
      } else {
        setAddVideoToastInvalid(true)
      }

    }

  }


  // Set toast
  const [showAddVideoToast, setAddVideoToast] = useState(false)

  const [showAddVideoToastInvalid, setAddVideoToastInvalid] = useState(false)


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar></IonToolbar>

        <IonToolbar>
          <IonTitle className="ion-text-center">Artwork Information</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>{currentArtDisplay.artist}
              {/* Heart Button */}
              <IonButton className="heartPlacement"
                fill="clear"
                size="small"
                onClick={handleLikes}
              >
                {artDisplayLikes.liked ? (<IonIcon slot="icon-only" size='large' icon={heart}></IonIcon>) : (<IonIcon slot="icon-only" size='large' icon={heartOutline}></IonIcon>)}

              </IonButton>

              {/* <IonIcon
                className="heartPlacement"
                onClick={() => props.clickLikeButton(user, currentArtDisplay, false)}
                icon={props.currentArtDisplay.liked ? heart: heartOutline}
                size="large"
                ></IonIcon>) */}
            </IonCardSubtitle>
            <IonCardTitle >{`${currentArtDisplay.title}, ${currentArtDisplay.year}`}</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>

            {/* Slide show of images uploaded for the artwork */}
            <IonSlides pager={true} options={slideOpts} key={slidesComp.map(slide => slide.url).join('_')}>
              {slidesComp.map((image, index) => <IonSlide key={image.url}>
                <img src={image.url} alt={image.alternativeText} />
              </IonSlide>)}

            </IonSlides>

          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonItem>
            <IonIcon icon={informationCircleOutline} slot="start" />
            <IonLabel class="ion-text-center">Overview</IonLabel>
          </IonItem>

          <IonCardContent>
            {currentArtDisplay.description}
          </IonCardContent>
        </IonCard>

        <IonCard >
          <IonItem>
            <IonIcon icon={filmOutline} slot="start" />
            <IonLabel class="ion-text-center">Video Commentary</IonLabel>
          </IonItem>

          {/* If a video is not selected by a user from the list, then display preview all videos */}
          <IonCardContent id="video-playlist">
            {!selectedVideo.youtube_id && currentArtDisplayVideos && currentArtDisplayVideos.map((video: any, index: string) => video.youtube_url && <iframe
              key={`video-playlist${index}`}
              title={`video-playlist${index}`}
              src={`https://www.youtube.com/embed/${extractYoutubeId(video.youtube_url)}`} width={'100%'}
              height={"300"} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>)}
            {selectedVideo.youtube_id && <iframe
              id={'selected-video'}
              title={'selected-video'}
              src={`https://www.youtube.com/embed/${selectedVideo.youtube_id}`} width={'100%'}
              height={"auto"} frameBorder="0 " allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>}
          </IonCardContent>

          <IonCardContent id="video-playlist-list">
            {currentArtDisplayVideos && currentArtDisplayVideos.map((video: any, index: string) =>
              <IonItem
                key={index}
                className={video.youtube_id === selectedVideo.youtube_id ? 'selected-video-link' : ''} onClick={() => {
                  setSelectedVideo(video)
                  document.getElementById("video-playlist")?.scrollIntoView({ behavior: 'smooth' })
                }
                }
              >
                {video.title}
                {video.author ? ` by ${video.author}` : ''}
              </IonItem>)} <br />

            <hr />


            {user && <IonButton color='warning'
              onClick={() => setShowVideoModal(!showVideoModal)} >Add a Video?</IonButton>
            }

            {!user && <Link to='/profile'>Sign in to Add a Video</Link>}

            <IonModal cssClass='video-form-modal' isOpen={showVideoModal}>

              <IonCard>

                <form onSubmit={handleSubmit1}>
                  <IonCardTitle>Enter Video Information</IonCardTitle>
                  {videoFields.map((field: any, index: any) =>
                    <IonItem key={`videoField${index}`}>
                      <IonLabel position="stacked">
                        {field.label}
                      </IonLabel>
                      <IonInput name={field.name}
                        value={field.name}
                        onIonChange={e => field.setFunction(e.detail.value)} />
                    </IonItem>
                  )}

                  <span id="video-form-buttons">
                    <IonButton size='default' color="medium" fill="outline" onClick={() => setShowVideoModal(false)}>Cancel</IonButton>
                    <IonButton size='default' type="submit"  >Submit</IonButton>
                  </span>
                </form>
              </IonCard>
            </IonModal>
            {/* List user's videos */}
          </IonCardContent>
        </IonCard>

        <IonCard >
          <IonItem onClick={() => redirect()} >
            <IonIcon icon={qrCodeSharp} slot="start" />
            <IonLabel class="ion-text-center">Scan Another Artwork</IonLabel>
          </IonItem>
        </IonCard>

        <IonToast
          position="middle"
          color="warning"
          isOpen={showNotFoundToast}
          onDidDismiss={() => setNotFoundToast(false)}
          message="Artwork not found! This artwork is currently not in our collection. Please try another QR code."
          duration={1500}
        />


        <IonToast
          position="middle"
          color="success"
          isOpen={showAddVideoToast}
          onDidDismiss={() => setAddVideoToast(false)}
          message="Video has been successfully added."
          duration={1500}
        />


        <IonToast
          position="middle"
          color="danger"
          isOpen={showAddVideoToastInvalid}
          onDidDismiss={() => setAddVideoToastInvalid(false)}
          message="Invalid Youtube Url entered."
          duration={1500}
        />


      </IonContent>
    </IonPage>
  );
};



export default connector(Information)
