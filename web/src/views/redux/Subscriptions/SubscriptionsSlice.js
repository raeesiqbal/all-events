/* eslint-disable camelcase */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance, secureInstance } from "../../../axios/config";

// Create an initial state for the auth slice
const initialState = {
  loading: false,
  listPlansLoading: false,
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
  modalInfo: {
    showModal: false,
    modalMessage: null,
    modalTitle: null,
    modalType: null,
    buttonText: null,
  },
  currentPaymentMethod: null,
  currentSubscriptionDetails: null,
  freePlan: null,
  SubscriptionSuccessAlert: false,
  SubscriptionErrorAlert: false,
};

export const createSubscription = createAsyncThunk(
  "Subscription/create",
  async ({ data, navigate }, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/subscriptions/create-subscription/",
        method: "Post",
        data,
      });
      if (response.data.data.subscribed) navigate("/checkout");
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

export const getPaymentMethod = createAsyncThunk(
  "PaymentMethod/current",
  async (data, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/subscriptions/get-payment-method/",
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

export const downloadSubscriptionInvoice = createAsyncThunk(
  "Subscription/downloadInvoice",
  async (data, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/subscriptions/download-invoice/",
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
    setShowModal: (state, action) => {
      state.modalInfo.showModal = action.payload;
    },
    setModalMessage: (state, action) => {
      state.modalInfo.modalMessage = action.payload;
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
        if (action.payload.data.subscribed) {
          state.modalInfo.showModal = false;
          state.modalInfo.buttonText = null;
          state.modalInfo.modalType = null;
          state.modalInfo.modalTitle = null;
          state.modalInfo.modalMessage = null;
          state.clientSecret = action.payload.data.clientSecret;
          state.subscriptionId = action.payload.data.subscriptionId;
        } else {
          state.modalInfo.modalMessage = action.payload.message;
          state.modalInfo.modalTitle = "Subscription Error";
          state.modalInfo.modalType = "create";
          state.modalInfo.buttonText = "Go to my ads";
          state.modalInfo.showModal = true;
        }
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

        if (action.payload.data === null) {
          state.modalInfo.buttonText = "See our plans";
          state.modalInfo.modalType = "no_subscription";
          state.modalInfo.modalTitle = "Subscribe to a Plan";
          state.modalInfo.modalMessage = "You have no active subscription, please check our subscription plans.";
        } else if (action.payload.data.status === "unpaid") {
          state.modalInfo.buttonText = "Update Payment Method";
          state.modalInfo.modalType = "unpaid";
          state.modalInfo.modalTitle = "Payment Failed!";
          state.modalInfo.modalMessage = `We are unable to renew your subscription.
                                          <br />
                                          Please update your payment information to continue.`;
        } else {
          state.modalInfo.showModal = false;
          state.modalInfo.buttonText = null;
          state.modalInfo.modalType = null;
          state.modalInfo.modalTitle = null;
          state.modalInfo.modalMessage = null;
        }
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
        state.SubscriptionSuccessAlert = true;
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
        state.SubscriptionSuccessAlert = true;
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
        state.SubscriptionSuccessAlert = true;
        state.error = action.payload.message;
      })
      .addCase(resumeSubscription.rejected, (state, action) => {
        state.loading = false;
        state.SubscriptionErrorAlert = true;
        state.error = action.payload;
      })
      .addCase(listPlans.pending, (state) => {
        state.listPlansLoading = true;
        state.SubscriptionSuccessAlert = false;
        state.SubscriptionErrorAlert = false;
        state.error = null;
      })
      .addCase(listPlans.fulfilled, (state, action) => {
        state.listPlansLoading = false;
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
        state.listPlansLoading = false;
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
      })
      .addCase(getPaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPaymentMethod = action.payload.data;
      })
      .addCase(getPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(downloadSubscriptionInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadSubscriptionInvoice.fulfilled, (state, action) => {
        state.loading = false;

        const a = document.createElement("a");
        a.href = action.payload.data;
        a.click();

        window.URL.revokeObjectURL(action.payload.data);
      })
      .addCase(downloadSubscriptionInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const {
  handleMessageAlerts,
  setShowModal,
} = SubscriptionsSlice.actions;

// Export the reducer and actions
export default SubscriptionsSlice.reducer;
