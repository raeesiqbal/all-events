import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isRegisterModal: false,
  isRegisterView: false,
};

export const registerSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    toggleRegisterModal: (state) => {
      state.isRegisterModal = !state.isRegisterModal;
    },
    toggleRegisterView: (state) => {
      state.isRegisterView = !state.isRegisterView;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleRegisterModal, toggleRegisterView } = registerSlice.actions;

export default registerSlice.reducer;
