/* eslint-disable jsx-a11y/media-has-caption */
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  Col, Container, Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import {
  setDeletedUrls,
  setIsMediaUploading,
  setMediaError,
  setMediaVideos, setVideosToUpload,
} from "../../views/redux/Posts/AdsSlice";
import { VIDEO_SIZE } from "../../utilities/MediaSize";

function VideoUploader() {
  const [videos, setVideos] = useState([]);
  const [deleteVideoButton, setDeleteVideoButton] = useState(true);

  const dispatch = useDispatch();
  const { isMediaUploading } = useSelector((state) => state.Ads);
  const { deletedUrls } = useSelector((state) => state.Ads);
  const mediaVideos = useSelector((state) => state.Ads.media.video);
  const videosToUpload = useSelector((state) => state.Ads.media_urls.video);
  const currentSubscription = useSelector(
    (state) => state.subscriptions.currentSubscriptionDetails,
  );

  const fileInputRef = React.createRef();

  const handleVideoUpload = async (event) => {
    event.preventDefault();

    if (event.target.value === "") return;

    setDeleteVideoButton(false);
    dispatch(setIsMediaUploading(true));

    const uploadedVideo = event.target.files[0];

    if (uploadedVideo && (uploadedVideo.size / (1024 * 1024)) <= VIDEO_SIZE) {
      const reader = new FileReader();

      reader.onload = () => {
        setVideos((prevVideos) => [
          ...prevVideos,
          {
            previewURL: reader.result, uploading: true, type: "new", index: mediaVideos.length,
          },
        ]);
      };
      reader.readAsDataURL(uploadedVideo);

      dispatch(setMediaVideos([...mediaVideos, uploadedVideo]));
      setVideos((prevVideos) => prevVideos.map((video) => (video.file === uploadedVideo
        ? { ...video, uploading: false } // Mark the uploaded video as not uploading
        : video)));

      // Reset the file input after handling the upload
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      dispatch(setMediaError(`Video size should be less than or equal to ${VIDEO_SIZE}MB`));
      setTimeout(() => {
        dispatch(setMediaError(null));
      }, 4000);
    }

    setDeleteVideoButton(true);
    dispatch(setIsMediaUploading(false));
  };

  const removeVideo = async (video, index) => {
    setDeleteVideoButton(false);

    const videoIndex = videos.indexOf(video);

    if (videoIndex !== -1) {
      const cloneVideos = [...videos];
      cloneVideos.splice(index, 1);
      setVideos(cloneVideos);

      if (video.type === "new") {
        const cloneMediaVideos = [...mediaVideos];
        cloneMediaVideos.splice(video.index, 1);
        dispatch(setMediaVideos(cloneMediaVideos));
      } else {
        const urlToDelete = videosToUpload[index];

        dispatch(setDeletedUrls([...deletedUrls, urlToDelete]));

        const videoToUploadIndex = videosToUpload.indexOf(video.previewURL);

        const cloneVideosToUpload = [...videosToUpload];

        if (videoToUploadIndex !== -1) {
          cloneVideosToUpload.splice(index, 1);
        }
        dispatch(setVideosToUpload(cloneVideosToUpload));
      }
    }

    setDeleteVideoButton(true);
  };

  useEffect(() => {
    if (videosToUpload.length > 0 && videos.length === 0) setVideos(videosToUpload.map((video) => ({ previewURL: video, type: "old" })));
  }, [videosToUpload]);

  return (
    <Container fluid style={{ marginTop: "40px" }}>
      <span className="roboto-medium-20px-body1">Upload Video</span>
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
            Upload a creative video showcasing your past work
          </li>
          <li
            className="roboto-regular-16px-information"
            style={{ color: "#A9A8AA", lineHeight: "22px" }}
          >
            Videos can be upload in MP4 format
          </li>
          <li
            className="roboto-regular-16px-information"
            style={{ color: "#A9A8AA", lineHeight: "22px" }}
          >
            Size of videos cannot exceed 25 Mb
          </li>
        </ul>

        <Row className="h-100 col-12 g-0 flex-column-reverse flex-md-row">
          <div className="d-flex" style={{ flexWrap: "wrap" }}>
            {videos?.map((video, index) => (
              <Col md={3} lg={3} key={index}>
                <div className="mb-5">
                  {video !== null && (
                    <div
                      style={{
                        position: "relative",
                        width: "145px",
                        height: "126px",
                      }}
                    >
                      {video.uploading && (
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

                              backgroundColor: "rgba(108, 117, 125, 0.3)",
                              backdropFilter: "blur(1px)",
                              zIndex: 2,
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
                      )}

                      <video
                        style={{
                          width: "145px",
                          height: "122px",
                          objectFit: "cover",
                        }}
                        src={video.previewURL ?? video}
                        controls
                      />
                      {deleteVideoButton ? (
                        <button
                          type="button"
                          style={{ position: "absolute", top: "0", right: "0" }}
                          className="upload-img-close-btn"
                          onClick={() => removeVideo(video, index)}
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
                    </div>
                  )}
                </div>
              </Col>
            ))}

            {!isMediaUploading
              && currentSubscription
              && currentSubscription?.type?.allowed_ad_videos
                > videos.length && (
                <div
                  style={{
                    border: "2px dashed #A0C49D",
                    width: "141px",
                    height: "122px",
                  }}
                >
                  <label
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "141px",
                      height: "122px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      style={{ display: "none" }}
                      key={videos.length} // Add a unique key to force reset on new selection
                      ref={fileInputRef}
                    />
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
                </div>
            )}
          </div>
        </Row>
      </div>
    </Container>
  );
}

export default VideoUploader;
