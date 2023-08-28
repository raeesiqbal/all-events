/* eslint-disable camelcase */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { secureInstance } from "../../../axios/config";

// Create an initial state for the auth slice
const initialState = {
  loading: false,
  error: null,
  chats: [],
  ChatSuccessAlert: false,
  ChatErrorAlert: false,
};

export const handleStartChat = createAsyncThunk(
  "Chats/create",
  async ({ data, navigate }, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/analytics/ad-chat/start-chat/",
        method: "Post",
        data,
      });
      setTimeout(() => {
        navigate("/chats");
      }, 1000);
      return response.data; // Assuming your loginAPI returns data with access_token, user_id, and role_id
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

export const listChats = createAsyncThunk(
  "Chats/list",
  async (data, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/analytics/ad-chat/",
        method: "Get",
      });
      return response.data; // Assuming your loginAPI returns data with access_token, user_id, and role_id
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

// Create the ChatsSlice
export const ChatsSlice = createSlice({
  name: "Chats",
  initialState,
  reducers: {
    handleResgisterationStatus: (state) => {
      state.isRegistered = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleStartChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleStartChat.fulfilled, (state) => {
        state.loading = false;
        state.ChatSuccessAlert = true;
      })
      .addCase(handleStartChat.rejected, (state, action) => {
        state.loading = false;
        state.ChatErrorAlert = action.payload;
        // state.error = action.payload;
      })
      .addCase(listChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload.data;
      })
      .addCase(listChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  handleResgisterationStatus,
} = ChatsSlice.actions;

// Export the reducer and actions
export default ChatsSlice.reducer;
