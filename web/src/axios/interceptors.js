// eslint-disable-next-line import/no-cycle
import store from "../app/store";
import { refreshToken } from "../views/redux/Auth/authSlice";

export const addAccessToken = async (config) => {
  const state = store.getState();
  const { user } = state.auth;
  const { accessToken } = user;

  if (!accessToken) {
    await store.dispatch(refreshToken());
  } else {
    return {
      ...config,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    };
  }
};

export const handleRequestError = (error) => Promise.reject(error);

export const handleResponseOK = (response) => response;

export const handleResponseError = (error) => Promise.reject(error);

export const addInterceptors = (instance) => {
  instance.interceptors.request.use(addAccessToken, handleRequestError);
  instance.interceptors.response.use(handleResponseOK, handleResponseError);
};
