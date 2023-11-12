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
  isArchived: "False",
  suggestionsList: [],
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
      navigate(`/messages?chatId=${response.data.data.id}`);
      return response.data; // Assuming your loginAPI returns data with access_token, user_id, and role_id
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  }
);

export const listChats = createAsyncThunk(
  "Chats/list",
  async ({
    archive, limit, offset, adName, senderName,
  }, { rejectWithValue }) => {
    try {
      let url = `/api/analytics/ad-chat?archived=${archive}&limit=${limit}&offset=${offset}`;
      if (adName !== null && adName !== "" && adName !== undefined) url += `&ad__name=${adName}`;
      if (senderName !== null && senderName !== "" && senderName !== undefined) url += `&sender_name=${senderName}`;
      const response = await secureInstance.request({
        url,
        method: "Get",
      });
      return { ...response.data, archive, offset }; // Assuming your loginAPI returns data with access_token, user_id, and role_id
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  }
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
  }
);

export const readChat = createAsyncThunk(
  "Chats/readChat",
  async (id, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: `/api/analytics/ad-chat/${id}/chat-read/`,
        method: "Patch",
        data: { is_read: true },
      });
      return response.status_code;
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  }
);

export const chatsSuggestionList = createAsyncThunk(
  "Chats/suggestionList",
  async ({ keyword, keywordType }, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: `/api/analytics/ad-chat/chat-suggestion-list?keyword=${keyword}&keyword_type=${keywordType}`,
        method: "Get",
      });
      return response.data;
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteChat = createAsyncThunk(
  "Chats/delete",
  async (id, { rejectWithValue }) => {
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
  }
);

// Create the ChatsSlice
export const ChatsSlice = createSlice({
  name: "Chats",
  initialState,
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
        if (action.payload.offset === 0 || state.isArchived !== action.payload.archive) {
          state.chats = action.payload.data.chats.results;
        } else {
          state.chats = [...state.chats, ...action.payload.data.chats.results];
        }
        state.inboxCount = action.payload.data.inbox_count;
        state.archivedCount = action.payload.data.archived_count;
        state.isArchived = action.payload.archive;
      })
      .addCase(listChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(chatsSuggestionList.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(chatsSuggestionList.fulfilled, (state, action) => {
        // state.loading = false;
        state.suggestionsList = action.payload.data;
      })
      .addCase(chatsSuggestionList.rejected, (state, action) => {
        // state.loading = false;
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
      .addCase(readChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(readChat.fulfilled, (state) => {
        state.loading = false;
        state.ChatSuccessAlert = true;
      })
      .addCase(readChat.rejected, (state, action) => {
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

// Export the reducer and actions
export default ChatsSlice.reducer;
