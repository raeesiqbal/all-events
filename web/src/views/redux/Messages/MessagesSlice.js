/* eslint-disable camelcase */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { secureInstance } from "../../../axios/config";

// Create an initial state for the auth slice
const initialState = {
  loading: false,
  error: null,
  count: 0,
  messages: [],
  additionalInfo: null,
  MessageSuccessAlert: false,
  MessageErrorAlert: false,
};

export const sendMessage = createAsyncThunk(
  "Messages/send",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: `/api/analytics/ad-chat/${id}/message-create/`,
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

export const listChatMessages = createAsyncThunk(
  "Messages/list",
  async ({ id, limit, offset }, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: `/api/analytics/ad-chat/${id}/chat-message?limit=${limit}&offset=${offset}`,
        method: "Get",
      });
      return { ...response.data, offset };
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

// Create the MessagesSlice
export const MessagesSlice = createSlice({
  name: "Messages",
  initialState,
  reducers: {
    handleResgisterationStatus: (state) => {
      state.isRegistered = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false;
        state.MessageSuccessAlert = true;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.MessageErrorAlert = action.payload;
      })
      .addCase(listChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.offset === 0) {
          state.messages = action.payload.data.messages.results;
        } else {
          state.messages = [...state.messages, ...action.payload.data.messages.results];
        }
        state.additionalInfo = action.payload.data.additional_info;
        state.count = action.payload.data.messages.count;
      })
      .addCase(listChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  handleResgisterationStatus,
} = MessagesSlice.actions;

// Export the reducer and actions
export default MessagesSlice.reducer;
