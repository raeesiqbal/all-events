import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyAccount } from "../redux/Auth/authSlice";

const VerifyAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const { isLoggedInState } = useSelector((state) => state.auth);

  if (token) dispatch(verifyAccount({ data: { token }, isLoggedInState }));

  navigate("/");
};

export default VerifyAccount;
