/* eslint-disable camelcase */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance, secureInstance } from "../../../axios/config";

// Create an initial state for the auth slice
const initialState = {
  loading: false,
  error: null,
  vendorAds: [],
  publicAds: [],
  favoriteAds: [],
  media_urls: {
    images: [],
    video: [],
    pdf: [],
  },
  AdPostSuccessAlert: false,
  AdPostErrorAlert: false,
  imagesError: false,
  isMediaUploading: false,
  mediaError: null,
};

export const handleCreateNewAd = createAsyncThunk(
  "Ads/create",
  async ({ data, navigate }, { rejectWithValue }) => {
    // const dataToSubmit = objToSubmit
    try {
      const response = await secureInstance.request({
        url: "/api/ads/",
        method: "Post",
        data,
      });
      setTimeout(() => {
        navigate("/my-ads");
      }, 1000);
      return response.data; // Assuming your loginAPI returns data with access_token, user_id, and role_id
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

export const handleEditAd = createAsyncThunk(
  "Ads/edit",
  async ({ data, navigate, adID }, { rejectWithValue }) => {
    // const dataToEdit = data;
    try {
      const response = await secureInstance.request({
        url: `/api/ads/${adID}/`,
        method: "Patch",
        data,
      });
      setTimeout(() => {
        navigate("/my-ads");
      }, 1000);
      return response.data; // Assuming your loginAPI returns data with access_token, user_id, and role_id
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

export const uploadImagesToCloud = createAsyncThunk(
  "AdImage/upload",
  async (uploadedImage, { rejectWithValue }) => {
    // const dataToEdit = data;
    const formData = new FormData(); // pass in the form
    formData.append("file", uploadedImage);
    formData.append("content_type", uploadedImage.type);

    try {
      const response = await secureInstance.request({
        url: "/api/ads/upload-url/",
        method: "Post",
        data: formData,
      });

      // setImagesToUpload([...imagesToUpload, response.data.data.file_url]);

      return response.data;
      // setImageUrlToUpload(response.data.data);
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

export const listVendorAds = createAsyncThunk(
  "Ads/list",
  async (data, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/ads/",
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

export const listPublicAds = createAsyncThunk(
  "Ads/public_list",
  async (isLoggedIn, { rejectWithValue }) => {
    try {
      const request = isLoggedIn ? secureInstance : instance;
      const response = await request.request({
        url: "/api/ads/public-list/",
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

export const listFavoriteAds = createAsyncThunk(
  "Ads/favoriteList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/analytics/ad-fav/",
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

export const favoriteAd = createAsyncThunk(
  "Ads/fav-ad",
  async (id, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: `/api/analytics/ad-fav/${id}/fav/`,
        method: "Post",
      });
      return { ...response.data, id }; // Assuming your loginAPI returns data with access_token, user_id, and role_id
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

// Create the loginSlice
export const AdsSlice = createSlice({
  name: "Ads",
  initialState,
  reducers: {
    handleResgisterationStatus: (state) => {
      state.isRegistered = false;
    },
    handleUpdateAds: (state, action) => {
      state.vendorAds = action.payload;
    },
    handleUpdateAdPostSuccessAlerting: (state, action) => {
      state.AdPostSuccessAlert = action.payload;
    },
    handleUpdateAdPostErrorAlerting: (state, action) => {
      state.AdPostErrorAlert = action.payload;
    },
    setImagesToUpload: (state, action) => {
      state.media_urls.images = action.payload;
    },
    setImagesError: (state, action) => {
      state.imagesError = action.payload;
    },
    setIsMediaUploading: (state, action) => {
      state.isMediaUploading = action.payload;
    },
    setMediaError: (state, action) => {
      state.mediaError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleCreateNewAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleCreateNewAd.fulfilled, (state) => {
        state.loading = false;
        state.AdPostSuccessAlert = true;
        state.media_urls.images = [];
        // navigate("/post-ad");
      })
      .addCase(handleCreateNewAd.rejected, (state, action) => {
        state.loading = false;
        state.AdPostErrorAlert = true;
        // state.error = action.payload;
      })
      .addCase(handleEditAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleEditAd.fulfilled, (state) => {
        state.loading = false;
        state.AdPostSuccessAlert = true;
      })
      .addCase(handleEditAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.AdPostErrorAlert = action.payload;
      })
      .addCase(listVendorAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listVendorAds.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorAds = action.payload.data;
      })
      .addCase(listVendorAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(listPublicAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listPublicAds.fulfilled, (state, action) => {
        state.loading = false;
        state.publicAds = action.payload.data.data;
      })
      .addCase(listPublicAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadImagesToCloud.pending, (state) => {
        state.loading = true;
        state.error = null;
        // state.isMediaUploading = true;
      })
      .addCase(uploadImagesToCloud.fulfilled, (state, action) => {
        const { file_url } = action.payload.data;
        state.loading = false;
        state.media_urls.images.push(file_url);
        state.imagesError = false;
        // state.isMediaUploading = false;
      })
      .addCase(uploadImagesToCloud.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // state.isMediaUploading = false;
      })
      .addCase(listFavoriteAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listFavoriteAds.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteAds = action.payload.data;
      })
      .addCase(listFavoriteAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(favoriteAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(favoriteAd.fulfilled, (state, action) => {
        state.loading = false;
        state.AdPostSuccessAlert = true;
        if ([200, 201, 202, 203, 204].includes(action.payload.status_code)) {
          state.publicAds = state.publicAds.map((ad) => {
            if (ad.id === action.payload.id) ad.fav = !ad.fav;
            return ad;
          });
        }
      })
      .addCase(favoriteAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.AdPostErrorAlert = action.payload;
      });
  },
});

export const {
  handleResgisterationStatus,
  handleUpdateAds,
  handleUpdateAdPostSuccessAlerting,
  handleUpdateAdPostErrorAlerting,
  setImagesError,
  setImagesToUpload,
  setIsMediaUploading,
  setMediaError,
} = AdsSlice.actions;

// Export the reducer and actions
export default AdsSlice.reducer;
