import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyAccount } from "../redux/Auth/authSlice";

const VerifyAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyAndRedirect = async () => {
      if (token) {
        await dispatch(verifyAccount({ data: { token } }));
        navigate("/");
      }
    };

    verifyAndRedirect();
  }, [token]);

  return null;
};

export default VerifyAccount;
