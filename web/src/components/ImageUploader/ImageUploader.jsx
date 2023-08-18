/* eslint-disable jsx-a11y/label-has-associated-control */
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useDispatch, useSelector } from "react-redux";
import InfoIcon from "../../assets/images/gg_info.svg";
import "./ImageUploader.css";
import { secure_instance } from "../../axios/axios-config";
import {
  setImagesToUpload,
  uploadImagesToCloud,
} from "../../views/redux/Posts/AdsSlice";
import "react-photo-view/dist/react-photo-view.css";

function ImageUploader({ imagesError }) {
  const [images, setImages] = useState([]);
  const imagesToUpload = useSelector((state) => state.Ads.media_urls.images);

  const dispatch = useDispatch();

  const handleImageUpload = (event, index) => {
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
  };

  const removeImage = async (image, index) => {
    const urlToDelete = imagesToUpload[index];

    try {
      const request = await secure_instance.request({
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
        console.log("cloneImagesToUpload", cloneImagesToUpload);
        dispatch(setImagesToUpload(cloneImagesToUpload));
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
            Upload 5 of the best images that describe your service
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
              {console.log("imagesToMap", imagesToMap)}
              {imagesToMap?.map((image, index) => (
                <Col md={3} lg={3} key={index}>
                  {/* {console.log({ index })} */}
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
                        <button
                          type="button"
                          style={{ position: "absolute", top: "0", right: "0" }}
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
                      </div>
                    )}
                  </div>
                </Col>
              ))}
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
            </div>
          </PhotoProvider>
        </Row>

        <div className="d-flex align-items-center">
          <img src={InfoIcon} alt={InfoIcon} />
          <span
            className="mx-1 roboto-regular-14px-information"
            style={{ color: "#A9A8AA", margin: "15px 0" }}
          >
            Click on “View All” to preview all images
          </span>
        </div>
      </div>
    </Container>
  );
}

export default ImageUploader;
