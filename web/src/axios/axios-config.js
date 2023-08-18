import axios from "axios";
// import baseURL from "../utilities/BaseURL";
// eslint-disable-next-line import/no-cycle
import {
  addAccessToken,
  handleRequestError,
  handleResponseOK,
  handleResponseError,
} from "./interceptors";
import baseURL from "../utilities/BaseURL";

const instance = axios.create({
  baseURL,
  timeout: 60000,
});

const secure_instance = axios.create({
  baseURL,
  timeout: 60000,
});

secure_instance.interceptors.request.use(addAccessToken, handleRequestError);
secure_instance.interceptors.response.use(
  handleResponseOK,
  handleResponseError
);

export { instance, secure_instance };
