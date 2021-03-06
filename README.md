# CUNY-Campus-Art-PWA

You can test CUNY Gallery, our PWA app, by visting the following link:<a href="https://cuny-gallery.web.app/"> https://cuny-gallery.web.app/ </a>

CUNY Campus Art aims to promote art (including student art) on CUNY campuses. We chose to make it a PWA so that a student would not need to download any app and can use the site directly.
- It allows the student to scan a QR code associated with an artwork to retrieve more information about it.
  - The app has a built in personalized QR scanner that student can use to scan.
  - The student also has the option of uploading a picture that has the QR code.
- Student can create an account, login, and a history of scanned artworks can be saved as well as removed.
- The app has been gamified by adding a Scavenger Hunt component. Students can solve clues and level up
- A logged in User also has the option of liking or disliking an artwork

You can test what we have so far with these QR Codes.

Girl With Pearl Earring
* <img src="Girl with Pearl Earring 193 .png" width="300"/>

Lilac Morning Mood
* <img src="Lilac Morning Mood 195.png" width="300"/>

Composition 8
* <img src="Composition 8 194.png" width="300"/>

Mona Lisa

* <img src="Mona Lisa cuny_campus_art_166.png" width="300"/>




## Update 1/28/20 - Mary and Jamila
* This app has been quite polished up. User can scan artworks whether they are logged in or not. We've added  scavenger hunt functionality, as well as like/ dislike functionality for when user is logged in. Here is a working demo of what we have so far:
<a href="https://cuny-gallery.web.app/Gallery
"> https://cuny-gallery.web.app/Gallery
 </a>

## Update A - 10/2/2020 - ML

To run this locally on your machine you will need to have the following installed:
* <a href="https://nodejs.org/en/"> node.js </a> for npm
* ionic - can install using:

> `npm install -g @ionic/cli native-run cordova-res`

After cloning this repo you will need to install all packages needed :

>`npm install`

Then you can run it locally using the following command:
> `ionic serve`

The initial upload of application is based on the tabs template from ionic using:

> `ionic start CUNY-gallery tabs --type=react -capacitor`

UI work on App.tsx, Information.tsx, and ScanQR.tsx files.
* <strong>App.tsx </strong> : routes to the tabs associated with the app, including home, gallery, scan, information, and profile, which are subject to change.

* <strong> Information.tsx </strong> : Information tab includes information for the artwork. Currently it holds static dummy data

Update: 10/12/20 - The information tab and gallery tab now holds dynamic data that is pulled from the database.


* <strong>ScanQR.tsx</strong> : This will be the default tab where users can scan QR codes. Currently it just holds the text instructing user to scan QR code. Looking into implementing opening of camera in this tab.

Update: 10/12/20 - User is able to use the QR Scanner to scan an art display

<img src="ScanQR.png" width="300"/>


## Update 10/12/20 - Jamila - Testing App

React-Redux has now been incorpated into this app to make it easier to manage state. And the app can now scan a qr code and pull information from the database and display it.

Firebase Link for app is:
(To add)


## Update 10/19/20 - ML - Adding UI Components

* Added bootstrap to the application and added more ui components to profile tab and home tab.
* Edited the header using css.
* Added form to profile tab.
* Edited qr-icon to resemble a real qr-code more.

<img src="./src/assets/images/QR-Icon.png" width="175"/>
