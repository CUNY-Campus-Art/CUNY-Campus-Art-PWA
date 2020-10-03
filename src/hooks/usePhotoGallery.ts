import { useState, useEffect } from "react";
import { useCamera } from '@ionic/react-hooks/camera';
import { useFilesystem, base64FromPath } from '@ionic/react-hooks/filesystem';
import { useStorage } from '@ionic/react-hooks/storage';
import { isPlatform } from '@ionic/react';
import { CameraResultType, CameraSource, CameraPhoto, Capacitor, FilesystemDirectory } from "@capacitor/core";

const PHOTO_STORAGE = "photos";

export function usePhotoGallery(){
    const [photos, setPhotos] = useState<Photo[]>([]);
    const { getPhoto } = useCamera();
    //give access to writefile method
    const { deleteFile, getUri, readFile, writeFile } = useFilesystem();
    const { get, set } = useStorage();

    const takePhoto  = async () => {
        const cameraPhoto = await getPhoto({
            resultType:CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100
        }
        );
        

        const fileName = new Date().getTime() + '.jpeg';

        const newPhotos = [{
            filepath: fileName,
            webviewPath: cameraPhoto.webPath
        }, ...photos];

        setPhotos(newPhotos);
        set(PHOTO_STORAGE, JSON.stringify(newPhotos));


        //save photos from array to filesystem
        const savePicture = async (photo: CameraPhoto, fileName: string): Promise<Photo> => {
            let base64Data: string;
            // "hybrid" will detect Cordova or Capacitor;
            if (isPlatform('hybrid')) {
              const file = await readFile({
                path: photo.path!
              });
              base64Data = file.data;
            } else {
              base64Data = await base64FromPath(photo.webPath!);
            }
            const savedFile = await writeFile({
              path: fileName,
              data: base64Data,
              directory: FilesystemDirectory.Data
            });
          
            if (isPlatform('hybrid')) {
              // Display the new image by rewriting the 'file://' path to HTTP
              // Details: https://ionicframework.com/docs/building/webview#file-protocol
              return {
                filepath: savedFile.uri,
                webviewPath: Capacitor.convertFileSrc(savedFile.uri),
              };
            }
            else {
              // Use webPath to display the new image instead of base64 since it's
              // already loaded into memory
              return {
                filepath: fileName,
                webviewPath: photo.webPath
              };
            }
          };

        
    };

    useEffect(() => {
        const loadSaved = async () => {
            const photosString = await get('photos');
            const photosInStorage = (photosString ? JSON.parse(photosString) : []) as Photo[];
            // If running on the web...
            if (!isPlatform('hybrid')) {
              for (let photo of photosInStorage) {
                const file = await readFile({
                  path: photo.filepath,
                  directory: FilesystemDirectory.Data
                });
                // Web platform only: Load photo as base64 data
                photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
              }
            }
            setPhotos(photosInStorage);
          };
        loadSaved();
      }, [get, readFile]);

    return{
        photos,
        takePhoto
    };
}

export interface Photo {
    filepath: string;
    webviewPath?: string;
}