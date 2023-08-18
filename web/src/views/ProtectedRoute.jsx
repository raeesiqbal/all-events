import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import CircularProgress from "@mui/material/CircularProgress";
import { getAuthenticatedUser, refreshToken } from "./redux/Auth/authSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  useEffect(() => {
    if (user.userId === null && user.accessToken !== null) {
      dispatch(getAuthenticatedUser());
    }
  }, [user, user.accessToken]);

  if (user?.accessToken) {
    return children;
  }
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
      }}
      className="d-flex justify-content-center align-items-center"
    >
      <CircularProgress
        style={{
          color: "#fa7b03",
          height: "50px",
          width: "50px",
        }}
      />
    </div>
  );
};

export default ProtectedRoute;
