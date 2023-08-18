let baseURL = "";

if (window && window._env_ && window._env_.REACT_APP_GW_URL) {
  baseURL = window._env_.REACT_APP_GW_URL;
} else {
  baseURL = "http://127.0.0.1:8000";
}
export default baseURL;

