/* eslint-disable camelcase */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance, secureInstance } from "../../../axios/config";

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
    pagination: {
      count: 0,
      offset: 0,
      currentPage: 1,
      totalPages: 1,
      limit: 9,
      next: null,
      previous: null,
    },
    payload: {
      categories: [],
      subcategories: [],
      questions: [],
      commercialName: "",
      country: "",
    },
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

export const listAdsByFilter = createAsyncThunk(
  "Ads/listByFilter",
  async ({
    data, limit, offset, isLoggedIn,
  }, { rejectWithValue }) => {
    try {
      const req = isLoggedIn ? secureInstance : instance;
      const response = await req.request({
        url: `/api/ads/public-list/?limit=${limit}&offset=${offset}`,
        method: "Post",
        data,
      });
      return { ...response.data, filter: data.filter };
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

export const listAdsByPagination = createAsyncThunk(
  "Ads/listByPagination",
  async ({ data, limit, offset }, { rejectWithValue }) => {
    try {
      const response = await instance.request({
        url: `/api/ads/public-list/?limit=${limit}&offset=${offset}`,
        method: "Post",
        data,
      });
      return { ...response.data, offset };
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
    setSearchKeyword: (state, action) => {
      state.data.keyword.name = action.payload.name || "";
      state.data.keyword.type = action.payload.type || "";
    },
    setSearchFilters: (state, action) => {
      state.data.filters = action.payload.data.filter;
    },
    setCategories: (state, action) => {
      state.data.payload.categories = action.payload.categories;
    },
    setSubcategories: (state, action) => {
      state.data.payload.subcategories = action.payload.subcategories;
    },
    setQuestions: (state, action) => {
      state.data.payload.questions = action.payload.questions;
    },
    setCommercialName: (state, action) => {
      state.data.payload.commercialName = action.payload.commercialName;
    },
    setCountry: (state, action) => {
      state.data.payload.country = action.payload.country;
    },
    setAdsList: (state, action) => {
      state.data.adsList = action.payload;
    },
    setPayloadData: (state, action) => {
      switch (action.payload.data.type) {
        case "category":
          state.data.payload = {
            ...state.data.payload,
            categories: [action.payload.data.name],
          };
          break;
        case "sub_categories":
          state.data.payload = {
            ...state.data.payload,
            sub_categories: [action.payload.data.name],
          };
          break;
        case "country":
          state.data.payload = {
            ...state.data.payload,
            country: action.payload.data.name,
          };
          break;
        default:
          state.data.payload = {
            ...state.data.payload,
            commercial_name: action.payload.data.name,
          };
          break;
      }
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
      .addCase(listAdsByFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listAdsByFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.data.adsList = action.payload.data.data.results;
        state.data.pagination.count = action.payload.data.data.count;
        state.data.pagination.offset = 0;
        state.data.pagination.currentPage = 1;
        state.data.pagination.totalPages = parseInt((action.payload.data.data.count / state.data.pagination.limit), 10) + 1;
        state.data.pagination.next = action.payload.data.data.next;
        state.data.pagination.previous = action.payload.data.data.previous;
        if (action.payload.filter) {
          state.data.filters = action.payload.data.filter;
        }
      })
      .addCase(listAdsByFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(listAdsByPagination.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listAdsByPagination.fulfilled, (state, action) => {
        state.loading = false;
        state.data.adsList = action.payload.data.data.results;
        state.data.pagination.count = action.payload.data.data.count;
        state.data.pagination.offset = action.payload.offset;
        state.data.pagination.currentPage = (action.payload.offset / state.data.pagination.limit) + 1;
        state.data.pagination.totalPages = parseInt((action.payload.data.data.count / state.data.pagination.limit), 10) + 1;
        state.data.pagination.next = action.payload.data.data.next;
        state.data.pagination.previous = action.payload.data.data.previous;
      })
      .addCase(listAdsByPagination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  handleResgisterationStatus,
  setCategories,
  setCommercialName,
  setSearchKeyword,
  setSubcategories,
  setQuestions,
  setCountry,
  setAdsList,
  setPayloadData,
} = SearchSlice.actions;

// Export the reducer and actions
export default SearchSlice.reducer;
