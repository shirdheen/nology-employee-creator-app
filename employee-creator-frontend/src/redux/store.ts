import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./slices/employeeSlice";

// Creates and exports a Redux store
// Defines state slices
export const store = configureStore({
  reducer: {
    employees: employeeReducer, // Managed by employeeReducer (from employeeSlice.ts)
  },
});

export type RootState = ReturnType<typeof store.getState>; // Represents the entire Redux state
export type AppDispatch = typeof store.dispatch; // Represents Redux's dispatch function, allowing us to dispatch actions with the current types
