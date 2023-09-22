/* eslint-disable camelcase */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance, secureInstance } from "../../../axios/config";

// Create an initial state for the auth slice
const initialState = {
  loading: false,
  error: null,
  subscriptions: [],
  plans: [],
  clientSecret: "",
  subscriptionId: "",
  activeCount: 0,
  expiredCount: 0,
  SubscriptionSuccessAlert: false,
  SubscriptionErrorAlert: false,
};

export const createSubscription = createAsyncThunk(
  "Subscription/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/subscriptions/create-subscription/",
        method: "Post",
        data,
      });
      return response.data;
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

export const listPlans = createAsyncThunk(
  "Subscription/plansList",
  async (isLoggedIn, { rejectWithValue }) => {
    try {
      const request = isLoggedIn ? secureInstance : instance;
      const response = await request.request({
        url: "/api/subscriptions/products/",
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

export const listSubscriptions = createAsyncThunk(
  "Subscription/list",
  async (data, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/subscriptions/my-subscriptions/",
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

// Create the SubscriptionsSlice
export const SubscriptionsSlice = createSlice({
  name: "Subscriptions",
  initialState,
  reducers: {
    handleResgisterationStatus: (state) => {
      state.isRegistered = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.data.clientSecret;
        state.subscriptionId = action.payload.data.subscriptionId;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(listPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload.data.data;
        // state.activeCount = action.payload.active_count;
        // state.expiredCount = action.payload.expired_count;
      })
      .addCase(listPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(listSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload.data;
      })
      .addCase(listSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  handleResgisterationStatus,
} = SubscriptionsSlice.actions;

// Export the reducer and actions
export default SubscriptionsSlice.reducer;
