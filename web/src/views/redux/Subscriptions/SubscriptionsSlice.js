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
  currentSubscription: {
    intervalCount: "1",
    interval: "month",
    priceId: "",
    subscriptionId: "",
  },
  currentSubscriptionDetails: null,
  freePlan: null,
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

export const currentSubscriptionDetails = createAsyncThunk(
  "Subscription/details",
  async (data, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/subscriptions/current-subscription/",
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

export const updateSubscription = createAsyncThunk(
  "Subscription/update",
  async ({ data, navigate }, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/subscriptions/update-subscription/",
        method: "Post",
        data,
      });
      return { ...response.data, navigate };
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

export const cancelSubscription = createAsyncThunk(
  "Subscription/cancel",
  async (data, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/subscriptions/cancel-subscription/",
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

export const resumeSubscription = createAsyncThunk(
  "Subscription/resume",
  async (data, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/subscriptions/resume-subscription/",
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
    handleMessageAlerts: (state) => {
      state.SubscriptionSuccessAlert = false;
      state.SubscriptionErrorAlert = false;
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
      .addCase(currentSubscriptionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(currentSubscriptionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscriptionDetails = action.payload.data;
      })
      .addCase(currentSubscriptionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSubscription.pending, (state) => {
        state.loading = true;
        state.SubscriptionSuccessAlert = false;
        state.SubscriptionErrorAlert = false;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.SubscriptionSuccessAlert = action.payload.data.updated;
        state.SubscriptionErrorAlert = !action.payload.data.updated;
        state.error = action.payload.message;
        if (action.payload.data.updated) {
          action.payload.navigate("/subscriptions");
        }
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.loading = false;
        state.SubscriptionErrorAlert = true;
        state.error = action.payload;
      })
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.SubscriptionSuccessAlert = false;
        state.SubscriptionErrorAlert = false;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.SubscriptionSuccessAlert = action.payload.data.cancelled || false;
        state.SubscriptionErrorAlert = !(action.payload.data.cancelled || true);
        state.error = action.payload.message;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.SubscriptionErrorAlert = true;
        state.error = action.payload;
      })
      .addCase(resumeSubscription.pending, (state) => {
        state.loading = true;
        state.SubscriptionSuccessAlert = false;
        state.SubscriptionErrorAlert = false;
        state.error = null;
      })
      .addCase(resumeSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.SubscriptionSuccessAlert = action.payload.data.resumed || false;
        state.SubscriptionErrorAlert = !(action.payload.data.resumed || true);
        state.error = action.payload.message;
      })
      .addCase(resumeSubscription.rejected, (state, action) => {
        state.loading = false;
        state.SubscriptionErrorAlert = true;
        state.error = action.payload;
      })
      .addCase(listPlans.pending, (state) => {
        state.loading = true;
        state.SubscriptionSuccessAlert = false;
        state.SubscriptionErrorAlert = false;
        state.error = null;
      })
      .addCase(listPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload.data.products;
        if (action.payload.data.current_subscription !== null) {
          state.currentSubscription.priceId = action.payload.data.current_subscription.price_id;
          state.currentSubscription.interval = action.payload.data.current_subscription.interval;
          state.currentSubscription.intervalCount = action.payload.data.current_subscription.interval_count;
          state.currentSubscription.subscriptionId = action.payload.data.current_subscription.subscription_id;
        }
        state.freePlan = action.payload.data.free_plan;
      })
      .addCase(listPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(listSubscriptions.pending, (state) => {
        state.loading = true;
        state.SubscriptionSuccessAlert = false;
        state.SubscriptionErrorAlert = false;
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
  handleMessageAlerts,
} = SubscriptionsSlice.actions;

// Export the reducer and actions
export default SubscriptionsSlice.reducer;
