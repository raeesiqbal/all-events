/* eslint-disable jsx-a11y/label-has-associated-control */
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useDispatch, useSelector } from "react-redux";
import "./ImageUploader.css";
import { secureInstance } from "../../axios/config";
import { CircularProgress } from "@mui/material";

import {
  setImagesToUpload,
  uploadImagesToCloud,
} from "../../views/redux/Posts/AdsSlice";
import "react-photo-view/dist/react-photo-view.css";

function ImageUploader({ imagesError }) {
  const [images, setImages] = useState([]);
  const imagesToUpload = useSelector((state) => state.Ads.media_urls.images);
  const currentSubscription = useSelector(
    (state) => state.subscriptions.currentSubscriptionDetails,
  );
  const [deleteImageButton, setDeleteImageButton] = useState(true);

  const dispatch = useDispatch();

  const handleImageUpload = (event) => {
    setDeleteImageButton(false);
    event.preventDefault();
    const uploadedImage = event.target.files[0];
    const updatedImages = [...images];

    const reader = new FileReader();

    reader.onload = () => {
      updatedImages.push({
        file: uploadedImage,
        previewURL: reader.result,
      });
      setImages(updatedImages);
    };
    reader.readAsDataURL(uploadedImage);
    dispatch(uploadImagesToCloud(uploadedImage));
    setDeleteImageButton(true);
  };

  const removeImage = async (image, index) => {
    setDeleteImageButton(false);
    const urlToDelete = imagesToUpload[index];

    try {
      const request = await secureInstance.request({
        url: "/api/ads/delete-url/",
        method: "Post",
        data: {
          url: urlToDelete,
        },
      });
      // ----------------do this inside redux
      if (request.status === 200) {
        const imageIndex = images.indexOf(image);

        const cloneImages = [...images];

        if (imageIndex !== -1) {
          cloneImages.splice(index, 1);
        }

        setImages(cloneImages);

        const imageToUploadIndex = imagesToUpload.indexOf(image);

        const cloneImagesToUpload = [...imagesToUpload];

        if (imageToUploadIndex !== -1) {
          cloneImagesToUpload.splice(index, 1);
        }
        dispatch(setImagesToUpload(cloneImagesToUpload));
        setDeleteImageButton(true);
      }
    } catch (err) {}

    const imageIndex = images.indexOf(image);

    const cloneImages = [...images];

    if (imageIndex !== -1) {
      cloneImages.splice(index, 1);
    }

    setImages(cloneImages);
  };

  useEffect(() => {
    setImages(imagesToUpload);
  }, [imagesToUpload]);

  const imagesToMap = images;

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
            <div className="d-flex" style={{ flexWrap: "wrap" }}>
              {imagesToMap?.map((image, index) => (
                <Col md={3} lg={3} key={index}>
                  <div className="mb-5">
                    {image !== null && (
                      <div
                        style={{
                          position: "relative",
                          border: "2px dotted #386C34",
                          width: "145px",
                          height: "126px",
                        }}
                      >
                        <PhotoView src={image}>
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
              ))}
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
                      accept="image/*"
                      onChange={(event) => handleImageUpload(event)}
                      style={{ display: "none", border: "1px solid red" }}
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
