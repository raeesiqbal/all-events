/* eslint-disable camelcase */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { secureInstance } from "../../../axios/config";

// Create an initial state for the auth slice
const initialState = {
  loading: false,
  error: null,
  contacts: [],
  ContactSuccessAlert: false,
  ContactErrorAlert: false,
};

export const handleStartContact = createAsyncThunk(
  "Contacts/create",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/analytics/ad-contact/",
        method: "Post",
        data,
      });
      // setTimeout(() => {
      //   navigate("/contact-messages");
      // }, 1000);
      return response.data;
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

export const listContacts = createAsyncThunk(
  "Contacts/list",
  async (data, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/analytics/ad-contact/",
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

// Create the ContactsSlice
export const ContactsSlice = createSlice({
  name: "Contacts",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(handleStartContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleStartContact.fulfilled, (state) => {
        state.loading = false;
        state.ContactSuccessAlert = true;
      })
      .addCase(handleStartContact.rejected, (state, action) => {
        state.loading = false;
        state.ContactErrorAlert = action.payload;
        // state.error = action.payload;
      })
      .addCase(listContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data;
      })
      .addCase(listContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer and actions
export default ContactsSlice.reducer;
