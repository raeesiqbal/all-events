/* eslint-disable camelcase */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../axios/config";

// Create an initial state for the auth slice
const initialState = {
  loading: false,
  error: null,
  headers: [],
  UtilSuccessAlert: false,
  UtilErrorAlert: false,
};

export const getHeadersData = createAsyncThunk(
  "Utils/headers",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.request({
        url: "/api/utils/get-header/",
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

// Create the UtilsSlice
export const UtilsSlice = createSlice({
  name: "Utils",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getHeadersData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHeadersData.fulfilled, (state, action) => {
        state.loading = false;
        state.headers = action.payload.data;
      })
      .addCase(getHeadersData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer and actions
export default UtilsSlice.reducer;
