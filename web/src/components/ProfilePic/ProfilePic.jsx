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
    <div
      className="d-flex"
      style={{
        position: "absolute",
        right: "100px",
        top: "0",
      }}
    >
      <label htmlFor="file-input">
        {loadingImage && (
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
                height: "160px",
                objectFit: "cover",
                borderRadius: "50%",

                backgroundColor: "rgba(108, 117, 125, 0.3)",
                backdropFilter: "blur(1px)",
                zIndex: 2,
              }}
              className="d-flex justify-content-center align-items-center"
            />

            <CircularProgress
              style={{
                position: "absolute",
                top: "60px",
                left: "60px",
                color: "#51f742",
              }}
            />
          </>
        )}

        {selectedImage !== null || userImage !== null ? (
          <img
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "160px",
              height: "160px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
            src={
              selectedImage === null
                ? userImage
                : selectedImage && URL.createObjectURL(selectedImage)
            }
            alt=""
          />
        ) : (
          <img
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "160px",
              height: "160px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
            src={defaultuserIcon}
            alt=""
          />
        )}

        <div
          style={{
            position: "absolute",
            bottom: "0px",
            right: "0px",
            width: "30px",
            height: "30px",
            background: "#FFFFFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "30px",
            zIndex: "10",
          }}
        >
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
