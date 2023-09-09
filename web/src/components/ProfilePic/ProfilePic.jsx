import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/fontawesome-free-solid";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import defaultuserIcon from "../../assets/images/profile-settings/user.svg";
import {
  editCompanyInformation,
  setSelectedImage,
} from "../../views/redux/Settings/SettingsSlice";
import "./ProfilePic.css";
import { secure_instance } from "../../axios/axios-config";

const ProfilePic = () => {
  const [loadingImage, setLoadingImage] = useState(false);
  // const [selectedImage, setSelectedImage] = useState(null);

  const { userImage } = useSelector((state) => state.auth.user);
  const selectedImage = useSelector((state) => state.settings.selectedImage);
  const companyInformation = useSelector(
    (state) => state.settings.companyInformation
  );

  const dispatch = useDispatch();

  // const updateNewProfilePic = (imageUrl) => {
  //   const updateCompanyWithNewProfilePic = {
  //     ...companyInformation,
  //     image: imageUrl,
  //   };
  //   dispatch(
  //     editCompanyInformation({
  //       data: updateCompanyWithNewProfilePic,
  //       id: companyInformation.id,
  //     })
  //   );
  // };
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
      })
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
      const response = await secure_instance.request({
        url: "/api/companies/upload-url/",
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
    <div className="d-flex profile-pic-container">
      <label htmlFor="file-input" style={{ cursor: "pointer" }}>
        {loadingImage && (
          <>
            <div className="d-flex justify-content-center align-items-center loading-image-container" />

            <CircularProgress className="circular-loader" />
          </>
        )}

        {selectedImage !== null || userImage !== null ? (
          <img
            className="selected-image"
            src={
              selectedImage === null
                ? userImage
                : selectedImage && URL.createObjectURL(selectedImage)
            }
            alt=""
          />
        ) : (
          <img className="selected-image" src={defaultuserIcon} alt="" />
        )}

        <div className="camera-icon-container">
          <FontAwesomeIcon
            icon={faCamera}
            style={{ color: "black" }}
            size="md"
          />
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
