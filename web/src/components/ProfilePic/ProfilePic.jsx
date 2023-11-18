import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/fontawesome-free-solid";
import { CircularProgress, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// import defaultuserIcon from "../../assets/images/profile-settings/user.svg";
import defaultuserIcon from "../../assets/images/user-icon.png";
import {
  editCompanyInformation,
  setSelectedImage,
} from "../../views/redux/Settings/SettingsSlice";
import "./ProfilePic.css";
import { secureInstance } from "../../axios/config";

const ProfilePic = ({ dashboard }) => {
  const [loadingImage, setLoadingImage] = useState(false);
  // const [selectedImage, setSelectedImage] = useState(null);

  const { userImage } = useSelector((state) => state.auth.user);
  const selectedImage = useSelector((state) => state.settings.selectedImage);
  const companyInformation = useSelector(
    (state) => state.settings.companyInformation,
  );

  const dispatch = useDispatch();
  // const media = useMediaQuery;
  const matchesMobile = useMediaQuery("(min-width:475px)");

  const isMobileAndDashboard = dashboard && !matchesMobile;

  const updateNewProfilePic = (imageUrl) => {
    const updatedUser = {
      ...companyInformation.user,
      image: imageUrl,
    };

    const updateCompanyWithNewProfilePic = {
      ...companyInformation,
      image: imageUrl,
      user: updatedUser,
    };

    dispatch(
      editCompanyInformation({
        data: updateCompanyWithNewProfilePic,
        id: companyInformation.id,
      }),
    );
  };

  const handleSelectedImage = async (e) => {
    e.preventDefault();

    setLoadingImage(true);
    dispatch(setSelectedImage(e.target.files[0]));

    const formData = new FormData(); // pass in the form
    formData.append("file", e.target.files[0]);
    formData.append("content_type", e.target.files[0].type);
    try {
      const response = await secureInstance.request({
        url: "/api/users/upload-user-image/",
        method: "Post",
        data: formData,
      });
      updateNewProfilePic(response.data.data.file_url);
      setLoadingImage(false);
      // setImageUrlToUpload(response.data.data);
    } catch (e) {
      setLoadingImage(false);
      // --------- WILL ROUTE ON SOME PAGE ON FAILURE ---------
      console.log("error", e);
    }

    e.target.value = "";
  };

  return (
    <div
      className="d-flex profile-pic-container"
      style={{
        left: dashboard && "20px",
        top: dashboard && "20px",
        position: dashboard ? "relative" : "absolute",
      }}
    >
      <label htmlFor="file-input" style={{ cursor: "pointer" }}>
        {loadingImage && (
          <>
            <div
              className="d-flex justify-content-center align-items-center loading-image-container"
              style={{
                left: dashboard && "0px",
                top: dashboard && "0px",
              }}
            />

            <CircularProgress className="circular-loader" />
          </>
        )}

        <img
          className="selected-image"
          style={{
            width: isMobileAndDashboard
              ? "150px"
              : dashboard && "196px",
            height: isMobileAndDashboard
              ? "150px"
              : dashboard && "196px",
          }}
          src={
            selectedImage === null
              ? (userImage || defaultuserIcon)
              : selectedImage && URL.createObjectURL(selectedImage)
          }
          alt=""
        />

        <div
          className="camera-icon-container"
          style={{
            left: isMobileAndDashboard ? "110px" : dashboard && "142px",
          }}
        >
          <FontAwesomeIcon icon={faCamera} style={{ color: "black" }} />
        </div>
      </label>

      <input
        style={{ width: "50px", display: "none" }}
        onChange={(event) => handleSelectedImage(event)}
        id="file-input"
        type="file"
      />
    </div>
  );
};

export default ProfilePic;
