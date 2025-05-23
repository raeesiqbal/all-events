/* eslint-disable camelcase */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance, secureInstance } from "../../../axios/config";

// Create an initial state for the auth slice
const initialState = {
  loading: false,
  error: null,
  reviews: {
    data: [],
    averageRating: 0,
    totalReviews: 0,
  },
  // additionalInfo: null,
  ReviewSuccessAlert: false,
  ReviewErrorAlert: false,
};

export const addReview = createAsyncThunk(
  "Reviews/add",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: `/api/analytics/ad-review/${id}/review-create/`,
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

export const listAdReviews = createAsyncThunk(
  "Reviews/list",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.request({
        url: `/api/analytics/ad-review/${data.id}/list?limit=${data.limit}&offset=${data.offset}&page=${data.page}`,
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

// Create the ReviewsSlice
export const ReviewsSlice = createSlice({
  name: "Reviews",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state) => {
        state.loading = false;
        state.ReviewSuccessAlert = true;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.ReviewErrorAlert = action.payload;
      })
      .addCase(listAdReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listAdReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = {
          data: action.payload.data.reviews.results,
          averageRating: action.payload.data.avg,
          totalReviews: action.payload.data.reviews.count,
        };
        // state.additionalInfo = action.payload.data.additional_info;
      })
      .addCase(listAdReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer and actions
export default ReviewsSlice.reducer;
