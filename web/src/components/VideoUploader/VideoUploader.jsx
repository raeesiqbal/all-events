import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { secure_instance } from "../../axios/axios-config";
import {
  setIsMediaUploading,
  setMediaError,
} from "../../views/redux/Posts/AdsSlice";

function VideoUploader({ setVideoToUpload, videoToUpload }) {
  const [video, setVideo] = useState(null);

  const dispatch = useDispatch();
  const isMediaUploading = useSelector((state) => state.Ads.isMediaUploading);

  const uploadFileToCloud = async (uploadedVideo) => {
    // const videoToUpload = {
    //   file_name: uploadedVideo.name,
    //   content_type: uploadedVideo.type,
    //   upload_type: "video",
    // };
    dispatch(setIsMediaUploading(true));
    const formData = new FormData(); // pass in the form
    formData.append("file", uploadedVideo);
    formData.append("content_type", uploadedVideo.type);

    try {
      const request = await secure_instance.request({
        url: "/api/ads/upload-url/",
        method: "Post",
        data: formData,
      });
      setVideoToUpload([request.data.data.file_url]);
      dispatch(setIsMediaUploading(false));
    } catch (e) {
      dispatch(setMediaError("Video upload failed"));
      dispatch(setIsMediaUploading(false));
      // --------- WILL ROUTE ON SOME PAGE ON FAILURE ---------
      console.log("error", e);
    }
  };

  const handleVideoUpload = (event) => {
    const uploadedVideo = event.target.files[0];

    if (uploadedVideo && uploadedVideo.size <= 25000000) {
      const reader = new FileReader();

      reader.onload = () => {
        setVideo({
          file: uploadedVideo,
          previewURL: reader.result,
        });
      };
      // setparentVideoUploaded(uploadedVideo);
      uploadFileToCloud(uploadedVideo);

      console.log("uploadedVideo", uploadedVideo);
      reader.readAsDataURL(uploadedVideo);
    } else {
      // Handle video size error
      console.log("Video size should be less than or equal to 25MB");
    }
  };

  // const removeVideo = () => {
  //   setVideo(null);
  // };

  // console.log(videoToPreview);

  const removeVideo = async () => {
    const urlToDelete = videoToUpload;

    try {
      const request = await secure_instance.request({
        url: "/api/ads/delete-url/",
        method: "Post",
        data: {
          url: urlToDelete[0],
        },
      });
      console.log("request", request);
      // ----------------do this inside redux
      if (request.status === 200) {
        setVideo(null);
      }
    } catch (err) {}

    setVideoToUpload([]);
  };

  useEffect(() => {
    if (videoToUpload.length > 0) {
      setVideo(videoToUpload);
    }
  }, [videoToUpload]);

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
            Images can be upload in MP4 format
          </li>
          <li
            className="roboto-regular-16px-information"
            style={{ color: "#A9A8AA", lineHeight: "22px" }}
          >
            Size of images cannot exceed 25 Mb
          </li>
        </ul>

        {video !== null ? (
          <div
            style={{
              position: "relative",
              width: "145px",
              height: "126px",
            }}
          >
            {isMediaUploading && (
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
              style={{ width: "145px", height: "122px", objectFit: "cover" }}
              src={video.previewURL ?? video}
              controls
            />
            <button
              type="button"
              style={{ position: "absolute", top: "0", right: "0" }}
              className="upload-img-close-btn"
              onClick={removeVideo}
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
        ) : (
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
    </Container>
  );
}

export default VideoUploader;
