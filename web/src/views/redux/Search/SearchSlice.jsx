/* eslint-disable camelcase */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../axios/config";

// Create an initial state for the auth slice
const initialState = {
  loading: false,
  error: null,
  data: {
    suggestionsList: [],
    adsList: [],
    filters: [],
    keyword: {
      name: "",
      type: "",
    },
    count: 0,
    next: null,
    previous: null,
  },
  SearchSuccessAlert: false,
  SearchErrorAlert: false,
};

export const listSuggestions = createAsyncThunk(
  "Suggestions/list",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.request({
        url: `/api/ads/suggestion-list/`,
        method: "Post",
        data,
      });
      return { ...response.data, keyword: data.search_string };
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

const getDataForSearchKeyword = (data) => {
  let payload = {
    data: {
      categories: [],
      sub_categories: [],
      questions: [],
      commercial_name: "",
    },
    filter: true,
  };

  switch (data.type) {
    case "category":
      payload = { ...payload, data: { categories: [...payload.data.categories, data.name] } };
      break;
    case "sub_categories":
      payload = { ...payload, data: { sub_categories: [...payload.data.sub_categories, data.name] } };
      break;
    default:
      payload = { ...payload, data: { commercial_name: data.name } };
      break;
  }

  return payload;
};

export const listAdsByKeyword = createAsyncThunk(
  "Ads/listByKeyword",
  async ({ keyword, limit, offset }, { rejectWithValue }) => {
    try {
      const data = getDataForSearchKeyword(keyword);
      const response = await instance.request({
        url: `/api/ads/public-list/?limit=${limit}&offset=${offset}`,
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

export const listAdsByFilter = createAsyncThunk(
  "Ads/listByFilter",
  async ({ data, limit, offset }, { rejectWithValue }) => {
    try {
      const response = await instance.request({
        url: `/api/ads/public-list/?limit=${limit}&offset=${offset}`,
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

// Create the SearchSlice
export const SearchSlice = createSlice({
  name: "Search",
  initialState,
  reducers: {
    handleResgisterationStatus: (state) => {
      state.isRegistered = false;
    },
    setSearchKeyword: (state, action) => {
      state.data.keyword.name = action.payload.name;
      state.data.keyword.type = action.payload.type;
    },
    setSearchFilters: (state, action) => {
      state.data.filters = action.payload.data.filter;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.data.suggestionsList = action.payload.data;
        state.data.keyword.name = action.payload.keyword;
      })
      .addCase(listSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data.suggestionsList = [];
        state.data.keyword.name = "";
        state.data.keyword.type = "";
      })
      .addCase(listAdsByKeyword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listAdsByKeyword.fulfilled, (state, action) => {
        state.loading = false;
        state.data.adsList = action.payload.data.data.results;
        state.data.count = action.payload.data.data.count;
        state.data.next = action.payload.data.data.next;
        state.data.previous = action.payload.data.data.previous;
        state.data.filters = action.payload.data.filter;
      })
      .addCase(listAdsByKeyword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(listAdsByFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listAdsByFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.data.adsList = action.payload.data.data.results;
        state.data.count = action.payload.data.data.count;
        state.data.next = action.payload.data.data.next;
        state.data.previous = action.payload.data.data.previous;
      })
      .addCase(listAdsByFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  handleResgisterationStatus,
  setSearchKeyword,
} = SearchSlice.actions;

// Export the reducer and actions
export default SearchSlice.reducer;
