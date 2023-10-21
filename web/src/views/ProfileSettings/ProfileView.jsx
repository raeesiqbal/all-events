import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileSettings from "./ProfileSettings";
import PersonalInformation from "./PersonalInformation";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";
import CompanyInformationSettings from "./CompanyInformation";
import PaymentMethod from "./PaymentMethod";

function ProfileView() {
  const profileSettingsCurrentView = useSelector(
    (state) => state.tabNavigation.profileSettingsCurrentView,
  );

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
      {profileSettingsCurrentView === "PaymentMethod" && <PaymentMethod />}
    </>
  );
}

export default ProfileView;
