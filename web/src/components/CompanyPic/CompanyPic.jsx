import React, { useEffect, useState } from "react";
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
import "./CompanyPic.css";
import { secureInstance } from "../../axios/config";

const CompanyPic = ({ dashboard }) => {
  const [loadingImage, setLoadingImage] = useState(false);
  // const [selectedImage, setSelectedImage] = useState(null);

  const selectedImage = useSelector((state) => state.settings.selectedImage);
  const companyInformation = useSelector(
    (state) => state.settings.companyInformation,
  );
  const { userCompany } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  // const media = useMediaQuery;
  const matchesMobile = useMediaQuery("(min-width:475px)");

  const isMobileAndDashboard = dashboard && !matchesMobile;

  const updateNewCompanyPic = (imageUrl) => {
    const updatedUser = {
      ...companyInformation.user,
      image: imageUrl,
    };

    const updateCompanyWithNewCompanyPic = {
      ...companyInformation,
      image: imageUrl,
      user: updatedUser,
    };

    dispatch(
      editCompanyInformation({
        data: updateCompanyWithNewCompanyPic,
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
        url: "/api/companies/upload-company-image/",
        method: "Post",
        data: formData,
      });
      updateNewCompanyPic(response.data.data.file_url);
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

        {((selectedImage !== null) || (userCompany?.image !== null && userCompany?.image !== "")) ? (
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
                ? userCompany?.image
                : selectedImage && URL.createObjectURL(selectedImage)
            }
            alt=""
          />
        ) : (
          <img
            className="selected-image"
            src={defaultuserIcon}
            alt=""
            style={{
              width: isMobileAndDashboard
                ? "150px"
                : dashboard && "196px",
              height: isMobileAndDashboard
                ? "150px"
                : dashboard && "196px",
            }}
          />
        )}

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

export default CompanyPic;
