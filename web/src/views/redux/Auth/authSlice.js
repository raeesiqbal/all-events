/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance, secureInstance } from "../../../axios/config";
import { getCookie, setCookie } from "../../../utilities/utils";

// Create an initial state for the auth slice
const initialState = {
  user: {
    accessToken: null,
    userId: null,
    role: null,
    userCompanyId: null,
    userImage: null,
    first_name: null,
    last_name: null,
    is_verified: true,
  },
  showVerifyModal: false,
  userCompany: null,
  screenLoading: false,
  isRegistered: false,
  isLoggedInState: false,
  isWelcomeUserAlert: false,
  loading: false,
  error: null,
  UserSuccessAlert: false,
  UserErrorAlert: false,
};

// Asynchronous action to handle login
export const handleRegister = createAsyncThunk(
  "auth/register",
  async ({ data, role }, { rejectWithValue }) => {
    try {
      const response = await instance.request({
        url: role === "vendor" ? "/api/companies/" : "/api/clients/",
        method: "Post",
        data,
      });
      // window.location.replace("/");
      return response.data; // Assuming your loginAPI returns data with access_token, user_id, and role_id
    } catch (err) {
      // Handle login error here if needed
      return rejectWithValue(err.response.data);
    }
  },
);

export const handleLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await instance.request({
        url: "/api/token/?accept=application/json",
        method: "Post",
        data: {
          email,
          password,
        },
      });
      setCookie("refresh_token", response.data.refresh, 7);

      return response.data; // Assuming your loginAPI returns data with access_token, user_id, and role_id
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

export const refreshToken = createAsyncThunk("auth/refresh", async () => {
  const request = await instance.request({
    url: "/api/token/refresh/",
    method: "Post",
    data: {
      refresh: getCookie("refresh_token"),
    },
  });
  return request.data;
});

export const getAuthenticatedUser = createAsyncThunk(
  "auth/authenticatedUser",
  async () => {
    const response = await secureInstance.request({
      url: "/api/users/me/",
      method: "GET",
    });
    return response.data;
  },
);

export const sendVerifyAccountEmail = createAsyncThunk(
  "auth/sendVerifyAccountEmail",
  async (data, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: `/api/users/verify-account-email/`,
        method: "Get",
      });
      // window.location.replace("/");
      return response.data; // Assuming your loginAPI returns data with access_token, user_id, and role_id
    } catch (err) {
      // Handle login error here if needed
      return rejectWithValue(err.response.data);
    }
  },
);

export const verifyAccount = createAsyncThunk(
  "auth/verifyAccount",
  async ({ data, isLoggedInState }, { rejectWithValue }) => {
    try {
      const request = isLoggedInState ? secureInstance : instance;
      const response = await request.request({
        url: "/api/users/verify-account/",
        method: "Patch",
        data,
      });

      // window.location.replace("/");
      return { ...response.data, isLoggedInState }; // Assuming your loginAPI returns data with access_token, user_id, and role_id
    } catch (err) {
      // Handle login error here if needed
      return rejectWithValue(err.response.data);
    }
  },
);

// Create the loginSlice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleResgisterationStatus: (state) => {
      state.isRegistered = false;
    },
    handleLoginStatus: (state, action) => {
      state.isLoggedInState = action.payload;
    },
    handleWelcomeUserAlert: (state, action) => {
      state.isWelcomeUserAlert = action.payload;
    },
    handleUserAlerts: (state) => {
      state.UserSuccessAlert = false;
      state.UserErrorAlert = false;
      state.error = "";
    },
    setScreenLoading: (state, action) => {
      state.screenLoading = action.payload;
    },
    setShowVerifyModal: (state, action) => {
      state.showVerifyModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.loading = false;
        const { access, user } = action.payload;
        state.user.accessToken = access;
        state.user.userId = user.id;
        state.user.userImage = user.image;
        state.user.userCompanyId = user.user_company?.id;
        state.user.first_name = user.first_name;
        state.user.last_name = user.last_name;
        state.user.role = user.role_type;
        state.user.is_verified = user.is_verified;
        state.isLoggedInState = true;
        state.userCompany = user.user_company;
      })
      .addCase(handleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.UserSuccessAlert = false;
        state.UserErrorAlert = false;
      })
      .addCase(verifyAccount.fulfilled, (state, action) => {
        state.loading = false;
        const {
          access, user, isLoggedInState,
        } = action.payload;
        if (!isLoggedInState) {
          state.user.accessToken = access;
          state.user.userId = user.id;
          state.user.userImage = user.image;
          state.user.userCompanyId = user.user_company?.id;
          state.user.first_name = user.first_name;
          state.user.last_name = user.last_name;
          state.user.role = user.role_type;
          state.user.is_verified = user.is_verified;
          state.isLoggedInState = true;
          state.userCompany = user.user_company;
        }
        state.error = action.payload.message;
        state.UserSuccessAlert = true;
      })
      .addCase(verifyAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.UserErrorAlert = true;
      })
      .addCase(sendVerifyAccountEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendVerifyAccountEmail.fulfilled, (state) => {
        state.showVerifyModal = true;
      })
      .addCase(sendVerifyAccountEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(handleRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleRegister.fulfilled, (state) => {
        state.loading = false;
        state.isRegistered = true;
      })
      .addCase(handleRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        const { access } = action.payload;
        state.user.accessToken = access;
        state.isLoggedInState = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;
        // state.error = action.error.message;
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      })
      .addCase(getAuthenticatedUser.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.user.userId = data.id;
        state.user.role = data.role_type;
        state.user.first_name = data.first_name;
        state.user.last_name = data.last_name;
        state.user.userCompanyId = data.user_company?.id;
        state.user.userImage = data?.image;
        state.user.is_verified = data.is_verified;
        state.userCompany = data?.user_company;
        // state.loading = false;
        // state.error = action.error.message;
        // state.user.accessToken = access;
      })
      .addCase(getAuthenticatedUser.rejected, () => {
      });
  },
});

export const {
  handleResgisterationStatus,
  handleLoginStatus,
  handleWelcomeUserAlert,
  handleUserAlerts,
  setScreenLoading,
  setShowVerifyModal,
} = authSlice.actions;

// Export the reducer and actions
export default authSlice.reducer;
