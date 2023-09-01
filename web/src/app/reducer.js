import { combineReducers } from "@reduxjs/toolkit";
import loginReducer from "../views/redux/Login/loginSlice";
import registerReducer from "../views/redux/Register/RegisterSlice";
import stepperReducer from "../views/redux/Stepper/StepperSlice";
import authReducer from "../views/redux/Auth/authSlice";
import TabNavigationReducer from "../views/redux/TabNavigation/TabNavigationSlice";
import AdsReducer from "../views/redux/Posts/AdsSlice";
import settingsReducer from "../views/redux/Settings/SettingsSlice";
import chatsReducer from "../views/redux/Chats/ChatsSlice";
import messagesReducer from "../views/redux/Messages/MessagesSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  login: loginReducer,
  register: registerReducer,
  stepper: stepperReducer,
  tabNavigation: TabNavigationReducer,
  Ads: AdsReducer,
  settings: settingsReducer,
  chats: chatsReducer,
  messages: messagesReducer,
});

export default rootReducer;
