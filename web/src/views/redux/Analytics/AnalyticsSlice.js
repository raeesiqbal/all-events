/* eslint-disable camelcase */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { secureInstance } from "../../../axios/config";

// Create an initial state for the auth slice
const initialState = {
  loading: false,
  error: null,
  totalAdFavourite: 0,
  totalAdReviews: 0,
  totalAdMessages: 0,
  favAdsAnalytics: [],
  reviewsAdsAnalytics: [],
  messagesAdsAnalytics: [],
  AnalyticSuccessAlert: false,
  AnalyticErrorAlert: false,
};

export const analyticsHome = createAsyncThunk(
  "Analytics/home",
  async (data, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: `/api/analytics/ad-analytics/home?date_range=${data.period}${data.adId === "0" ? "" : `&ad=${data.adId}`}`,
        method: "Get",
      });
      return response.data;
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

// Create the AnalyticsSlice
export const AnalyticsSlice = createSlice({
  name: "Analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(analyticsHome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyticsHome.fulfilled, (state, action) => {
        state.loading = false;
        state.totalAdFavourite = action.payload.data.total_ad_fav;
        state.totalAdReviews = action.payload.data.total_ad_reviews;
        state.totalAdMessages = action.payload.data.total_ad_messages;
        state.favAdsAnalytics = action.payload.data.ad_favourite_analytics;
        state.reviewsAdsAnalytics = action.payload.data.ad_review_analytics;
        state.messagesAdsAnalytics = action.payload.data.ad_message_analytics;
      })
      .addCase(analyticsHome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer and actions
export default AnalyticsSlice.reducer;
