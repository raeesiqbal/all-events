import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import CircularProgress from "@mui/material/CircularProgress";
import { refreshToken } from "./redux/Auth/authSlice";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  useEffect(() => {
    if (role && user.role && user.role !== role) navigate("/");
  }, [role, user]);

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
