import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeStep: 0,
};

export const stepperSlice = createSlice({
  name: "stepper",
  initialState,
  reducers: {
    handleNextStep: (state) => {
      state.activeStep += 1;
    },
    handlePrevStep: (state) => {
      state.activeStep -= 1;
    },
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
      // state.activeStep -= 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  handleNextStep, handlePrevStep, setActiveStep,
} = stepperSlice.actions;

export default stepperSlice.reducer;
