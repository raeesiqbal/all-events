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

const secureInstance = axios.create({
  baseURL,
  timeout: 60000,
});

secureInstance.interceptors.request.use(addAccessToken, handleRequestError);
secureInstance.interceptors.response.use(
  handleResponseOK,
  handleResponseError,
);

export { instance, secureInstance };
