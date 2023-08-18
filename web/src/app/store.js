// import { applyMiddleware } from 'redux'
import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducer";

const composedEnhancer = composeWithDevTools(
  applyMiddleware(thunkMiddleware)
  // other store enhancers if any
);

const store = configureStore({ reducer: rootReducer }, composedEnhancer);
export default store;
