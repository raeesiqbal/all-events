import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileSettings from "./ProfileSettings";
import PersonalInformation from "./PersonalInformation";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";
import CompanyInformationSettings from "./CompanyInformation";
import { handleProfileSettingsCurrentView } from "../redux/TabNavigation/TabNavigationSlice";

function ProfileView() {
  const dispatch = useDispatch();

  const profileSettingsCurrentView = useSelector(
    (state) => state.tabNavigation.profileSettingsCurrentView
  );
  useEffect(() => {
    dispatch(handleProfileSettingsCurrentView("profileSettings"));
  }, []);
  return (
    <>
      {profileSettingsCurrentView === "profileSettings" && <ProfileSettings />}
      {profileSettingsCurrentView === "PersonalInformation" && (
        <PersonalInformation />
      )}
      {profileSettingsCurrentView === "ChangePassword" && <ChangePassword />}
      {profileSettingsCurrentView === "CompanyInformation" && (
        <CompanyInformationSettings />
      )}
      {profileSettingsCurrentView === "DeleteAccount" && <DeleteAccount />}
    </>
  );
}

export default ProfileView;
