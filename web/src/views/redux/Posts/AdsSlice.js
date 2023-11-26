/* eslint-disable camelcase */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance, secureInstance } from "../../../axios/config";

// Create an initial state for the auth slice
const initialState = {
  AdPostErrorAlert: false,
  AdPostSuccessAlert: false,
  calendar: null,
  countries: [],
  count: 0,
  error: null,
  submittedAdId: null,
  vendorAds: [],
  vendorAdNames: [],
  premiumVenueAds: [],
  premiumVendorAds: [],
  favoriteAds: [],
  imagesError: false,
  isMediaUploading: false,
  loading: false,
  mediaError: null,
  deletedUrls: [],
  media_urls: {
    images: [],
    video: [],
    pdf: [],
  },
  media: {
    images: [],
    video: [],
    pdf: [],
  },
  publicAds: [],
  venueCountries: [],
};

export const handleCreateNewAd = createAsyncThunk(
  "Ads/create",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/ads/",
        method: "Post",
        data,
      });

      return response.data;
    } catch (err) {
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
      return { ...response.data, id: adID };
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

export const uploadMediaFiles = createAsyncThunk(
  "Ads/uploadMediaFiles",
  async ({ id, files, navigate }, { rejectWithValue }) => {
    const formData = new FormData();

    files.forEach((file) => { formData.append("file", file); });

    try {
      const response = await secureInstance.request({
        url: `/api/ads/${id}/upload-media/`,
        method: "POST",
        data: formData,
      });

      return { ...response.data, navigate };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const uploadImageToCloud = createAsyncThunk(
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
      return response.data;
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

export const listCountries = createAsyncThunk(
  "Ads/listCountries",
  async (isLoggedIn, { rejectWithValue }) => {
    try {
      const request = isLoggedIn ? secureInstance : instance;
      const response = await request.request({
        url: "/api/ads/country/",
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

export const getVendorAdNames = createAsyncThunk(
  "Ads/vendorAdNames",
  async (data, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: "/api/ads/my-ads/",
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

export const listPremiumVenues = createAsyncThunk(
  "Ads/premiumVenues",
  async (isLoggedIn, { rejectWithValue }) => {
    try {
      const request = isLoggedIn ? secureInstance : instance;
      const response = await request.request({
        url: "/api/ads/premium-venues/",
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

export const listPremiumVendors = createAsyncThunk(
  "Ads/premiumVendors",
  async (isLoggedIn, { rejectWithValue }) => {
    try {
      const request = isLoggedIn ? secureInstance : instance;
      const response = await request.request({
        url: "/api/ads/premium-vendors/",
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

export const listFavoriteAds = createAsyncThunk(
  "Ads/favoriteList",
  async ({ limit, offset }, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: `/api/analytics/ad-fav?limit=${limit}&offset=${offset}`,
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

export const favoriteAd = createAsyncThunk(
  "Ads/fav-ad",
  async (id, { rejectWithValue }) => {
    try {
      const response = await secureInstance.request({
        url: `/api/analytics/ad-fav/${id}/fav/`,
        method: "Post",
      });
      return { ...response.data, id };
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  },
);

export const venueCountries = createAsyncThunk(
  "Ads/venueCountries",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.request({
        url: "/api/ads/venue-countries/",
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

export const adCalendar = createAsyncThunk(
  "Ads/calendar",
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.request({
        url: `/api/ads/${id}/calender/`,
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

// Create the loginSlice
export const AdsSlice = createSlice({
  name: "Ads",
  initialState,
  reducers: {
    handleUpdateAds: (state, action) => {
      state.vendorAds = action.payload;
    },
    handleUpdateAdPostSuccessAlerting: (state, action) => {
      state.AdPostSuccessAlert = action.payload;
    },
    handleUpdateAdPostErrorAlerting: (state, action) => {
      state.AdPostErrorAlert = action.payload;
    },
    resetSubmittedAdId: (state) => {
      state.submittedAdId = null;
    },
    setDeletedUrls: (state, action) => {
      state.deletedUrls = action.payload;
    },
    setImagesToUpload: (state, action) => {
      state.media_urls.images = action.payload;
    },
    setVideosToUpload: (state, action) => {
      state.media_urls.video = action.payload;
    },
    setPDFsToUpload: (state, action) => {
      state.media_urls.pdf = action.payload;
    },
    setMediaImages: (state, action) => {
      state.media.images = action.payload;
    },
    setMediaVideos: (state, action) => {
      state.media.video = action.payload;
    },
    setMediaPDF: (state, action) => {
      state.media.pdf = action.payload;
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
      .addCase(handleCreateNewAd.fulfilled, (state, action) => {
        state.loading = false;
        state.AdPostSuccessAlert = true;
        // state.media_urls.images = [];
        state.submittedAdId = action.payload.data.id;
      })
      .addCase(handleCreateNewAd.rejected, (state) => {
        state.loading = false;
        state.AdPostErrorAlert = true;
        // state.error = action.payload;
      })
      .addCase(uploadMediaFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadMediaFiles.fulfilled, (state, action) => {
        const { navigate } = action.payload;
        state.loading = false;
        state.AdPostSuccessAlert = true;
        state.media.images = [];
        state.media.video = [];
        state.media.pdf = [];
        navigate("/my-ads");
      })
      .addCase(uploadMediaFiles.rejected, (state) => {
        state.loading = false;
        state.AdPostErrorAlert = true;
        // state.error = action.payload;
      })
      .addCase(handleEditAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleEditAd.fulfilled, (state, action) => {
        state.loading = false;
        state.AdPostSuccessAlert = true;
        state.submittedAdId = action.payload.id;
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
      .addCase(getVendorAdNames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVendorAdNames.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorAdNames = action.payload.data;
      })
      .addCase(getVendorAdNames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(listPremiumVenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listPremiumVenues.fulfilled, (state, action) => {
        state.loading = false;
        state.premiumVenueAds = action.payload.data;
      })
      .addCase(listPremiumVenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(listPremiumVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listPremiumVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.premiumVendorAds = action.payload.data;
      })
      .addCase(listPremiumVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(listCountries.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(listCountries.fulfilled, (state, action) => {
        // state.loading = false;
        state.countries = action.payload.data;
      })
      .addCase(listCountries.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadImageToCloud.pending, (state) => {
        state.loading = true;
        state.error = null;
        // state.isMediaUploading = true;
      })
      .addCase(uploadImageToCloud.fulfilled, (state, action) => {
        const { file_url } = action.payload.data;
        state.loading = false;
        state.media_urls.images.push(file_url);
        state.imagesError = false;
        // state.isMediaUploading = false;
      })
      .addCase(uploadImageToCloud.rejected, (state, action) => {
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
        if (
          action.payload.offset === 0
          || state.isArchived !== action.payload.archive
        ) {
          state.favoriteAds = action.payload.data.results;
        } else {
          state.favoriteAds = [
            ...state.favoriteAds,
            ...action.payload.data.results,
          ];
        }
        state.count = action.payload.data.count;
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
          state.premiumVenueAds = state.premiumVenueAds.map((ad) => {
            if (ad.id === action.payload.id) ad.fav = !ad.fav;
            return ad;
          });
          state.premiumVendorAds = state.premiumVendorAds.map((ad) => {
            if (ad.id === action.payload.id) ad.fav = !ad.fav;
            return ad;
          });
          state.favoriteAds = state.favoriteAds.filter(
            (ad) => ad.ad.id !== action.payload.id,
          );
        }
      })
      .addCase(favoriteAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.AdPostErrorAlert = action.payload;
      })
      .addCase(venueCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(venueCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.venueCountries = action.payload.data;
      })
      .addCase(venueCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(adCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.calendar = action.payload.data;
      })
      .addCase(adCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  handleUpdateAds,
  handleUpdateAdPostSuccessAlerting,
  handleUpdateAdPostErrorAlerting,
  setImagesError,
  resetSubmittedAdId,
  setDeletedUrls,
  setImagesToUpload,
  setVideosToUpload,
  setPDFsToUpload,
  setIsMediaUploading,
  setMediaError,
  setMediaImages,
  setMediaVideos,
  setMediaPDF,
} = AdsSlice.actions;

// Export the reducer and actions
export default AdsSlice.reducer;
