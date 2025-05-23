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
import reviewsReducer from "../views/redux/Reviews/ReviewsSlice";
import searchReducer from "../views/redux/Search/SearchSlice";
import subscriptionReducer from "../views/redux/Subscriptions/SubscriptionsSlice";
import analyticsReducer from "../views/redux/Analytics/AnalyticsSlice";
import calendarsReducer from "../views/redux/Calendars/CalendarsSlice";
import utilsReducer from "../views/redux/Utils/UtilsSlice";
import contactReducer from "../views/redux/Contacts/ContactsSlice";

const rootReducer = combineReducers({
  Ads: AdsReducer,
  analytics: analyticsReducer,
  auth: authReducer,
  calendars: calendarsReducer,
  chats: chatsReducer,
  contact: contactReducer,
  login: loginReducer,
  messages: messagesReducer,
  register: registerReducer,
  reviews: reviewsReducer,
  search: searchReducer,
  settings: settingsReducer,
  stepper: stepperReducer,
  subscriptions: subscriptionReducer,
  tabNavigation: TabNavigationReducer,
  utils: utilsReducer,
});

export default rootReducer;
