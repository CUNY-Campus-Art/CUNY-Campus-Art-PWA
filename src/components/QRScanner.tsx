/**
 * QRScanner.tsx - builds a QR scanner allowing user to
 * scan a QR code using their camera, whether it's from
 * a personal computer, iPhone or Android.
 * Sends scan result to parent QRScan page.
 */


import React, { createRef } from 'react';
import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonFab, IonFabButton, IonIcon, IonContent } from '@ionic/react';
import './QRScanner.css';
import jsQR from 'jsqr';

import {
  camera, folder, scan,
  stop
} from "ionicons/icons";

//For Camera Button:
import { usePhotoGallery } from "../hooks/usePhotoGallery";

interface ContainerProps {
  name: string;
  scanResultParent: (qrcode: any) => void;
  scanStateParent: (state: any) => void
}

interface ContainerState {
  scanActive: boolean;
  scanResult: string;
  videoSrc: string
}

class QRScanner extends React.Component<ContainerProps, ContainerState> {
  private video = createRef<HTMLVideoElement>();
  private canvas = createRef<HTMLCanvasElement>();
  private fileInput: any;
  // loading: HTMLIonLoadingElement = null;

  private canvasElement: any;
  private canvasContext: any;
  private videoElement: any;
  private stream: any;
  // private loading!: HTMLIonLoadingElement;

  constructor(props: ContainerProps) {
    super(props);

    this.state = {
      scanActive: false,
      scanResult: '',
      videoSrc: ''
    }

    this.startScan = this.startScan.bind(this);
    this.scan = this.scan.bind(this);
    this.stopScan = this.stopScan.bind(this)
    this.refresh = this.refresh.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
    this.handleFile = this.handleFile.bind(this)
  }

  componentDidMount() {
    this.canvasElement = this.canvas.current!
    this.videoElement = this.video.current!
    this.canvasContext = this.canvasElement.getContext('2d')
  }

  // When DOM is loaded, componentDidUpdate grabs references to relevant elements.
  async componentDidUpdate() {
    this.canvasElement = this.canvas.current!
    this.videoElement = this.video.current!
    this.canvasContext = this.canvasElement.getContext('2d')
    this.fileInput = document.getElementById('file-input')
  }


  // startScan sets up the stream and then sets up a continuous call
  async startScan() {
    // As of now doesn't work on, iOS standalone mode!
    this.props.scanStateParent(true) //sends update to parent to let it know scan state is active
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    this.setState({ scanActive: true });

    this.videoElement.srcObject = this.stream;
    // Required for Safari
    this.videoElement.setAttribute('playsinline', true);

    // this.loading = await this.loadingCtrl.create({});
    // await this.loading.present();

    this.videoElement.play();
    requestAnimationFrame(this.scan);
  }

  async scan() {
    console.log(this.canvas, "TESTING")
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      // if (this.loading) {
      //   await this.loading.dismiss();
      //   this.loading = null;
      // }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
      console.log(code);
      if (code) {
        console.log(this.props.scanResultParent, "ScanResultParent")
        this.videoElement.setAttribute('playsinline', false);
        this.stream.getTracks()[0].stop();
        this.setState({
          scanActive: false,
          scanResult: code.data
        });
        this.props.scanResultParent(code.data);
        //this.showQrToast();
      } else {
        if (this.state.scanActive)
          requestAnimationFrame(this.scan);
      }
    } else {
      requestAnimationFrame(this.scan);
    }
  }


  //stops scan when user presses corresponding button.
  //stops stream and sets the state of scanActive to false
  stopScan() {
    this.props.scanStateParent(false)//sends update to parent to let it know scan state is not active
    this.videoElement.setAttribute('playsinline', false);
    this.stream.getTracks()[0].stop();
    this.setState({ scanActive: false });
  }

  refresh() {
    this.stream.getTracks()[0].stop();
    this.setState({ scanResult: '', scanActive: false });
  }


  handleFile(event: React.ChangeEvent<HTMLElement>): void {
    const file = this.fileInput.files.item(0);

    var img = new Image();
    img.onload = () => {
      this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        //when a result is found, video stops, and scanResult Parent is called. scanResultParent tries to update state of overall app,
        // this.videoElement.setAttribute('playsinline', false);
        // this.stream.getTracks()[0].stop();
        this.props.scanResultParent(code.data);
        this.setState({ scanResult: code.data });
        // this.showQrToast();
      }
    };
    img.src = URL.createObjectURL(file);
  }

  uploadImage() {
    //turns off scanner if uploadImage button is pressed
    if(this.state.scanActive) {
      this.stream.getTracks()[0].stop();
      this.setState({scanActive: false})
    }
    //clicks hidden input file buttons
    this.fileInput.click();
  }

  render() {
    // console.log(this.videoElement, "jooo")
    return (
      <span>
        {/* <strong>{this.props.name}</strong> */}


        {/* -- Fallback for iOS PWA -- */}
        <input id="file-input" type="file" accept="image/*;capture=camera" hidden onChange={this.handleFile} />

        {/* --Trigger the file input-- */}
        {/* <IonButton id="camera" shape="round" onClick={this.uploadImage} color="primary">Upload Image</IonButton> */}

        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton id="camera" color="secondary" onClick={this.uploadImage}>
            <IonIcon icon={folder}></IonIcon>
          </IonFabButton>
        </IonFab>



         {/* - or -
        <IonButton id="qr-scanner" shape="round" onClick={this.startScan} color="primary">Start Scan</IonButton> <br /> */}


        <IonFab vertical="bottom" horizontal="center" slot="fixed" >
          <IonFabButton id="scan-button" onClick={this.startScan} color="primary">
            <IonIcon icon={scan}></IonIcon>
          </IonFabButton>
        </IonFab>


        <IonButton id="refresh-button" shape="round" onClick={this.refresh} color="warning">Reset</IonButton>

        <div id="scanner-section">
        {/* --Shows our camera stream-- */}
        {/* <video width="50%" ref={this.video} autoPlay={true}/> */}
        <video id="video-scanner" hidden={!this.state.scanActive} width="100%" ref={this.video} autoPlay={true} />

        {/* --Used to render the camera stream images-- */}
        <canvas hidden ref={this.canvas}></canvas>

        </div>

        {/* --Stop our scanner preview if active-- */}
        {/* {this.state.scanActive ? <IonButton shape="round" onClick={this.stopScan} color="danger">Stop Scan</IonButton> : null} */}

        {this.state.scanActive ? <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton id='stop-button' color="danger" onClick={this.stopScan} >
            <IonIcon color='light' icon={stop}></IonIcon>
          </IonFabButton>
        </IonFab> : null}


        {/* --Display scanner result-- */}
        {/* <IonCard>
          <IonCardHeader>
            <IonCardTitle>QR Scan Result:</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>{this.state.scanResult}</IonCardContent>
        </IonCard> */}


        {/* Fall Back Non QR Scanner Camera - not functional as of yet*/}



      </span>

    );
  }
}

export default QRScanner;
