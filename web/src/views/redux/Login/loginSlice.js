import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoginModal: false,
  isLoginView: false,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    toggleLoginModal: (state) => {
      state.isLoginModal = !state.isLoginModal;
    },
    toggleLoginView: (state) => {
      state.isLoginView = !state.isLoginView;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  toggleLoginModal, toggleLoginView, decrement, incrementByAmount,
} = loginSlice.actions;

export default loginSlice.reducer;
