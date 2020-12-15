/**
 * QRScanner.tsx - builds a QR scanner allowing user to
 * scan a QR code using their camera, whether it's from
 * a personal computer, iPhone or Android.
 * Sends scan result to parent QRScan page.
 */


import React, { createRef, useState } from 'react';
import { IonButton, IonFab, IonFabButton, IonFooter, IonIcon, IonToast } from '@ionic/react';
import './QRScanner.css';
import jsQR from 'jsqr';

import {
  folder, scan, stop
} from "ionicons/icons";

interface ContainerProps {
  name: string;
  scanResultParent: (qrcode: any) => void;
  scanStateParent: (state: any) => void
}

interface ContainerState {
  scanActive: boolean
  scanResult: string
  videoSrc: string
  showInvalidQRToast: boolean
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
      videoSrc: '',
      showInvalidQRToast: false
    }

    this.setShowInvalidQRToast = this.setShowInvalidQRToast.bind(this)
    this.startScan = this.startScan.bind(this)
    this.scan = this.scan.bind(this)
    this.stopScan = this.stopScan.bind(this)
    this.refresh = this.refresh.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.parseQRCode = this.parseQRCode.bind(this)
  }

  setShowInvalidQRToast (status: boolean){
    this.setState({showInvalidQRToast: status})
  }

  // When DOM is loaded, get references to canvas and video elements.
  componentDidMount() {
    this.canvasElement = this.canvas.current!
    this.videoElement = this.video.current!
    this.canvasContext = this.canvasElement.getContext('2d')
  }

  async componentDidUpdate() {
    this.canvasElement = this.canvas.current!
    this.canvasContext = this.canvasElement.getContext('2d')
    this.videoElement = this.video.current!
    this.fileInput = document.getElementById('file-input')
  }

  parseQRCode(code: String) {
    console.log("parseQRCode")
    if(code.startsWith('campus-art-'))
        return true
    else {
      console.log ('invalid qr code')
      // if(this.state.scanActive) this.stopScan();
      this.setState({showInvalidQRToast: true})
      return false
    }
  }

  // startScan() sets up the camera stream
  // As of now doesn't work on, iOS standalone mode
  async startScan() {

    //sends update to parent to let it know scan state is active
    this.props.scanStateParent(true)

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

  // scan() takes images from the camera stream and detects QR code
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

        let isValidQRCode = this.parseQRCode(code.data)

     // When a result is found, video stops, and scanResult Parent is called. scanResultParent tries to update state of overall app,
        if (isValidQRCode) {
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
          requestAnimationFrame(this.scan);
        }

      } else {
        if (this.state.scanActive)
          requestAnimationFrame(this.scan);
      }
    } else {
      requestAnimationFrame(this.scan);
    }
  }


  // Stops stream when user presses stop button and sets the state of scanActive to false
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


  // Handles uploaded image
   handleFile(event: React.ChangeEvent<HTMLElement>) {
    let file = this.fileInput.files.item(0);

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



        let isValidQRCode = this.parseQRCode(code.data)

        if (isValidQRCode) {
          this.setState({ scanResult: code.data });
          this.props.scanResultParent(code.data);
        } else{
          this.setState({showInvalidQRToast: true})
        }
      }
    };
    img.src = URL.createObjectURL(file);

  }

  uploadImage() {
    // Turns off scanner if uploadImage button is pressed
    if (this.state.scanActive) {
      this.stream.getTracks()[0].stop();
      this.setState({ scanActive: false })
    }
    // Clicks hidden input file button
    this.fileInput.click();
  }
  

  render() {
    // console.log(this.videoElement, "jooo")

    return (
      <div>
        {/* <strong>{this.props.name}</strong> */}


        {/* -- Fallback for iOS PWA -- */}
        <input id="file-input" type="file" accept="image/*;capture=camera" hidden onChange={this.handleFile} />

        
        {/* --Trigger the file input-- */}
        {/* <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton id="camera" color="secondary" onClick={this.uploadImage}>
            <IonIcon icon={folder}></IonIcon>
          </IonFabButton>
        </IonFab> */}

        
        
        <IonButton 
        expand="full" 
        size="large" 
        id="scan-button" 
        onClick={this.startScan} 
        color="primary"
        >
          Scan QR <IonIcon slot="end" icon={scan}/>
        </IonButton>

        <IonButton 
        className="ion-no-margin button-height" 
        expand="block" 
        id="camera" 
        color="secondary" 
        onClick={this.uploadImage}
        >
          Upload File <IonIcon slot="end" icon={folder}/>
        </IonButton>
        
        
        <IonFooter>
        <IonButton 
        expand="full" 
        id="refresh-button" 
        onClick={this.refresh} 
        color="warning"
        >Reset
        </IonButton>
        </IonFooter>

        <div id="scanner-section">
          {/* --Shows our camera stream-- */}
          <video id="video-scanner" hidden={!this.state.scanActive} width="100%" ref={this.video} autoPlay={true} />

          {/* --Used to render the camera stream images-- */}
          <canvas hidden ref={this.canvas}></canvas>

        </div>

        {this.state.scanActive ? <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton id='stop-button' color="danger" onClick={this.stopScan} >
            <IonIcon color='light' icon={stop}></IonIcon>
          </IonFabButton>
        </IonFab> : null}

        <IonToast
        id="invalid-qr-toast"
        color="warning"
        isOpen={this.state.showInvalidQRToast}
        onDidDismiss={() => this.setShowInvalidQRToast(false)}
        message="Invalid QR code! Please scan one from a CUNY art display."
        duration={600}
        position="middle"
        z-index= {20001}
      />
        {/* --Display scanner result-- Moved to Parent page */}
        {/* <IonCard>
          <IonCardHeader>
            <IonCardTitle>QR Scan Result:</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>{this.state.scanResult}</IonCardContent>
        </IonCard> */}


        {/* Fall Back Non QR Scanner Camera - not functional as of yet*/}



      </div>

    );
  }
}

export default QRScanner;
