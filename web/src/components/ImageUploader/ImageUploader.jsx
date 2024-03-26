/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "react-bootstrap";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CircularProgress } from "@mui/material";
import {
  setDeletedUrls,
  setImagesError,
  setImagesToUpload,
  setIsMediaUploading,
  setIsNewMainImage,
  setMediaError,
  setMediaImages,
} from "../../views/redux/Posts/AdsSlice";
import { IMG_SIZE } from "../../utilities/MediaSize";
import "react-photo-view/dist/react-photo-view.css";
import "./ImageUploader.css";

function ImageUploader({ imagesError }) {
  const [images, setImages] = useState([]);
  const [deleteImageButton, setDeleteImageButton] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { deletedUrls } = useSelector((state) => state.Ads);
  const mediaImages = useSelector((state) => state.Ads.media.images);
  const imagesToUpload = useSelector((state) => state.Ads.media_urls.images);
  const currentSubscription = useSelector(
    (state) => state.subscriptions.currentSubscriptionDetails
  );

  const dispatch = useDispatch();

  const handleImageUpload = (event) => {
    event.preventDefault();

    if (event.target.value === "") return;

    if (
      currentSubscription &&
      currentSubscription?.type?.allowed_ad_photos <
        images.length + event.target.files.length
    ) {
      dispatch(
        setMediaError("You have selected images greater than allowed images")
      );
      setTimeout(() => {
        dispatch(setMediaError(null));
      }, 4000);
      return;
    }

    setDeleteImageButton(false);
    dispatch(setIsMediaUploading(true));

    const uploadedImages = event.target.files;
    const updatedImages = [...images];
    let mimgs = [...mediaImages];

    for (let i = 0; i < uploadedImages.length; i++) {
      if (uploadedImages[i] && uploadedImages[i].type.startsWith("image/")) {
        if (
          uploadedImages[i] &&
          uploadedImages[i].size / (1024 * 1024) <= IMG_SIZE
        ) {
          let reader = new FileReader();

          reader.onload = () => {
            updatedImages.push({
              previewURL: reader.result,
              type: "new",
              index: mediaImages.length,
            });
            setImages(updatedImages);
          };

          reader.readAsDataURL(uploadedImages[i]);
          mimgs.push(uploadedImages[i]);
        } else {
          dispatch(
            setMediaError(
              `Image size should be less than or equal to ${IMG_SIZE}MB`
            )
          );
          setTimeout(() => {
            dispatch(setMediaError(null));
          }, 4000);
        }
      } else {
        dispatch(
          setMediaError("It's not an image. You can only upload images.")
        );
        setTimeout(() => {
          dispatch(setMediaError(null));
        }, 4000);
      }
    }
    dispatch(setMediaImages(mimgs));

    setDeleteImageButton(true);
    dispatch(setIsMediaUploading(false));
  };

  const removeImage = async (image, index) => {
    setDeleteImageButton(false);

    const imageIndex = images.indexOf(image);

    if (imageIndex !== -1) {
      const cloneImages = [...images];
      cloneImages.splice(index, 1);
      setImages(cloneImages);

      if (image.type === "new") {
        const cloneMediaImages = [...mediaImages];
        cloneMediaImages.splice(image.index, 1);
        dispatch(setMediaImages(cloneMediaImages));
      } else {
        const urlToDelete = imagesToUpload[image.index];

        dispatch(setDeletedUrls([...deletedUrls, urlToDelete]));

        const imageToUploadIndex = imagesToUpload.indexOf(image.previewURL);

        const cloneImagesToUpload = [...imagesToUpload];

        if (imageToUploadIndex !== -1) {
          cloneImagesToUpload.splice(image.index, 1);
        }
        dispatch(setImagesToUpload(cloneImagesToUpload));
      }
    }

    setDeleteImageButton(true);
  };

  useEffect(() => {
    if (imagesToUpload.length > 0) {
      if (images.length === 0) {
        setImages(
          imagesToUpload.map((image, index) => ({
            previewURL: image,
            type: "old",
            index,
          }))
        );
      } else {
        setImages((prevState) => {
          let index = 0;
          for (let i = 0; i < prevState.length; i++) {
            if (prevState[i].type === "old") {
              prevState[i].index = index;
              index++;
            }
          }
          return prevState;
        });
      }
    }
  }, [imagesToUpload]);

  useEffect(() => {
    if (images.length > 0) dispatch(setImagesError(false));
  }, [images]);

  return (
    <Container fluid style={{ marginTop: "30px" }}>
      <div
        className="roboto-medium-20px-body1 images-container"
        style={{ marginBottom: "25px" }}
      >
        Upload Images
      </div>

      {imagesError && (
        <span className="text-danger">Atleast 1 photo is Required</span>
      )}
      <div
        style={{
          maxWidth: "900px",
          border: "2px dashed #E3E3E4",
          padding: "16px",
        }}
      >
        <ul style={{ paddingLeft: "20px" }}>
          <li
            className="roboto-regular-16px-information"
            style={{ color: "#A9A8AA", lineHeight: "22px" }}
          >
            Upload {currentSubscription?.type?.allowed_ad_photos || 1} of the
            best images that describe your service
          </li>
          <li
            className="roboto-regular-16px-information"
            style={{ color: "#A9A8AA", lineHeight: "22px" }}
          >
            Images can be upload in JPEG or PNG format
          </li>
          <li
            className="roboto-regular-16px-information"
            style={{ color: "#A9A8AA", lineHeight: "22px" }}
          >
            Size of images cannot exceed 5 Mb
          </li>
        </ul>

        {/* render images here */}
        <Row className="h-100 col-12 g-0 flex-column-reverse flex-md-row">
          <PhotoProvider>
            {images.length > 0 && (
              <div className="w-100 d-flex" style={{ flexWrap: "wrap" }}>
                <h5 className="w-100 mb-3">Main image</h5>
                <Col md={3} lg={3} key={0}>
                  <div className="mb-5">
                    {images[0] !== null && (
                      <div
                        style={{
                          position: "relative",
                          border: "2px dotted #386C34",
                          width: "145px",
                          height: "126px",
                        }}
                      >
                        <PhotoView src={images[0].previewURL ?? images[0]}>
                          <img
                            src={images[0].previewURL ?? images[0]}
                            alt={`Preview 1`}
                            style={{
                              width: "141px",
                              height: "122px",
                              objectFit: "cover",
                            }}
                          />
                        </PhotoView>
                        {deleteImageButton ? (
                          <button
                            type="button"
                            style={{
                              position: "absolute",
                              top: "0",
                              right: "0",
                            }}
                            className="upload-img-close-btn"
                            onClick={() => removeImage(images[0], 0)}
                          >
                            <FontAwesomeIcon
                              icon={faClose}
                              style={{
                                position: "absolute",
                                top: "2px",
                                right: "5px",
                                color: "#FFF",
                              }}
                            />
                          </button>
                        ) : null}
                        {!deleteImageButton ? (
                          <>
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                right: "0",
                                // left: "20px",
                                maxWidth: "100%",
                                maxHeight: "100%",
                                width: "160px",
                                height: "120px",
                                objectFit: "cover",
                                // borderRadius: "50%",
                              }}
                              className="d-flex justify-content-center align-items-center"
                            />

                            <CircularProgress
                              style={{
                                position: "absolute",
                                top: "30px",
                                left: "60px",
                                color: "#51f742",
                              }}
                            />
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>
                </Col>
              </div>
            )}
            <div className="w-100 d-flex" style={{ flexWrap: "wrap" }}>
              {images.length > 1 && (
                <h5 className="w-100 mb-3">Other images</h5>
              )}
              {images?.map((image, index) =>
                index === 0 ? (
                  <></>
                ) : (
                  <Col md={3} lg={3} key={index}>
                    <div className="mb-5">
                      {image !== null && (
                        <div
                          style={{
                            position: "relative",
                            border: "2px dotted #386C34",
                            width: "145px",
                            height: "126px",
                            cursor: "pointer",
                          }}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          <PhotoView src={image.previewURL ?? image}>
                            <img
                              src={image.previewURL ?? image}
                              alt={`Preview ${index + 1}`}
                              style={{
                                width: "141px",
                                height: "122px",
                                objectFit: "cover",
                              }}
                            />
                          </PhotoView>
                          {hoveredIndex === index && (
                            <div
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                transition: "all 100ms ease-in-out",
                                background: "#386C3480",
                                color: "#fff",
                                padding: "5px",
                                height: "35px",
                                width: "100%",
                                fontWeight: "bold",
                                textAlign: "center",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                let inc = 0;
                                setImages([
                                  {
                                    ...image,
                                    index: inc,
                                  },
                                  ...images
                                    .filter((img, i) => i !== index)
                                    .map((img, i) => {
                                      return img.type === image.type
                                        ? {
                                            ...img,
                                            index: inc++,
                                          }
                                        : img;
                                    }),
                                ]);
                                if (image.type === "old") {
                                  dispatch(
                                    setImagesToUpload([
                                      imagesToUpload[image.index],
                                      ...imagesToUpload.filter(
                                        (img, i) => i !== image.index
                                      ),
                                    ])
                                  );
                                  dispatch(setIsNewMainImage(false));
                                } else {
                                  dispatch(
                                    setMediaImages([
                                      mediaImages[image.index],
                                      ...mediaImages.filter(
                                        (img, i) => i !== image.index
                                      ),
                                    ])
                                  );
                                  dispatch(setIsNewMainImage(true));
                                }
                              }}
                            >
                              Set as main
                            </div>
                          )}
                          {deleteImageButton ? (
                            <button
                              type="button"
                              style={{
                                position: "absolute",
                                top: "0",
                                right: "0",
                              }}
                              className="upload-img-close-btn"
                              onClick={() => removeImage(image, index)}
                            >
                              <FontAwesomeIcon
                                icon={faClose}
                                style={{
                                  position: "absolute",
                                  top: "2px",
                                  right: "5px",
                                  color: "#FFF",
                                }}
                              />
                            </button>
                          ) : null}
                          {!deleteImageButton ? (
                            <>
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  right: "0",
                                  // left: "20px",
                                  maxWidth: "100%",
                                  maxHeight: "100%",
                                  width: "160px",
                                  height: "120px",
                                  objectFit: "cover",
                                  // borderRadius: "50%",
                                }}
                                className="d-flex justify-content-center align-items-center"
                              />

                              <CircularProgress
                                style={{
                                  position: "absolute",
                                  top: "30px",
                                  left: "60px",
                                  color: "#51f742",
                                }}
                              />
                            </>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </Col>
                )
              )}
              {currentSubscription &&
                currentSubscription?.type?.allowed_ad_photos >
                  images.length && (
                  <div
                    style={{
                      border: "2px dashed #A0C49D",
                      width: "141px",
                      height: "122px",
                    }}
                  >
                    <label
                      htmlFor="file-input"
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "141px",
                        height: "122px",
                        cursor: "pointer",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faAdd}
                        style={{
                          color: "#A0C49D",
                          width: "40px",
                          height: "40px",
                          marginRight: "10px",
                          marginBottom: "8px",
                        }}
                      />
                    </label>
                    <input
                      id="file-input"
                      type="file"
                      accept=".jpeg, .jpg, .png, image/jpeg, image/jpg, image/png"
                      onChange={(event) => handleImageUpload(event)}
                      style={{ display: "none", border: "1px solid red" }}
                      multiple
                    />
                  </div>
                )}
            </div>
          </PhotoProvider>
        </Row>
      </div>
    </Container>
  );
}

export default ImageUploader;
