import React, { useEffect, useState } from "react";
import {
  Button, Col, Form, Modal, Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { secureInstance } from "../../axios/config";
import { setImagesToUpload, uploadImagesToCloud } from "../redux/Posts/AdsSlice";
import { addReview, listAdReviews } from "../redux/Reviews/ReviewsSlice";
import Rating from "../../components/Rating/Rating";
import titleIcon from "../../assets/images/title_icon.svg";
import Review from "./Review";
import "./Reviews.css";

const Reviews = ({ adId, adName }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const reviews = useSelector((state) => state.reviews.reviews);
  const imagesToUpload = useSelector((state) => state.Ads.media_urls.images);
  const offset = 0;
  const page = 1;
  const [limit, setLimit] = useState(10);
  const [isDisabled, setIsDisabled] = useState(true);
  const [postReview, setPostReview] = useState({
    name: "",
    title: "",
    message: "",
    rating: 0,
  });
  const [isHide, setIsHide] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (event) => {
    setIsLoading(true);
    event.preventDefault();
    const uploadedImage = event.target.files[0];
    const updatedImages = [...postReview.photos];

    const reader = new FileReader();

    reader.onload = () => {
      updatedImages.push({
        file: uploadedImage,
        previewURL: reader.result,
      });
      setPostReview({
        ...postReview,
        photos: updatedImages,
      });
    };
    reader.readAsDataURL(uploadedImage);
    dispatch(uploadImagesToCloud(uploadedImage));
    event.target.value = "";
  };

  const removeImage = async (image, index) => {
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
        const imageIndex = postReview.photos.indexOf(image);

        const cloneImages = [...postReview.photos];

        if (imageIndex !== -1) {
          cloneImages.splice(index, 1);
        }

        setPostReview({
          ...postReview,
          photos: cloneImages,
        });

        const imageToUploadIndex = imagesToUpload.indexOf(image);

        const cloneImagesToUpload = [...imagesToUpload];

        if (imageToUploadIndex !== -1) {
          cloneImagesToUpload.splice(index, 1);
        }
        dispatch(setImagesToUpload(cloneImagesToUpload));
      }
    } catch (err) {
      console.log(err.message);
    }

    const imageIndex = postReview.photos.indexOf(image);

    const cloneImages = [...postReview.photos];

    if (imageIndex !== -1) {
      cloneImages.splice(index, 1);
    }

    setPostReview({
      ...postReview,
      photos: cloneImages,
    });
  };

  const removeAllImages = async (images) => {
    try {
      const response = await secureInstance.request({
        url: "/api/ads/delete-urls/",
        method: "Post",
        data: {
          urls: images,
        },
      });
      // ----------------do this inside redux
      if (response.status === 200) {
        setPostReview({
          ...postReview,
          photos: [],
        });

        dispatch(setImagesToUpload([]));
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const resetForm = (isDelete = true) => {
    if (isDelete) removeAllImages(imagesToUpload);
    setPostReview({
      name: "",
      title: "",
      message: "",
      rating: 0,
    });
    setIsDisabled(true);
  };

  const submitReview = () => {
    dispatch(addReview({ id: adId, data: postReview }));
    setIsHide(true);
    resetForm(false);
  };

  const viewMoreReviews = () => {
    setLimit(limit + 10);
    dispatch(listAdReviews({
      id: adId,
      offset,
      limit,
      page,
    }));
  };

  useEffect(() => {
    if (isHide) {
      setTimeout(() => {
        dispatch(listAdReviews({
          id: adId,
          offset,
          limit,
          page,
        }));
      }, 1000);
    }
  }, [isHide]);

  useEffect(() => {
    if (postReview.title !== "" && postReview.message !== "" && postReview.rating !== 0) {
      setIsDisabled(user.userId === null ? postReview.name === "" : false);
    }
  }, [postReview]);

  useEffect(() => {
    dispatch(listAdReviews({
      id: adId,
      offset,
      limit,
      page,
    }));
  }, []);

  useEffect(() => {
    setPostReview({
      ...postReview,
      photos: imagesToUpload,
    });
    setIsLoading(false);
  }, [imagesToUpload]);

  return (
    <>
      <Modal
        show={!isHide}
        onHide={() => setIsHide(true)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered="true"
      >
        <div className="box" style={{ position: "absolute", right: "0" }} />
        <div
          style={{
            position: "absolute",
            right: "10px",
            top: "8px",
            zIndex: "20",
          }}
        >
          <div role="presentation" onClick={() => setIsHide(true)} className="close-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              style={{ cursor: "pointer" }}
            >
              <path
                d="M17 1L1 17M1 1L17 17"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <Modal.Body className="p-4">
          <div className="w-100 text-center" style={{ fontSize: "24px", fontWeight: "600" }}>Add Review</div>
          <div className="w-100 py-2 mb-2" style={{ fontSize: "20px", color: "#5A5A5A" }}>{adName}</div>
          <Form>
            <Row>
              <Col sm={5}>
                {
                  user?.role === null && (
                    <div className="w-100 mb-4">
                      <div className="d-flex w-100 mb-3">
                        <img src={titleIcon} alt="T" className="me-3" style={{ width: "32px", height: "32px" }} />
                        <div className="my-auto" style={{ fontSize: "20px", fontWeight: "500" }}>Your name</div>
                      </div>
                      <Form.Control
                        className="p-3"
                        type="text"
                        placeholder="Enter name"
                        value={postReview.name}
                        onChange={(e) => setPostReview({
                          ...postReview,
                          name: e.target.value,
                        })}
                      />
                    </div>
                  )
                }
                <div className="w-100 mb-4">
                  <div className="d-flex w-100 mb-3">
                    <img src={titleIcon} alt="T" className="me-3" style={{ width: "32px", height: "32px" }} />
                    <div className="my-auto" style={{ fontSize: "20px", fontWeight: "500" }}>Review title</div>
                  </div>
                  <Form.Control
                    className="p-3"
                    type="text"
                    placeholder="Enter title"
                    value={postReview.title}
                    onChange={(e) => setPostReview({
                      ...postReview,
                      title: e.target.value,
                    })}
                  />
                </div>
              </Col>
            </Row>
            <div className="w-100 mb-4">
              <div className="d-flex w-100 mb-3">
                <svg className="me-3" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#D9D9D9" />
                  <path d="M13.8958 18.2083L16.3333 16.7292L18.7708 18.2083L18.125 15.4375L20.2917 13.5625L17.4375 13.3333L16.3333 10.7083L15.2292 13.3333L12.375 13.5625L14.5417 15.4375L13.8958 18.2083ZM8 24.6667V9.66667C8 9.20833 8.16333 8.81583 8.49 8.48917C8.81667 8.1625 9.20889 7.99945 9.66667 8H23C23.4583 8 23.8508 8.16333 24.1775 8.49C24.5042 8.81667 24.6672 9.20889 24.6667 9.66667V19.6667C24.6667 20.125 24.5033 20.5175 24.1767 20.8442C23.85 21.1708 23.4578 21.3339 23 21.3333H11.3333L8 24.6667ZM10.625 19.6667H23V9.66667H9.66667V20.6042L10.625 19.6667Z" fill="#797979" fillOpacity="0.5" />
                </svg>
                <div className="my-auto" style={{ fontSize: "20px", fontWeight: "500" }}>Review and Rating</div>
              </div>
              <div className="star-rating mb-3" style={{ width: "fit-content" }}>
                {
                  [1, 2, 3, 4, 5].map((rate) => (
                    <span
                      className={postReview.rating >= rate ? "filled-star" : "empty-star"}
                      onClick={() => setPostReview({
                        ...postReview,
                        rating: rate,
                      })}
                    >
                      &#9733;
                    </span>
                  ))
                }
              </div>
              <Form.Control
                className="p-3"
                type="text"
                placeholder="Your feedback helps others"
                as="textarea"
                rows={10}
                value={postReview.message}
                onChange={(e) => setPostReview({
                  ...postReview,
                  message: e.target.value,
                })}
              />
            </div>
            <div className="w-100 mb-4">
              <ul className="text-secondary"><li>Upload photos of your event (upto 5)</li></ul>
              <div className="w-100 d-sm-flex">
                {
                  imagesToUpload.map((image, index) => (
                    <div className="upload-review-img me-2">
                      <div onClick={() => removeImage(image, index)}>-</div>
                      <img src={image} alt={index} />
                    </div>
                  ))
                }
                {
                  imagesToUpload.length < 5 && (
                    <div className="upload-review-img me-2">
                      <span>+</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} />
                    </div>
                  )
                }
              </div>
            </div>
            <Row className="w-100 mx-0">
              <Col md={5}>
                <Button variant="success" className="w-100" onClick={submitReview} disabled={isLoading || isDisabled}>Post Review</Button>
              </Col>
              <Col md={2}>
                <Button
                  variant="light"
                  className="w-100"
                  style={{ fontSize: "16px", fontWeight: "600", color: "#a0c49d" }}
                  onClick={() => resetForm()}
                >
                  Clear all
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
      <div className="w-100">
        <Row className="border-bottom border-grey mx-0 py-4">
          <Col md={3} className="ps-0">
            <Rating averageRating={reviews?.averageRating?.toFixed(1) || 0} />
          </Col>
          <Col md={9} className="d-grid py-3" style={{ alignContent: "space-between" }}>
            <h3 style={{ fontWeight: "900" }}>
              {reviews?.totalReviews || 0}
              {" "}
              Reviews
            </h3>
            {
              user?.role !== "vendor" && (
                <div>
                  <Button
                    className="btn text-success bg-white border-success px-5 py-2 border-2 font-weight-bold"
                    onClick={() => setIsHide(false)}
                  >
                    Write a review
                  </Button>
                </div>
              )
            }
          </Col>
        </Row>
        <Row className="py-4">
          {
            reviews?.data?.length > 0 ? (
              reviews.data.map((review) => <Review review={review} />)
            ) : <h3>No reviews yet</h3>
          }
        </Row>
        {
          limit === reviews?.data?.length && (
            <Row className="d-flex">
              <Button
                variant="white"
                className="text-success border-success mx-auto"
                style={{ width: "fit-content" }}
                onClick={viewMoreReviews}
              >
                View more reviews
              </Button>
            </Row>
          )
        }
      </div>
    </>
  );
};

export default Reviews;
