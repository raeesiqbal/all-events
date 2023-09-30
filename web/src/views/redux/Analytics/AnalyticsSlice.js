/* eslint-disable camelcase */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { secureInstance } from "../../../axios/config";

// Create an initial state for the auth slice
const initialState = {
  loading: false,
  error: null,
  vendorAds: [],
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
  async (adId, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: `/api/analytics/ad-analytics/home${adId === "0" ? "" : `?ad=${adId}`}`,
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

export const getFavAdsAnalytics = createAsyncThunk(
  "Analytics/fav-ads",
  async ({ adId, dateRange }, { rejectWithValue }) => {
    try {
      let url = `/api/analytics/ad-analytics/favourites?date_range=${dateRange || "last_month"}`;
      if (adId !== "0") url += `&ad=${adId}`;

      const response = await secureInstance.request({
        url, method: "Get",
      });
      return { ...response.data };
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

export const getReviewsAdsAnalytics = createAsyncThunk(
  "Analytics/ad-reviews",
  async ({ adId, dateRange }, { rejectWithValue }) => {
    try {
      let url = `/api/analytics/ad-analytics/reviews?date_range=${dateRange || "last_month"}`;
      if (adId !== "0") url += `&ad=${adId}`;

      const response = await secureInstance.request({
        url, method: "Get",
      });
      return { ...response.data };
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

export const getMessagesAdsAnalytics = createAsyncThunk(
  "Analytics/ad-messages",
  async ({ adId, dateRange }, { rejectWithValue }) => {
    try {
      let url = `/api/analytics/ad-analytics/messages?date_range=${dateRange || "last_month"}`;
      if (adId !== "0") url += `&ad=${adId}`;

      const response = await secureInstance.request({
        url, method: "Get",
      });
      return { ...response.data };
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
        state.vendorAds = action.payload.data.vendor_ads;
        state.totalAdFavourite = action.payload.data.total_ad_fav;
        state.totalAdReviews = action.payload.data.total_ad_reviews;
        state.totalAdMessages = action.payload.data.total_ad_messages;
      })
      .addCase(analyticsHome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFavAdsAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFavAdsAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.favAdsAnalytics = action.payload.data.result;
      })
      .addCase(getFavAdsAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getReviewsAdsAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviewsAdsAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewsAdsAnalytics = action.payload.data.result;
      })
      .addCase(getReviewsAdsAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMessagesAdsAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessagesAdsAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.messagesAdsAnalytics = action.payload.data.result;
      })
      .addCase(getMessagesAdsAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer and actions
export default AnalyticsSlice.reducer;
