/* eslint-disable camelcase */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { secureInstance } from "../../../axios/config";

// Create an initial state for the auth slice
const initialState = {
  loading: false,
  error: null,
  calendars: [],
  CalendarSuccessAlert: false,
  CalendarErrorAlert: false,
};

export const vendorCalendars = createAsyncThunk(
  "Calendars/list",
  async (data, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/analytics/ad-calender/",
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

export const updateCalendar = createAsyncThunk(
  "Calendars/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: `/api/analytics/ad-calender/${id}/update-calender/`,
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

export const setCalendarAvailability = createAsyncThunk(
  "Calendars/availability",
  async ({ id, hide, index }, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: `/api/analytics/ad-calender/${id}/set-calender-availability/`,
        method: "Post",
        data: { hide },
      });
      return { ...response.data, index };
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

// Create the CalendarsSlice
export const CalendarsSlice = createSlice({
  name: "Calendars",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(vendorCalendars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(vendorCalendars.fulfilled, (state, action) => {
        state.loading = false;
        state.calendars = action.payload.data;
      })
      .addCase(vendorCalendars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCalendar.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setCalendarAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setCalendarAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.calendars[action.payload.index] = action.payload.data;
      })
      .addCase(setCalendarAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer and actions
export default CalendarsSlice.reducer;
