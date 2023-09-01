/* eslint-disable camelcase */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { secureInstance } from "../../../axios/config";

// Create an initial state for the auth slice
const initialState = {
  loading: false,
  error: null,
  chats: [],
  inboxCount: 0,
  archivedCount: 0,
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

export const archiveChat = createAsyncThunk(
  "Chats/archive",
  async (data, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: `/api/analytics/ad-chat/${data.id}/archive/`,
        method: "Patch",
        data: { is_archived: data.is_archived },
      });
      return response.data; // Assuming your loginAPI returns data with access_token, user_id, and role_id
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

export const deleteChat = createAsyncThunk(
  "Chats/delete",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: `/api/analytics/ad-chat/${id}/`,
        method: "Delete",
      });

      return response.data;
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
      })
      .addCase(listChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload.data;
        state.inboxCount = action.payload.inbox_count;
        state.archivedCount = action.payload.archived_count;
      })
      .addCase(listChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(archiveChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(archiveChat.fulfilled, (state) => {
        state.loading = false;
        state.ChatSuccessAlert = true;
      })
      .addCase(archiveChat.rejected, (state, action) => {
        state.loading = false;
        state.ChatErrorAlert = action.payload;
      })
      .addCase(deleteChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChat.fulfilled, (state) => {
        state.loading = false;
        state.ChatSuccessAlert = true;
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.loading = false;
        state.ChatErrorAlert = action.payload;
      });
  },
});

export const {
  handleResgisterationStatus,
} = ChatsSlice.actions;

// Export the reducer and actions
export default ChatsSlice.reducer;
