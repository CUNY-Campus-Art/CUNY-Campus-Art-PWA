import React from "react";
import ImageUploading from "react-images-uploading";
import axios from "axios";


function ImageUpload (props) {
  //TO-DO, figure out how to set images
  // const [images, setImages] = React.useState(props.image ? (fetch(props.image.url).then((e) => {
  //   console.log(e);
  //   return e.blob()
  // })
  // .then((blob) => {
  //   let b = blob
  //   b.lastModifiedDate = new Date()
  //   b.name = ''
  //   return b}))
  //  : []);
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    //console.log(imageList, addUpdateIndex);
    setImages(imageList);

    // This sends file info to the parent (Signup Component) so file can be processed and sent to the database
    if(imageList[0]) props.getImgFileInfoParent(imageList[0].file)
  };

  console.log(images)

  return (
    <div className="App">
      <ImageUploading
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button type="button"
              style={isDragging ? { color: "red" } : null}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            {/* <button onClick={onImageRemoveAll}>Remove all images</button> */}
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.data_url} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button type="button" onClick={() => onImageUpdate(index)}>Update</button>
                  <button type="button" onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}


export default ImageUpload;
