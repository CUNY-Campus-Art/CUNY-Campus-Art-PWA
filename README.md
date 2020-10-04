# CUNY-Campus-Art-PWA

## Update - 10/2/2020 - Mary

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

I mostly worked in the App.tsx, Information.tsx, and ScanQR.tsx files. 
* <strong>App.tsx </strong> : you will find the routes to the tabs associated with the app, including home, gallery, scan, information, and profile, which are subject to change.
* <strong> Information.tsx </strong> : This is the code for the information tab, which will include the information for the artwork. Currently it holds static dummy data, I will be looking into connecting to the API/database to show data.
* <strong>ScanQR.tsx</strong> : This will be the tab where users can scan QR codes. Currently it just holds the text instructing user to scan QR code. Looking into implementing opening of camera in this tab.

